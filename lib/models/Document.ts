import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type DocumentStatus =
  | "pending_review"
  | "approved"
  | "expiring_soon"
  | "expired"
  | "rejected"

export type DocumentCategory =
  | "commercial_register"
  | "tax_card"
  | "license"
  | "customs_certificate"
  | "contract"
  | "other"

export type WarningTier = "none" | "warning" | "urgent" | "critical" | "expired"

export interface IDocument extends MongooseDoc {
  customerId: mongoose.Types.ObjectId
  uploadedBy: mongoose.Types.ObjectId
  title: string
  category: DocumentCategory
  fileName: string
  storedFileName: string
  storageKey: string
  fileUrl: string
  fileSize: number
  mimeType: string
  fileHash?: string
  entityType?: string
  entityId?: mongoose.Types.ObjectId
  status: DocumentStatus
  startDate?: Date
  expiryDate?: Date
  rejectionReason?: string
  reviewNotes?: string
  reviewedBy?: mongoose.Types.ObjectId
  reviewedAt?: Date
  warningEscalationTier: WarningTier
  lastNotificationSentAt?: Date
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

const DocumentSchema = new Schema<IDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "commercial_register",
        "tax_card",
        "license",
        "customs_certificate",
        "contract",
        "other",
      ],
      default: "other",
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    storedFileName: {
      type: String,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileHash: {
      type: String,
      index: true,
    },
    entityType: {
      type: String,
      default: "Customer",
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending_review", "approved", "expiring_soon", "expired", "rejected"],
      default: "pending_review",
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    reviewNotes: {
      type: String,
      default: null,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    warningEscalationTier: {
      type: String,
      enum: ["none", "warning", "urgent", "critical", "expired"],
      default: "none",
      index: true,
    },
    lastNotificationSentAt: {
      type: Date,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

DocumentSchema.index({ customerId: 1, status: 1 })
DocumentSchema.index({ customerId: 1, category: 1, isArchived: 1 })

export const Document: Model<IDocument> =
  mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema)
export default Document
