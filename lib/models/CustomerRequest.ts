import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type RequestServiceType =
  | "sea_freight"
  | "air_freight"
  | "land_freight"
  | "customs_clearance"
  | "warehousing"
  | "inland_transportation"
  | "general_inquiry"

export type OperationType = "import" | "export" | "transit" | "none"

export type RequestPriority = "low" | "medium" | "high" | "urgent"

export type RequestStatus = 
  | "submitted"
  | "document_required"
  | "document_under_review"
  | "quote_pending"
  | "quote_provided"
  | "quote_accepted"
  | "processing"
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
  // Legacy fields (optional for backward compatibility)
  serviceType?: RequestServiceType
  operationType?: OperationType
  details?: any // Dynamic payload based on serviceType
  // New field for multi-service requests
  services: mongoose.Types.ObjectId[] // Array of RequestService IDs
  subject: string
  description: string
  priority: RequestPriority
  status: RequestStatus
  assignedStaffId?: mongoose.Types.ObjectId
  complianceType?: "ACID" | "UCR" | null
  complianceNumber?: string
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
        "sea_freight",
        "air_freight",
        "land_freight",
        "customs_clearance",
        "warehousing",
        "inland_transportation",
        "general_inquiry",
      ],
      default: null, // Legacy optional
      index: true,
    },
    operationType: {
      type: String,
      enum: ["import", "export", "transit", "none"],
      default: "none",
    },
    services: {
      type: [{ type: Schema.Types.ObjectId, ref: "RequestService" }],
      default: [],
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
        "document_required",
        "document_under_review",
        "quote_pending",
        "quote_provided",
        "quote_accepted",
        "processing",
        "completed",
        "cancelled"
      ],
      default: "submitted",
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    complianceType: {
      type: String,
      enum: ["ACID", "UCR", null],
      default: null,
    },
    complianceNumber: {
      type: String,
      default: "",
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

if (mongoose.models.CustomerRequest) {
  delete mongoose.models.CustomerRequest;
}
export const CustomerRequest: Model<ICustomerRequest> = mongoose.model<ICustomerRequest>("CustomerRequest", CustomerRequestSchema)
export default CustomerRequest
