import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Quote, CustomerRequest, RequestService, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const quoteId = params.id
    const quote = await Quote.findById(quoteId)

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    if (quote.status !== "sent") {
      return NextResponse.json({ error: "Quote is not in a valid state to be accepted" }, { status: 400 })
    }

    // Update Quote
    quote.status = "accepted"
    await quote.save()

    // Update Request
    const request = await CustomerRequest.findById(quote.requestId)
    if (request) {
      request.status = "active" // Moves from quote_provided to active
      request.timeline.push({
        status: "active",
        title: "Quote Accepted",
        comment: `Customer accepted quote ${quote.quoteNumber}. Operations will now commence.`,
        updatedBy: session.userId,
        createdAt: new Date(),
      })
      await request.save()
    }

    // This handles REQ-017: lock in RequestService as an active "Booking"
    await RequestService.updateMany(
      { requestId: quote.requestId },
      { 
        $set: { status: "active" },
        $push: {
          timeline: {
            status: "active",
            title: "Service Activated",
            comment: "Quote was accepted. Service is now an active booking.",
            createdAt: new Date()
          }
        }
      }
    )

    // Notify Staff
    await Notification.create({
      targetAudience: "staff",
      title: `Quote Accepted: ${quote.quoteNumber}`,
      message: `The customer accepted the quote for request ${request?.trackingNumber}.`,
      channel: "in_app",
      type: "billing",
      severity: "success",
      relatedRequestId: quote.requestId,
    })

    return NextResponse.json({ success: true, message: "Quote accepted successfully" })
  } catch (error) {
    console.error("Accept quote error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
