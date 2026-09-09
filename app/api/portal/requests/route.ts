import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { CustomerRequest, Notification, User, RequestService } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

const createRequestSchema = z.object({
  services: z
    .array(
      z.object({
        serviceKey: z.string(),
        details: z.any().optional(),
      })
    )
    .min(1, "At least one service is required"),
  operationType: z.enum(["import", "export", "transit", "none"]).default("none"),
  subject: z.string().min(3, "Subject is required"),
  description: z.string().min(5, "Description is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    let customerId = session.customerId
    if (!customerId) {
      const user = await User.findById(session.userId)
      customerId = user?.customerId?.toString()
    }

    if (!customerId) {
      return NextResponse.json({ requests: [] })
    }

    const requests = await CustomerRequest.find({ customerId })
      .populate("services")
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
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    let customerId = session.customerId
    if (!customerId) {
      const user = await User.findById(session.userId)
      customerId = user?.customerId?.toString()
    }

    if (!customerId) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 400 })
    }

    const body = await req.json()
    const parsed = createRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const year = new Date().getFullYear()
    const randomSeq = Math.floor(1000 + Math.random() * 9000)
    const trackingNumber = `NL-REQ-${year}-${randomSeq}`

    const initialStatus = ["import", "export", "transit"].includes(parsed.data.operationType) 
      ? "document_required" 
      : "submitted"

    const newRequest = await CustomerRequest.create({
      customerId,
      requestedBy: session.userId,
      trackingNumber,
      operationType: parsed.data.operationType,
      subject: parsed.data.subject,
      description: parsed.data.description,
      priority: parsed.data.priority,
      status: initialStatus,
      services: [], // Populated below
      timeline: [
        {
          status: "submitted",
          title: "Request Submitted by Client",
          comment: "Initial order inquiry received.",
          createdAt: new Date(),
        },
        ...(initialStatus === "document_required" ? [{
          status: "document_required",
          title: "Document Required",
          comment: "Please upload the required documents (UCR/ACID) to proceed.",
          createdAt: new Date(),
        }] : [])
      ],
    })

    const requestServiceIds = []
    const serviceNames = []

    for (const srv of parsed.data.services) {
      const newService = await RequestService.create({
        requestId: newRequest._id,
        serviceKey: srv.serviceKey,
        status: "pending",
        details: srv.details || {},
        timeline: [
          {
            status: "pending",
            title: "Service Added",
            comment: "Service selected during request creation.",
            createdAt: new Date(),
          },
        ],
      })
      requestServiceIds.push(newService._id)
      serviceNames.push(srv.serviceKey.replace("_", " "))
    }

    newRequest.services = requestServiceIds
    await newRequest.save()

    // Staff notification
    await Notification.create({
      recipientCustomerId: session.customerId || undefined,
      targetAudience: "staff",
      title: `New Service Request: ${trackingNumber}`,
      message: `${session.firstName} requested: ${serviceNames.join(", ")}.`,
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
    return NextResponse.json(
      { error: "Internal server error", details: (error as any).message || String(error) },
      { status: 500 }
    )
  }
}
