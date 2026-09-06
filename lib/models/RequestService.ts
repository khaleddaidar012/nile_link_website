import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export interface IServiceTimeline {
  status: string
  title: string
  comment?: string
  updatedBy?: mongoose.Types.ObjectId
  createdAt: Date
}

export interface IRequestService extends MongooseDoc {
  requestId: mongoose.Types.ObjectId
  serviceKey: string
  status: string
  details: any // dynamic payload
  timeline: IServiceTimeline[]
  createdAt: Date
  updatedAt: Date
}

const ServiceTimelineSchema = new Schema<IServiceTimeline>(
  {
    status: { type: String, required: true },
    title: { type: String, required: true },
    comment: { type: String, default: "" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const RequestServiceSchema = new Schema<IRequestService>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerRequest",
      required: true,
      index: true,
    },
    serviceKey: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      default: "pending",
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timeline: {
      type: [ServiceTimelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

RequestServiceSchema.index({ requestId: 1, serviceKey: 1 })

if (mongoose.models.RequestService) {
  delete mongoose.models.RequestService
}

export const RequestService: Model<IRequestService> = mongoose.model<IRequestService>("RequestService", RequestServiceSchema)
export default RequestService
