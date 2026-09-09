import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CustomerRequest, Quote, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import mongoose from "mongoose"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 })
    }

    await connectDB()

    const request = await CustomerRequest.findById(id)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    if (request.status !== "quote_accepted") {
      return NextResponse.json({ error: "Request is not in quote_accepted status" }, { status: 400 })
    }

    // Ensure the associated quote is accepted
    const acceptedQuote = await Quote.findOne({ requestId: id, status: "accepted" })
    if (!acceptedQuote) {
      return NextResponse.json({ error: "No accepted quote found for this request" }, { status: 400 })
    }

    // Transition to processing
    request.status = "processing"
    request.timeline.push({
      status: "processing",
      title: "Order Confirmed & Processing Started",
      comment: `The shipment is now actively processing based on Quote ${acceptedQuote.quoteNumber}.`,
      updatedBy: session.userId as any,
      createdAt: new Date(),
    })

    await request.save()

    // Notify Customer
    await Notification.create({
      recipientCustomerId: request.customerId,
      targetAudience: "customer",
      title: "Order Processing Started",
      message: `Your order ${request.trackingNumber} is now actively processing.`,
      type: "request_update",
      severity: "normal",
      channel: "in_app",
      relatedRequestId: request._id,
      actionUrl: `/portal/requests/${request._id}`
    })

    return NextResponse.json({ success: true, request })
  } catch (error: any) {
    console.error("Confirm order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
