import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel, Customer, Notification } from "@/lib/models"
import { recalculateCustomerAccountStatus } from "@/lib/engine/account-health-engine"
import { logDocumentActivity } from "@/lib/services/activity-log-service"

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "nilelink_cron_secret_key_2026"

    // Allow execution if authorized or in development
    if (
      process.env.NODE_ENV === "production" &&
      authHeader !== `Bearer ${cronSecret}`
    ) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 })
    }

    await connectDB()

    const now = new Date()
    const activeDocuments = await DocumentModel.find({
      status: { $in: ["approved", "expiring_soon"] },
      expiryDate: { $ne: null },
      isArchived: false,
    }).populate("customerId")

    let processedCount = 0
    let transitionedExpiredCount = 0
    let transitionedExpiringSoonCount = 0
    let notificationsDispatchedCount = 0

    for (const doc of activeDocuments) {
      if (!doc.expiryDate) continue
      processedCount++

      const cust = doc.customerId as any
      const customerId = cust?._id || doc.customerId
      const companyName = cust?.companyName || "Client Company"

      const expDate = new Date(doc.expiryDate)
      const diffTime = expDate.getTime() - now.getTime()
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // 1. Check if Expired
      if (daysRemaining < 0) {
        if (doc.status !== "expired") {
          doc.status = "expired"
          doc.warningEscalationTier = "expired"
          await doc.save()
          transitionedExpiredCount++

          await logDocumentActivity({
            documentId: doc._id,
            customerId,
            actorType: "system",
            actorName: "Expiry Detection Engine",
            action: "status_transition",
            previousState: { status: "expiring_soon" },
            newState: { status: "expired", daysRemaining },
            notes: `Document expired automatically on ${expDate.toISOString()}`,
          })

          await recalculateCustomerAccountStatus(customerId)

          // Dispatch Critical Expired Notification
          await Notification.create({
            recipientCustomerId: customerId,
            targetAudience: "customer",
            title: `Document Expired: ${doc.title}`,
            message: `Your company's ${doc.title} expired on ${expDate.toLocaleDateString()}. Services are restricted until renewed.`,
            channel: "multi",
            type: "document_expired",
            severity: "critical",
            relatedDocumentId: doc._id,
            actionUrl: "/portal/documents",
          })
          notificationsDispatchedCount++
        }
      }
      // 2. Check if Expiring Soon (<= 10 days)
      else if (daysRemaining <= 10) {
        if (doc.status !== "expiring_soon") {
          doc.status = "expiring_soon"
          transitionedExpiringSoonCount++
        }

        // Set escalation tier
        const tier =
          daysRemaining <= 2
            ? "critical"
            : daysRemaining <= 9
              ? "urgent"
              : "warning"

        doc.warningEscalationTier = tier
        await doc.save()
        await recalculateCustomerAccountStatus(customerId)

        // Deduplication check: check if notification already sent in last 24h
        const recentNotif = await Notification.findOne({
          relatedDocumentId: doc._id,
          type: daysRemaining === 10 ? "document_expiring_10d" : "document_expiring_3d",
          createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        })

        if (!recentNotif && (daysRemaining === 10 || daysRemaining === 7 || daysRemaining === 3 || daysRemaining === 1)) {
          const type =
            daysRemaining === 10
              ? "document_expiring_10d"
              : daysRemaining === 7
                ? "document_expiring_7d"
                : daysRemaining === 3
                  ? "document_expiring_3d"
                  : "document_expiring_1d"

          await Notification.create({
            recipientCustomerId: customerId,
            targetAudience: "customer",
            title: `Document Expiry Reminder (${daysRemaining} Days Left)`,
            message: `Your ${doc.title} will expire in ${daysRemaining} days. Please prepare renewal documents.`,
            channel: daysRemaining <= 3 ? "multi" : "email",
            type,
            severity: daysRemaining <= 3 ? "urgent" : "warning",
            relatedDocumentId: doc._id,
            actionUrl: "/portal/documents",
          })

          // Also alert staff
          await Notification.create({
            recipientCustomerId: customerId,
            targetAudience: "staff",
            title: `Client Document Expiry Warning: ${companyName}`,
            message: `${doc.title} for ${companyName} will expire in ${daysRemaining} days.`,
            channel: "in_app",
            type,
            severity: daysRemaining <= 3 ? "urgent" : "warning",
            relatedDocumentId: doc._id,
            actionUrl: "/admin/customers",
          })

          notificationsDispatchedCount++
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      transitionedExpired: transitionedExpiredCount,
      transitionedExpiringSoon: transitionedExpiringSoonCount,
      notificationsDispatched: notificationsDispatchedCount,
      timestamp: now.toISOString(),
    })
  } catch (error: unknown) {
    console.error("Cron check-expiries error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
