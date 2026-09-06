import mongoose, { Schema, Document, Model } from "mongoose"

export interface IRoleConfig extends Document {
  title: string
  permissions: {
    canSendAlerts: boolean
    canReviewDocuments: boolean
    canManageCustomers: boolean
  }
  isSystem: boolean // To prevent deletion of core roles if needed
  createdAt: Date
  updatedAt: Date
}

const RoleConfigSchema = new Schema<IRoleConfig>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: {
      canSendAlerts: { type: Boolean, default: false },
      canReviewDocuments: { type: Boolean, default: false },
      canManageCustomers: { type: Boolean, default: false },
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const RoleConfig: Model<IRoleConfig> =
  mongoose.models.RoleConfig || mongoose.model<IRoleConfig>("RoleConfig", RoleConfigSchema)
