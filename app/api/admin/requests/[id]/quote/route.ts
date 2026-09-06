import { NextRequest, NextResponse } from "next/server"
import { CustomerRequest, Notification } from "@/lib/models"
import { connectDB } from "@/lib/mongodb"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import mongoose from "mongoose"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "admin" && session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 })
    }

    const body = await req.json()
    const { departureDate, arrivalDate, transitTime, price, currency, notes } = body

    if (!departureDate || !arrivalDate || !price) {
      return NextResponse.json({ error: "Departure Date, Arrival Date, and Price are required" }, { status: 400 })
    }

    await connectDB()

    const request = await CustomerRequest.findById(id)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Update details.quote
    const quote = {
      departureDate,
      arrivalDate,
      transitTime,
      price,
      currency: currency || "USD",
      notes: notes || "",
      issuedAt: new Date(),
      issuedBy: session.userId
    }

    request.details = {
      ...request.details,
      quote
    }
    
    // Change status to quote_provided
    request.status = "quote_provided"

    // Append to timeline
    request.timeline.push({
      status: "quote_provided",
      title: "Schedule & Quote Provided",
      comment: `A schedule has been provided. Departure: ${departureDate}, Arrival: ${arrivalDate}. Price: ${price} ${currency || "USD"}. ${notes || ""}`,
      updatedBy: session.userId as any,
      createdAt: new Date(),
    })

    await request.save()

    // Notify Customer
    await Notification.create({
      recipientCustomerId: request.customerId,
      targetAudience: "customer",
      title: "Booking Schedule & Quote Provided",
      message: `We have provided a schedule for your request ${request.trackingNumber}. Please review the details.`,
      type: "request_update",
      channel: "in_app",
      severity: "normal",
      actionUrl: `/portal/requests`,
      relatedRequestId: request._id,
      isRead: false,
      emailStatus: "not_applicable",
      whatsappStatus: "not_applicable",
      dispatchedBy: session.userId,
    })

    return NextResponse.json({ success: true, request })
  } catch (error: any) {
    console.error("Provide Quote Error:", error)
    return NextResponse.json(
      { error: "Failed to provide quote", details: error.message },
      { status: 500 }
    )
  }
}
