import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type RequestServiceType =
  | "freight_booking"
  | "customs_clearance"
  | "warehousing"
  | "transportation"
  | "general_inquiry"

export type RequestPriority = "low" | "medium" | "high" | "urgent"

export type RequestStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "waiting_customer"
  | "completed"
  | "cancelled"

export interface IRequestTimeline {
  status: string
  title: string
  comment?: string
  updatedBy?: mongoose.Types.ObjectId
  createdAt: Date
}

export interface IRequestAttachment {
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: Date
}

export interface ICustomerRequest extends MongooseDoc {
  customerId: mongoose.Types.ObjectId
  requestedBy: mongoose.Types.ObjectId
  trackingNumber: string
  serviceType: RequestServiceType
  subject: string
  description: string
  priority: RequestPriority
  status: RequestStatus
  assignedStaffId?: mongoose.Types.ObjectId
  timeline: IRequestTimeline[]
  attachments: IRequestAttachment[]
  createdAt: Date
  updatedAt: Date
}

const RequestTimelineSchema = new Schema<IRequestTimeline>(
  {
    status: { type: String, required: true },
    title: { type: String, required: true },
    comment: { type: String, default: "" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const RequestAttachmentSchema = new Schema<IRequestAttachment>(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const CustomerRequestSchema = new Schema<ICustomerRequest>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    serviceType: {
      type: String,
      enum: [
        "freight_booking",
        "customs_clearance",
        "warehousing",
        "transportation",
        "general_inquiry",
      ],
      default: "general_inquiry",
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "in_progress",
        "waiting_customer",
        "completed",
        "cancelled",
      ],
      default: "submitted",
      index: true,
    },
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    timeline: {
      type: [RequestTimelineSchema],
      default: [],
    },
    attachments: {
      type: [RequestAttachmentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

CustomerRequestSchema.index({ customerId: 1, status: 1 })

export const CustomerRequest: Model<ICustomerRequest> =
  mongoose.models.CustomerRequest ||
  mongoose.model<ICustomerRequest>("CustomerRequest", CustomerRequestSchema)
export default CustomerRequest
