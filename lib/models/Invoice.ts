import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"
import crypto from "crypto"

export type InvoiceStatus = "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "cancelled"

export interface IInvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface IInvoice extends MongooseDoc {
  customerId: mongoose.Types.ObjectId
  invoiceNumber: string
  relatedQuoteId?: mongoose.Types.ObjectId
  relatedRequestId?: mongoose.Types.ObjectId
  
  // Amounts
  subtotal: number
  tax: number
  discount: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  currency: string
  
  items: IInvoiceItem[]
  
  status: InvoiceStatus
  issueDate: Date
  dueDate: Date
  
  notes?: string
  token: string // Secure public URL token
  
  createdAt: Date
  updatedAt: Date
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
}, { _id: false })

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
    relatedQuoteId: {
      type: Schema.Types.ObjectId,
      ref: "Quote",
      default: null,
    },
    relatedRequestId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerRequest",
      default: null,
    },
    
    // Financials
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true, default: 0 },
    remainingAmount: { type: Number, required: true },
    currency: { type: String, default: "EGP" },
    
    items: { type: [InvoiceItemSchema], default: [] },
    
    status: {
      type: String,
      enum: ["draft", "sent", "partially_paid", "paid", "overdue", "cancelled"],
      default: "draft",
      index: true,
    },
    issueDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    
    notes: { type: String, default: "" },
    token: { 
      type: String, 
      required: true, 
      unique: true,
      default: () => crypto.randomUUID(),
      index: true
    },
  },
  {
    timestamps: true,
  }
)

// Pre-save hook to calculate remaining amount
InvoiceSchema.pre("save", async function() {
  this.remainingAmount = this.totalAmount - this.paidAmount
  
  // Auto-update status based on payments (if not cancelled/draft)
  if (this.status !== "cancelled" && this.status !== "draft") {
    if (this.remainingAmount <= 0) {
      this.status = "paid"
    } else if (this.paidAmount > 0 && this.remainingAmount > 0) {
      this.status = "partially_paid"
    } else if (this.dueDate < new Date()) {
      this.status = "overdue"
    }
  }
})

InvoiceSchema.index({ customerId: 1, status: 1 })

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema)
export default Invoice
