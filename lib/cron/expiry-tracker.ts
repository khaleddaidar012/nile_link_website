import { connectDB } from "@/lib/mongodb"
import { Document as DocumentModel, Customer, Notification, User } from "@/lib/models"

export interface ExpiryCheckResult {
  totalEvaluated: number
  tier30Alerts: number
  tier20Alerts: number
  tier10Alerts: number
  tier5Alerts: number
  expiredCount: number
  notificationsCreated: number
}

/**
 * Evaluates all active/approved documents against the current time.
 * Triggers progressive alert tiers:
 * - 30 days: First Advisory Reminder
 * - 20 days: Second Urgent Reminder
 * - 10 days: Critical Escalation Notice
 * - 5 days: Final Clearance Freeze Notice
 * - <= 0 days: Expired Hold
 */
export async function runExpiryEvaluation(): Promise<ExpiryCheckResult> {
  await connectDB()

  const now = new Date()
  const nowMs = now.getTime()
  const ONE_DAY_MS = 24 * 60 * 60 * 1000

  // Find all approved or expiring_soon unarchived documents that have an expiryDate
  const documents = await DocumentModel.find({
    isArchived: false,
    expiryDate: { $ne: null },
    status: { $in: ["approved", "expiring_soon", "expired"] },
  }).populate("customerId")

  let tier30Alerts = 0
  let tier20Alerts = 0
  let tier10Alerts = 0
  let tier5Alerts = 0
  let expiredCount = 0
  let notificationsCreated = 0

  for (const doc of documents) {
    if (!doc.expiryDate) continue

    const expiryMs = new Date(doc.expiryDate).getTime()
    const diffMs = expiryMs - nowMs
    const daysLeft = Math.ceil(diffMs / ONE_DAY_MS)

    const customer = doc.customerId as any
    if (!customer) continue

    // Find company users to notify
    const customerUsers = await User.find({ customerId: customer._id })

    if (daysLeft <= 0) {
      // Document Expired
      if (doc.status !== "expired") {
        doc.status = "expired"
        doc.warningEscalationTier = "expired"
        doc.lastNotificationSentAt = now
        await doc.save()

        expiredCount++

        for (const u of customerUsers) {
          await Notification.create({
            recipientCustomerId: customer._id,
            recipientUserId: u._id,
            relatedDocumentId: doc._id,
            title: `CRITICAL: Document '${doc.title}' has Expired`,
            message: `The official document '${doc.title}' expired on ${new Date(doc.expiryDate).toLocaleDateString()}. Port operations and clearance requests may be restricted until renewed.`,
            channel: "multi",
            type: "document_expired",
            severity: "critical",
            targetAudience: "customer",
            actionUrl: "/portal/documents",
          })
          notificationsCreated++
        }
      }
    } else if (daysLeft <= 5) {
      // Tier 5: Final 5-Day Alert
      if (doc.status !== "expiring_soon") {
        doc.status = "expiring_soon"
      }
      doc.warningEscalationTier = "critical"
      
      const shouldAlert =
        !doc.lastNotificationSentAt ||
        nowMs - new Date(doc.lastNotificationSentAt).getTime() > 4 * ONE_DAY_MS

      if (shouldAlert) {
        doc.lastNotificationSentAt = now
        await doc.save()
        tier5Alerts++

        for (const u of customerUsers) {
          await Notification.create({
            recipientCustomerId: customer._id,
            recipientUserId: u._id,
            relatedDocumentId: doc._id,
            title: `URGENT (5 Days Left): '${doc.title}' Expiring Soon`,
            message: `Only 5 days remain before '${doc.title}' expires on ${new Date(doc.expiryDate).toLocaleDateString()}. Upload your renewed certificate now to prevent clearance delays.`,
            channel: "multi",
            type: "document_expiring_3d",
            severity: "critical",
            targetAudience: "customer",
            actionUrl: "/portal/documents",
          })
          notificationsCreated++
        }
      }
    } else if (daysLeft <= 10) {
      // Tier 10: Critical 10-Day Alert
      if (doc.status !== "expiring_soon") {
        doc.status = "expiring_soon"
      }
      doc.warningEscalationTier = "critical"

      const shouldAlert =
        !doc.lastNotificationSentAt ||
        nowMs - new Date(doc.lastNotificationSentAt).getTime() > 4 * ONE_DAY_MS

      if (shouldAlert) {
        doc.lastNotificationSentAt = now
        await doc.save()
        tier10Alerts++

        for (const u of customerUsers) {
          await Notification.create({
            recipientCustomerId: customer._id,
            recipientUserId: u._id,
            relatedDocumentId: doc._id,
            title: `CRITICAL (10 Days Left): '${doc.title}' Renewal Required`,
            message: `'${doc.title}' will expire in 10 days (${new Date(doc.expiryDate).toLocaleDateString()}). Please upload updated legal documentation immediately.`,
            channel: "multi",
            type: "document_expiring_10d",
            severity: "urgent",
            targetAudience: "customer",
            actionUrl: "/portal/documents",
          })
          notificationsCreated++
        }
      }
    } else if (daysLeft <= 20) {
      // Tier 20: 20-Day Warning
      doc.warningEscalationTier = "urgent"

      const shouldAlert =
        !doc.lastNotificationSentAt ||
        nowMs - new Date(doc.lastNotificationSentAt).getTime() > 7 * ONE_DAY_MS

      if (shouldAlert) {
        doc.lastNotificationSentAt = now
        await doc.save()
        tier20Alerts++

        for (const u of customerUsers) {
          await Notification.create({
            recipientCustomerId: customer._id,
            recipientUserId: u._id,
            relatedDocumentId: doc._id,
            title: `Renewal Advisory (20 Days Left): '${doc.title}'`,
            message: `Official document '${doc.title}' expires in 20 days (${new Date(doc.expiryDate).toLocaleDateString()}). Prepare your renewal paperwork to avoid compliance holds.`,
            channel: "in_app",
            type: "document_expiring_10d",
            severity: "warning",
            targetAudience: "customer",
            actionUrl: "/portal/documents",
          })
          notificationsCreated++
        }
      }
    } else if (daysLeft <= 30) {
      // Tier 30: 30-Day Early Warning
      doc.warningEscalationTier = "warning"

      const shouldAlert =
        !doc.lastNotificationSentAt ||
        nowMs - new Date(doc.lastNotificationSentAt).getTime() > 10 * ONE_DAY_MS

      if (shouldAlert) {
        doc.lastNotificationSentAt = now
        await doc.save()
        tier30Alerts++

        for (const u of customerUsers) {
          await Notification.create({
            recipientCustomerId: customer._id,
            recipientUserId: u._id,
            relatedDocumentId: doc._id,
            title: `Advance Expiry Notice (30 Days Left): '${doc.title}'`,
            message: `Official document '${doc.title}' will expire on ${new Date(doc.expiryDate).toLocaleDateString()} (30 days left).`,
            channel: "in_app",
            type: "document_expiring_10d",
            severity: "normal",
            targetAudience: "customer",
            actionUrl: "/portal/documents",
          })
          notificationsCreated++
        }
      }
    } else {
      // Document is healthy (> 30 days)
      if (doc.status === "expiring_soon") {
        doc.status = "approved"
      }
      doc.warningEscalationTier = "none"
      await doc.save()
    }
  }

  return {
    totalEvaluated: documents.length,
    tier30Alerts,
    tier20Alerts,
    tier10Alerts,
    tier5Alerts,
    expiredCount,
    notificationsCreated,
  }
}
