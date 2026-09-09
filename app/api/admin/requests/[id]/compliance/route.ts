import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CustomerRequest, Notification } from "@/lib/models"
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

    const body = await req.json()
    const { complianceType, complianceNumber } = body

    if (!complianceType || !complianceNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const request = await CustomerRequest.findById(id)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    request.complianceType = complianceType
    request.complianceNumber = complianceNumber

    // Add to timeline
    request.timeline.push({
      status: request.status,
      title: `${complianceType} Issued`,
      comment: `The ${complianceType} number has been successfully issued: ${complianceNumber}.`,
      updatedBy: session.userId as any,
      createdAt: new Date(),
    })

    await request.save()

    // Notify Customer
    await Notification.create({
      recipientCustomerId: request.customerId,
      targetAudience: "customer",
      title: `${complianceType} Number Issued`,
      message: `Your ${complianceType} number has been issued: ${complianceNumber}.`,
      type: "request_update",
      severity: "normal",
      channel: "in_app",
      relatedRequestId: request._id,
      actionUrl: `/portal/requests/${request._id}`
    })

    return NextResponse.json({ success: true, complianceNumber })
  } catch (error: any) {
    console.error("Provide compliance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
