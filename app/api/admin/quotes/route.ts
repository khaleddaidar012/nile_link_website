import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Quote, QuoteItem, CustomerRequest, RequestService, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const body = await req.json()
    const { requestId, customerId, validUntil, items, notes, currency } = body

    if (!requestId || !customerId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique quote number
    const year = new Date().getFullYear()
    const randomSeq = Math.floor(1000 + Math.random() * 9000)
    const quoteNumber = `NL-QT-${year}-${randomSeq}`

    // Calculate total
    let totalAmount = 0
    for (const item of items) {
      totalAmount += item.finalPrice
    }

    // Create the parent Quote
    const newQuote = await Quote.create({
      requestId,
      customerId,
      quoteNumber,
      status: "sent",
      totalAmount,
      currency: currency || "USD",
      validUntil: validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      notes,
      createdBy: session.userId,
    })

    // Create Quote Items
    for (const item of items) {
      await QuoteItem.create({
        quoteId: newQuote._id,
        requestServiceId: item.requestServiceId,
        serviceKey: item.serviceKey,
        basePrice: item.basePrice,
        additionalCharges: item.additionalCharges || 0,
        discount: item.discount || 0,
        finalPrice: item.finalPrice,
        currency: currency || "USD",
        auditTrail: [
          {
            updatedBy: session.userId as any,
            previousPrice: 0,
            newPrice: item.finalPrice,
            reason: "Initial Quote Generation",
            date: new Date(),
          },
        ],
      })
    }

    // Update CustomerRequest status
    const request = await CustomerRequest.findById(requestId)
    if (request) {
      request.status = "quote_provided"
      request.timeline.push({
        status: "quote_provided",
        title: "Quote Provided",
        comment: `Quote ${quoteNumber} has been sent to the customer for review.`,
        updatedBy: session.userId as any,
        createdAt: new Date(),
      })
      await request.save()
    }

    // Send Notification to Customer
    await Notification.create({
      recipientCustomerId: customerId,
      targetAudience: "customer",
      title: `New Quote Available: ${quoteNumber}`,
      message: `A quote of ${totalAmount} ${currency || "USD"} has been provided for your request.`,
      channel: "in_app",
      type: "request_update",
      severity: "normal",
      relatedRequestId: requestId,
    })

    return NextResponse.json({ success: true, quote: newQuote }, { status: 201 })
  } catch (error) {
    console.error("Quote generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
