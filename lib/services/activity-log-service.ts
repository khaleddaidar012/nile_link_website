import mongoose from "mongoose"
import { DocumentActivityLog, ActivityAction } from "@/lib/models/DocumentActivityLog"

interface LogActivityParams {
  documentId: string | mongoose.Types.ObjectId
  customerId: string | mongoose.Types.ObjectId
  actorId?: string | mongoose.Types.ObjectId | null
  actorType: "customer" | "staff" | "system"
  actorName?: string
  action: ActivityAction
  previousState?: Record<string, unknown>
  newState?: Record<string, unknown>
  notes?: string
  ipAddress?: string
  userAgent?: string
}

export async function logDocumentActivity(params: LogActivityParams): Promise<void> {
  try {
    await DocumentActivityLog.create({
      documentId: params.documentId,
      customerId: params.customerId,
      actorId: params.actorId || undefined,
      actorType: params.actorType,
      actorName: params.actorName || (params.actorType === "system" ? "NileLink Engine" : "User"),
      action: params.action,
      previousState: params.previousState || undefined,
      newState: params.newState || undefined,
      notes: params.notes || "",
      ipAddress: params.ipAddress || undefined,
      userAgent: params.userAgent || undefined,
    })
  } catch (err) {
    console.error("Failed to write DocumentActivityLog:", err)
  }
}
