import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled"

export interface IInvoice extends MongooseDoc {
  customerId: mongoose.Types.ObjectId
  invoiceNumber: string
  relatedRequestId?: mongoose.Types.ObjectId
  amount: number
  currency: string
  status: InvoiceStatus
  issueDate: Date
  dueDate: Date
  paidAt?: Date
  paymentMethod?: string
  paymentReference?: string
  pdfUrl?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    relatedRequestId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerRequest",
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "cancelled"],
      default: "pending",
      index: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    paymentReference: {
      type: String,
      default: null,
    },
    pdfUrl: {
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

InvoiceSchema.index({ customerId: 1, status: 1 })

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema)
export default Invoice
