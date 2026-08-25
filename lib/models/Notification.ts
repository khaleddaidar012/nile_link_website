import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type NotificationChannel = "in_app" | "email" | "whatsapp" | "multi"
export type NotificationSeverity = "normal" | "warning" | "urgent" | "critical"
export type NotificationType =
  | "document_uploaded"
  | "document_approved"
  | "document_rejected"
  | "document_expiring_10d"
  | "document_expiring_7d"
  | "document_expiring_3d"
  | "document_expiring_1d"
  | "document_expired"
  | "manual_staff_warning"
  | "account_status_change"
  | "request_update"

export interface INotification extends MongooseDoc {
  recipientUserId?: mongoose.Types.ObjectId
  recipientCustomerId?: mongoose.Types.ObjectId
  targetAudience: "customer" | "staff" | "all_staff" | "super_admin"
  title: string
  message: string
  channel: NotificationChannel
  type: NotificationType
  severity: NotificationSeverity
  relatedDocumentId?: mongoose.Types.ObjectId
  relatedRequestId?: mongoose.Types.ObjectId
  actionUrl?: string
  isRead: boolean
  readAt?: Date
  emailStatus: "not_applicable" | "pending" | "sent" | "failed"
  emailDeliveredAt?: Date
  whatsappStatus: "not_applicable" | "pending" | "sent" | "delivered" | "failed"
  whatsappMessageId?: string
  whatsappDeliveredAt?: Date
  dispatchedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    recipientCustomerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },
    targetAudience: {
      type: String,
      enum: ["customer", "staff", "all_staff", "super_admin"],
      default: "customer",
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: ["in_app", "email", "whatsapp", "multi"],
      default: "in_app",
    },
    type: {
      type: String,
      enum: [
        "document_uploaded",
        "document_approved",
        "document_rejected",
        "document_expiring_10d",
        "document_expiring_7d",
        "document_expiring_3d",
        "document_expiring_1d",
        "document_expired",
        "manual_staff_warning",
        "account_status_change",
        "request_update",
      ],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ["normal", "warning", "urgent", "critical"],
      default: "normal",
      index: true,
    },
    relatedDocumentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      default: null,
      index: true,
    },
    relatedRequestId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerRequest",
      default: null,
    },
    actionUrl: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    emailStatus: {
      type: String,
      enum: ["not_applicable", "pending", "sent", "failed"],
      default: "not_applicable",
    },
    emailDeliveredAt: {
      type: Date,
      default: null,
    },
    whatsappStatus: {
      type: String,
      enum: ["not_applicable", "pending", "sent", "delivered", "failed"],
      default: "not_applicable",
    },
    whatsappMessageId: {
      type: String,
      default: null,
    },
    whatsappDeliveredAt: {
      type: Date,
      default: null,
    },
    dispatchedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

NotificationSchema.index({ recipientUserId: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ targetAudience: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ relatedDocumentId: 1, type: 1, createdAt: -1 })

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema)
export default Notification
