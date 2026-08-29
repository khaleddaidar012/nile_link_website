import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel, Customer, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import { recalculateCustomerAccountStatus } from "@/lib/engine/account-health-engine"
import { logDocumentActivity } from "@/lib/services/activity-log-service"

const verifySchema = z.object({
  status: z.enum(["approved", "rejected", "pending_review"]),
  title: z.string().optional(),
  category: z.string().optional(),
  startDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
  reviewNotes: z.string().nullable().optional(),
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

    if (session.role === "staff" && !session.staffPermissions?.canReviewDocuments) {
      return NextResponse.json(
        { error: "Access denied. You lack the 'canReviewDocuments' permission." },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const parsed = verifySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { status, title, category, startDate, expiryDate, rejectionReason, reviewNotes } =
      parsed.data

    if (status === "approved" && !expiryDate) {
      return NextResponse.json(
        { error: "Expiration date is required to approve a document" },
        { status: 400 }
      )
    }

    if (status === "rejected" && !rejectionReason) {
      return NextResponse.json(
        { error: "Rejection reason is mandatory when rejecting a document" },
        { status: 400 }
      )
    }

    await connectDB()
    const document = await DocumentModel.findById(id)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    const previousState = {
      status: document.status,
      startDate: document.startDate,
      expiryDate: document.expiryDate,
    }

    if (title) document.title = title
    if (category) document.category = category as any
    document.status = status
    document.startDate = startDate ? new Date(startDate) : undefined
    document.expiryDate = expiryDate ? new Date(expiryDate) : undefined
    document.rejectionReason = rejectionReason || undefined
    document.reviewNotes = reviewNotes || undefined
    document.reviewedBy = session.userId as any
    document.reviewedAt = new Date()

    await document.save()

    // Write activity audit log
    await logDocumentActivity({
      documentId: document._id,
      customerId: document.customerId,
      actorId: session.userId,
      actorType: "staff",
      actorName: `${session.firstName} ${session.lastName}`,
      action: status === "approved" ? "approve" : status === "rejected" ? "reject" : "update_dates",
      previousState,
      newState: { status, startDate, expiryDate, rejectionReason, reviewNotes },
      notes: reviewNotes || (status === "approved" ? "Document approved" : `Rejected: ${rejectionReason}`),
      ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0] || "",
      userAgent: req.headers.get("user-agent") || "",
    })

    // Recalculate customer account health
    const healthResult = await recalculateCustomerAccountStatus(document.customerId, session.userId)

    // Notify customer in-app
    await Notification.create({
      recipientCustomerId: document.customerId,
      targetAudience: "customer",
      title: status === "approved" ? "Document Approved" : "Document Verification Notice",
      message:
        status === "approved"
          ? `Your document "${document.title}" was approved by NileLink staff.`
          : `Your document "${document.title}" was rejected. Reason: ${rejectionReason}`,
      channel: "in_app",
      type: status === "approved" ? "document_approved" : "document_rejected",
      severity: status === "approved" ? "normal" : "urgent",
      relatedDocumentId: document._id,
      actionUrl: "/portal/documents",
    })

    return NextResponse.json({
      success: true,
      message: `Document status updated to ${status}`,
      document: {
        id: document._id.toString(),
        title: document.title,
        status: document.status,
        startDate: document.startDate,
        expiryDate: document.expiryDate,
      },
      customerHealth: healthResult,
    })
  } catch (error: unknown) {
    console.error("Document verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
