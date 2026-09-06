import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Quote, CustomerRequest, Notification } from "@/lib/models"
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
      return NextResponse.json({ error: "Quote is not in a valid state to be rejected" }, { status: 400 })
    }

    // Update Quote
    quote.status = "rejected"
    await quote.save()

    // Update Request
    const request = await CustomerRequest.findById(quote.requestId)
    if (request) {
      request.status = "quote_rejected"
      request.timeline.push({
        status: "quote_rejected",
        title: "Quote Rejected",
        comment: `Customer rejected quote ${quote.quoteNumber}.`,
        updatedBy: session.userId,
        createdAt: new Date(),
      })
      await request.save()
    }

    // Notify Staff
    await Notification.create({
      targetAudience: "staff",
      title: `Quote Rejected: ${quote.quoteNumber}`,
      message: `The customer rejected the quote for request ${request?.trackingNumber}.`,
      channel: "in_app",
      type: "billing",
      severity: "warning",
      relatedRequestId: quote.requestId,
    })

    return NextResponse.json({ success: true, message: "Quote rejected" })
  } catch (error) {
    console.error("Reject quote error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
