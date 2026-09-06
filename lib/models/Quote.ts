import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired"

export interface IQuote extends MongooseDoc {
  requestId: mongoose.Types.ObjectId
  customerId: mongoose.Types.ObjectId
  quoteNumber: string
  status: QuoteStatus
  totalAmount: number
  currency: string
  validUntil: Date
  notes?: string
  createdBy: mongoose.Types.ObjectId // Employee
  createdAt: Date
  updatedAt: Date
}

const QuoteSchema = new Schema<IQuote>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerRequest",
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    quoteNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "rejected", "expired"],
      default: "draft",
      index: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    validUntil: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

QuoteSchema.index({ customerId: 1, status: 1 })

if (mongoose.models.Quote) {
  delete mongoose.models.Quote
}

export const Quote: Model<IQuote> = mongoose.model<IQuote>("Quote", QuoteSchema)
export default Quote
