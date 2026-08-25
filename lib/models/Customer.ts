import mongoose, { Schema, Document, Model } from "mongoose"

export type AccountStatus = "active" | "warning" | "inactive"

export interface ICustomer extends Document {
  companyName: string
  commercialRegisterNumber: string
  taxCardNumber: string
  industry?: string
  country: string
  city?: string
  address?: string
  contactPhone: string
  contactEmail: string
  accountStatus: AccountStatus
  statusReason?: string
  assignedStaffId?: mongoose.Types.ObjectId
  maxAllowedDocuments: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    commercialRegisterNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    taxCardNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    industry: {
      type: String,
      default: "Logistics & Trade",
    },
    country: {
      type: String,
      default: "Egypt",
    },
    city: {
      type: String,
      default: "Cairo",
    },
    address: {
      type: String,
      default: "",
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "warning", "inactive"],
      default: "warning",
      index: true,
    },
    statusReason: {
      type: String,
      default: "Pending mandatory document verification",
    },
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    maxAllowedDocuments: {
      type: Number,
      default: 20,
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

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema)
export default Customer
