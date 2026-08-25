import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel, Customer, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import { logDocumentActivity } from "@/lib/services/activity-log-service"

const sendWarningSchema = z.object({
  channel: z.enum(["email", "whatsapp", "multi"]),
  customMessage: z.string().optional(),
  preset: z.string().optional().default("standard_10d"),
})

type Props = {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden: Staff access required" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = sendWarningSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { channel, customMessage } = parsed.data

    await connectDB()
    const document = await DocumentModel.findById(id)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const customer = await Customer.findById(document.customerId)
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const now = new Date()
    const daysRemaining = document.expiryDate
      ? Math.ceil((new Date(document.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0

    const warningText =
      customMessage ||
      `Urgent Reminder: Your company's legal document "${document.title}" is scheduled to expire in ${daysRemaining} days. Please upload an updated certificate immediately to maintain active shipping operations.`

    // Create Notification Record
    const notification = await Notification.create({
      recipientCustomerId: customer._id,
      targetAudience: "customer",
      title: `Expiry Warning: ${document.title}`,
      message: warningText,
      channel,
      type: "manual_staff_warning",
      severity: daysRemaining <= 3 ? "urgent" : "warning",
      relatedDocumentId: document._id,
      actionUrl: "/portal/documents",
      emailStatus: channel === "email" || channel === "multi" ? "sent" : "not_applicable",
      emailDeliveredAt: channel === "email" || channel === "multi" ? new Date() : undefined,
      whatsappStatus: channel === "whatsapp" || channel === "multi" ? "sent" : "not_applicable",
      whatsappDeliveredAt: channel === "whatsapp" || channel === "multi" ? new Date() : undefined,
      dispatchedBy: session.userId,
    })

    document.lastNotificationSentAt = new Date()
    await document.save()

    // Write Activity Log
    await logDocumentActivity({
      documentId: document._id,
      customerId: customer._id,
      actorId: session.userId,
      actorType: "staff",
      actorName: `${session.firstName} ${session.lastName}`,
      action:
        channel === "whatsapp"
          ? "send_whatsapp_warning"
          : channel === "email"
            ? "send_email_warning"
            : "send_email_warning",
      notes: `Manual expiry warning dispatched via ${channel.toUpperCase()}: ${warningText}`,
      ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0] || "",
      userAgent: req.headers.get("user-agent") || "",
    })

    return NextResponse.json({
      success: true,
      message: `Expiry warning dispatched to ${customer.companyName} via ${channel.toUpperCase()}`,
      notificationId: notification._id.toString(),
    })
  } catch (error: unknown) {
    console.error("Manual warning dispatch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
