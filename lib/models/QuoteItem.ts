import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export interface IQuoteItemAudit {
  updatedBy: mongoose.Types.ObjectId
  previousPrice: number
  newPrice: number
  reason: string
  date: Date
}

export interface IQuoteItemBreakdown {
  description: string
  basePrice: number
  additionalCharges: number
}

export interface IQuoteItem extends MongooseDoc {
  quoteId: mongoose.Types.ObjectId
  requestServiceId?: mongoose.Types.ObjectId
  serviceKey: string
  basePrice: number
  additionalCharges: number
  discount: number
  finalPrice: number
  currency: string
  breakdown: IQuoteItemBreakdown[]
  note?: string
  auditTrail: IQuoteItemAudit[]
  createdAt: Date
  updatedAt: Date
}

const QuoteItemAuditSchema = new Schema<IQuoteItemAudit>(
  {
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    previousPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
)

const QuoteItemBreakdownSchema = new Schema<IQuoteItemBreakdown>(
  {
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    additionalCharges: { type: Number, default: 0 },
  },
  { _id: false }
)

const QuoteItemSchema = new Schema<IQuoteItem>(
  {
    quoteId: {
      type: Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
      index: true,
    },
    requestServiceId: {
      type: Schema.Types.ObjectId,
      ref: "RequestService",
      required: false,
      index: true,
    },
    serviceKey: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    additionalCharges: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    breakdown: {
      type: [QuoteItemBreakdownSchema],
      default: [],
    },
    note: {
      type: String,
      default: "",
    },
    auditTrail: {
      type: [QuoteItemAuditSchema],
      default: [],
    },
  },
  { timestamps: true }
)

QuoteItemSchema.index({ quoteId: 1, requestServiceId: 1 })

if (mongoose.models.QuoteItem) {
  delete mongoose.models.QuoteItem
}

export const QuoteItem: Model<IQuoteItem> = mongoose.model<IQuoteItem>("QuoteItem", QuoteItemSchema)
export default QuoteItem
