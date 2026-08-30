import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel, Customer, Notification, User } from "@/lib/models"
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
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing document ID" }, { status: 400 })
    }

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

    let parsedStartDate: Date | undefined
    let parsedExpiryDate: Date | undefined

    if (startDate) {
      const d = new Date(startDate)
      if (isNaN(d.getTime())) {
        return NextResponse.json({ error: "Invalid start date format" }, { status: 400 })
      }
      parsedStartDate = d
    }

    if (expiryDate) {
      const d = new Date(expiryDate)
      if (isNaN(d.getTime())) {
        return NextResponse.json({ error: "Invalid expiration date format" }, { status: 400 })
      }
      parsedExpiryDate = d
    }

    if (status === "approved" && !parsedExpiryDate) {
      return NextResponse.json(
        { error: "Expiration date is required to approve a document" },
        { status: 400 }
      )
    }

    const sanitizedRejectionReason = rejectionReason?.trim() || undefined
    if (status === "rejected" && !sanitizedRejectionReason) {
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

    // Defensive fallback: resolve customerId from uploadedBy user if detached
    if (!document.customerId && document.uploadedBy) {
      const u = await User.findById(document.uploadedBy)
      if (u?.customerId) {
        document.customerId = u.customerId
      }
    }

    const previousState = {
      status: document.status,
      startDate: document.startDate,
      expiryDate: document.expiryDate,
    }

    if (title && title.trim()) document.title = title.trim()
    if (category) document.category = category as any
    document.status = status
    document.startDate = status === "approved" ? parsedStartDate : undefined
    document.expiryDate = status === "approved" ? parsedExpiryDate : undefined
    document.rejectionReason = status === "rejected" ? sanitizedRejectionReason : undefined
    document.reviewNotes = reviewNotes?.trim() || undefined
    document.reviewedBy = session.userId as any
    document.reviewedAt = new Date()

    await document.save()

    // 1. Audit log (resilient try/catch)
    try {
      if (document.customerId) {
        await logDocumentActivity({
          documentId: document._id,
          customerId: document.customerId,
          actorId: session.userId,
          actorType: "staff",
          actorName: `${session.firstName || "Staff"} ${session.lastName || ""}`.trim(),
          action: status === "approved" ? "approve" : status === "rejected" ? "reject" : "update_dates",
          previousState,
          newState: { status, startDate: parsedStartDate, expiryDate: parsedExpiryDate, rejectionReason: sanitizedRejectionReason, reviewNotes },
          notes: reviewNotes || (status === "approved" ? "Document approved" : `Rejected: ${sanitizedRejectionReason}`),
          ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0] || "",
          userAgent: req.headers.get("user-agent") || "",
        })
      }
    } catch (logErr) {
      console.warn("Non-fatal: DocumentActivityLog write failed:", logErr)
    }

    // 2. Recalculate customer account health (resilient try/catch)
    let healthResult = null
    if (document.customerId && mongoose.Types.ObjectId.isValid(document.customerId.toString())) {
      try {
        healthResult = await recalculateCustomerAccountStatus(document.customerId, session.userId)
      } catch (healthErr) {
        console.warn("Non-fatal: Health recalculation error:", healthErr)
      }
    }

    // 3. Notify customer in-app (resilient try/catch)
    if (document.customerId && mongoose.Types.ObjectId.isValid(document.customerId.toString())) {
      try {
        await Notification.create({
          recipientCustomerId: document.customerId,
          targetAudience: "customer",
          title: status === "approved" ? "Document Approved" : "Document Verification Notice",
          message:
            status === "approved"
              ? `Your document "${document.title || "Certificate"}" was approved by NileLink staff.`
              : `Your document "${document.title || "Certificate"}" was rejected. Reason: ${sanitizedRejectionReason || "Requirements not met"}`,
          channel: "in_app",
          type: status === "approved" ? "document_approved" : "document_rejected",
          severity: status === "approved" ? "normal" : "urgent",
          relatedDocumentId: document._id,
          actionUrl: "/portal/documents",
        })
      } catch (notifErr) {
        console.warn("Non-fatal: Customer notification dispatch failed:", notifErr)
      }
    }

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
    return NextResponse.json({ error: "Internal server error during document verification" }, { status: 500 })
  }
}
