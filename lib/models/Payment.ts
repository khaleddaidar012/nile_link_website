import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type PaymentMethod = "bank_transfer" | "credit_card" | "cash" | "cheque" | "other"

export interface IPayment extends MongooseDoc {
  invoiceId: mongoose.Types.ObjectId
  customerId: mongoose.Types.ObjectId
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  paymentDate: Date
  referenceNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "credit_card", "cash", "cheque", "other"],
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    referenceNumber: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

PaymentSchema.index({ invoiceId: 1, paymentDate: -1 })

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema)
export default Payment
