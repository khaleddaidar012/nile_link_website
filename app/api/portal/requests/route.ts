import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { CustomerRequest, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

const createRequestSchema = z.object({
  serviceType: z.enum([
    "freight_booking",
    "customs_clearance",
    "warehousing",
    "transportation",
    "general_inquiry",
  ]),
  subject: z.string().min(3, "Subject is required"),
  description: z.string().min(5, "Description is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || !session.customerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const requests = await CustomerRequest.find({ customerId: session.customerId })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ requests })
  } catch (error: unknown) {
    console.error("List requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || !session.customerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      )
    }

    await connectDB()

    const year = new Date().getFullYear()
    const randomSeq = Math.floor(1000 + Math.random() * 9000)
    const trackingNumber = `NL-REQ-${year}-${randomSeq}`

    const newRequest = await CustomerRequest.create({
      customerId: session.customerId,
      requestedBy: session.userId,
      trackingNumber,
      serviceType: parsed.data.serviceType,
      subject: parsed.data.subject,
      description: parsed.data.description,
      priority: parsed.data.priority,
      status: "submitted",
      timeline: [
        {
          status: "submitted",
          title: "Request Submitted by Client",
          comment: "Initial order inquiry received.",
          createdAt: new Date(),
        },
      ],
    })

    // Staff notification
    await Notification.create({
      recipientCustomerId: session.customerId,
      targetAudience: "staff",
      title: `New Service Request: ${trackingNumber}`,
      message: `${session.firstName} submitted a ${parsed.data.serviceType.replace("_", " ")} request.`,
      channel: "in_app",
      type: "request_update",
      severity: "normal",
      relatedRequestId: newRequest._id,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Service request submitted successfully",
        request: newRequest,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Create request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
