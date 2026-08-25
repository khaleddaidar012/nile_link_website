import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type ActivityAction =
  | "upload"
  | "view"
  | "download"
  | "approve"
  | "reject"
  | "update_dates"
  | "send_email_warning"
  | "send_whatsapp_warning"
  | "status_transition"
  | "delete"

export interface IDocumentActivityLog extends MongooseDoc {
  documentId: mongoose.Types.ObjectId
  customerId: mongoose.Types.ObjectId
  actorId?: mongoose.Types.ObjectId
  actorType: "customer" | "staff" | "system"
  actorName?: string
  action: ActivityAction
  previousState?: Record<string, unknown>
  newState?: Record<string, unknown>
  notes?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

const DocumentActivityLogSchema = new Schema<IDocumentActivityLog>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    actorType: {
      type: String,
      enum: ["customer", "staff", "system"],
      required: true,
    },
    actorName: {
      type: String,
      default: "System",
    },
    action: {
      type: String,
      enum: [
        "upload",
        "view",
        "download",
        "approve",
        "reject",
        "update_dates",
        "send_email_warning",
        "send_whatsapp_warning",
        "status_transition",
        "delete",
      ],
      required: true,
      index: true,
    },
    previousState: {
      type: Schema.Types.Mixed,
      default: null,
    },
    newState: {
      type: Schema.Types.Mixed,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

DocumentActivityLogSchema.index({ documentId: 1, createdAt: -1 })
DocumentActivityLogSchema.index({ customerId: 1, createdAt: -1 })

export const DocumentActivityLog: Model<IDocumentActivityLog> =
  mongoose.models.DocumentActivityLog ||
  mongoose.model<IDocumentActivityLog>("DocumentActivityLog", DocumentActivityLogSchema)
export default DocumentActivityLog
