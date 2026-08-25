import mongoose from "mongoose"
import { Customer, Document as DocumentModel } from "@/lib/models"
import { logDocumentActivity } from "@/lib/services/activity-log-service"

export async function recalculateCustomerAccountStatus(
  customerId: string | mongoose.Types.ObjectId,
  triggerActorId?: string | mongoose.Types.ObjectId
): Promise<{ status: "active" | "warning" | "inactive"; reason: string }> {
  const customer = await Customer.findById(customerId)
  if (!customer) {
    return { status: "inactive", reason: "Customer record not found" }
  }

  const activeDocuments = await DocumentModel.find({
    customerId: customer._id,
    isArchived: false,
  })

  const now = new Date()
  let hasExpired = false
  let hasRejected = false
  let hasExpiringSoon = false
  let expiredDocTitle = ""
  let expiringSoonDocTitle = ""
  let daysUntilExpiryMin = 9999

  for (const doc of activeDocuments) {
    if (doc.status === "rejected") {
      hasRejected = true
      expiredDocTitle = doc.title
    }

    if (doc.status === "expired") {
      hasExpired = true
      expiredDocTitle = doc.title
    }

    if (doc.expiryDate) {
      const diffTime = new Date(doc.expiryDate).getTime() - now.getTime()
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (daysLeft < 0) {
        hasExpired = true
        expiredDocTitle = doc.title
      } else if (daysLeft <= 10) {
        hasExpiringSoon = true
        if (daysLeft < daysUntilExpiryMin) {
          daysUntilExpiryMin = daysLeft
          expiringSoonDocTitle = doc.title
        }
      }
    }
  }

  let newStatus: "active" | "warning" | "inactive" = "active"
  let newReason = "All company documents are verified and up to date."

  if (activeDocuments.length === 0) {
    newStatus = "warning"
    newReason = "No legal documents uploaded yet. Please upload required certificates."
  } else if (hasExpired || hasRejected) {
    newStatus = "inactive"
    newReason = hasExpired
      ? `Mandatory document (${expiredDocTitle}) has expired.`
      : `Mandatory document (${expiredDocTitle}) was rejected.`
  } else if (hasExpiringSoon) {
    newStatus = "warning"
    newReason = `${expiringSoonDocTitle} will expire in ${daysUntilExpiryMin} days.`
  }

  const previousStatus = customer.accountStatus
  if (previousStatus !== newStatus || customer.statusReason !== newReason) {
    customer.accountStatus = newStatus
    customer.statusReason = newReason
    await customer.save()

    await logDocumentActivity({
      documentId: activeDocuments[0]?._id || customer._id,
      customerId: customer._id,
      actorId: triggerActorId || null,
      actorType: triggerActorId ? "staff" : "system",
      action: "status_transition",
      previousState: { accountStatus: previousStatus },
      newState: { accountStatus: newStatus, reason: newReason },
      notes: `Automated Account Health recalculated: ${previousStatus} -> ${newStatus}`,
    })
  }

  return { status: newStatus, reason: newReason }
}
