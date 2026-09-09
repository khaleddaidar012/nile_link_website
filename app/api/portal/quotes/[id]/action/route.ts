import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Quote, CustomerRequest, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import mongoose from "mongoose"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || !session.role.startsWith("customer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const quoteId = resolvedParams.id

    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      return NextResponse.json({ error: "Invalid Quote ID" }, { status: 400 })
    }

    const { action, message } = await req.json()
    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    await connectDB()

    // Find quote
    const quote = await Quote.findById(quoteId)
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    // Verify ownership via request
    const request = await CustomerRequest.findOne({
      _id: quote.requestId,
      customerId: session.customerId,
    })

    if (!request) {
      return NextResponse.json({ error: "Unauthorized access to quote" }, { status: 403 })
    }

    if (action === "accept") {
      quote.status = "accepted"
      
      // Update request status
      request.status = "quote_accepted"
      request.timeline.push({
        status: "quote_accepted",
        title: "Quotation Accepted",
        comment: message || "The customer has accepted the quotation.",
        createdAt: new Date(),
      })

      // Notify Staff
      await Notification.create({
        targetAudience: "all_staff",
        title: "Quote Accepted",
        message: `Customer accepted quote for request ${request.trackingNumber}.`,
        channel: "in_app",
        type: "request_update",
        severity: "normal",
        actionUrl: `/admin/requests/${request._id}`,
        relatedRequestId: request._id,
        isRead: false,
      })
    } else if (action === "reject") {
      quote.status = "rejected"
      // Could push request status to something else if needed, e.g., quote_pending again
      request.timeline.push({
        status: request.status,
        title: "Quotation Rejected",
        comment: message || "The customer has rejected the quotation.",
        createdAt: new Date(),
      })

      // Notify Staff
      await Notification.create({
        targetAudience: "all_staff",
        title: "Quote Rejected",
        message: `Customer rejected quote for request ${request.trackingNumber}. Reason: ${message}`,
        channel: "in_app",
        type: "request_update",
        severity: "warning",
        actionUrl: `/admin/requests/${request._id}`,
        relatedRequestId: request._id,
        isRead: false,
      })
    }

    await quote.save()
    await request.save()

    return NextResponse.json({ success: true, quote, requestStatus: request.status })
  } catch (error: any) {
    console.error("Quote action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
