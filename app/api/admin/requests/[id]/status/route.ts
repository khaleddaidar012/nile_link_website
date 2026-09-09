import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CustomerRequest, Notification, ServiceConfig } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import mongoose from "mongoose"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 })
    }

    const { status, comment } = await req.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    await connectDB()

    const request = await CustomerRequest.findById(id)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const allowedStatuses = [
      "submitted",
      "document_required",
      "document_under_review",
      "quote_pending",
      "quote_provided",
      "quote_accepted",
      "processing",
      "completed",
      "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Push new milestone to timeline
    request.timeline.push({
      status,
      title: statusConfig.labelEn,
      comment: comment || "The status of your service request has been updated.",
      createdAt: new Date(),
    })

    request.status = status
    await request.save()

    // Send notification to customer
    await Notification.create({
      recipientCustomerId: request.customerId,
      targetAudience: "customer",
      title: "Request Update",
      message: `Your request "${request.subject}" is now ${status.replace("_", " ")}.`,
      channel: "in_app",
      type: "request_update",
      severity: status === "completed" ? "normal" : status === "cancelled" ? "warning" : "normal",
      actionUrl: "/portal/requests",
      relatedRequestId: request._id,
      isRead: false,
      emailStatus: "not_applicable",
      whatsappStatus: "not_applicable",
      dispatchedBy: session.userId,
    })

    return NextResponse.json({ success: true, request })
  } catch (error: any) {
    console.error("Update request status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
