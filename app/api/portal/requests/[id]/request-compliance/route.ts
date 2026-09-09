import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CustomerRequest, Notification, User } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import mongoose from "mongoose"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || !session.role.startsWith("customer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 })
    }

    await connectDB()

    const request = await CustomerRequest.findOne({
      _id: id,
      customerId: session.customerId,
    })

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const body = await req.json()
    const { complianceType } = body // "ACID" or "UCR"

    if (!["ACID", "UCR"].includes(complianceType)) {
      return NextResponse.json({ error: "Invalid compliance type" }, { status: 400 })
    }

    // Add to timeline
    request.timeline.push({
      status: request.status,
      title: `${complianceType} Requested`,
      comment: `The customer has requested to get the ${complianceType} number to complete the request.`,
      updatedBy: session.userId as any,
      createdAt: new Date(),
    })

    await request.save()

    // Notify staff
    const staffMembers = await User.find({ role: { $in: ["staff", "super_admin"] } })
    const notifications = staffMembers.map((staff) => ({
      recipientUserId: staff._id,
      targetAudience: "staff",
      title: `${complianceType} Requested by Customer`,
      message: `Customer ${session.firstName} ${session.lastName} has requested the ${complianceType} number for request ${request.trackingNumber}.`,
      type: "action_required",
      severity: "high",
      channel: "in_app",
      relatedRequestId: request._id,
      actionUrl: `/admin/requests/${request._id}`
    }))

    if (notifications.length > 0) {
      await Notification.insertMany(notifications)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Request compliance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
