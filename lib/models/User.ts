import mongoose, { Schema, Document, Model } from "mongoose"

export type UserRole = "customer" | "customer_admin" | "staff" | "super_admin"
export type UserStatus = "active" | "inactive" | "suspended" | "pending_verification"

export interface IStaffPermissions {
  canSendAlerts: boolean
  canReviewDocuments: boolean
  canManageCustomers: boolean
}

export interface IUser extends Document {
  email: string
  username?: string
  passwordHash: string
  role: UserRole
  customerId?: mongoose.Types.ObjectId
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  status: UserStatus
  staffPermissions?: IStaffPermissions
  emailVerified: boolean
  emailVerificationToken?: string
  emailVerificationExpires?: Date
  emailVerificationOtp?: string
  emailVerificationOtpExpires?: Date
  whatsappVerified: boolean
  whatsappVerificationCode?: string
  whatsappVerificationExpires?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  passwordResetOtp?: string
  passwordResetOtpExpires?: Date
  passwordResetChannel?: "email" | "whatsapp"
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "customer_admin", "staff", "super_admin"],
      default: "customer",
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending_verification"],
      default: "active",
      index: true,
    },
    staffPermissions: {
      canSendAlerts: { type: Boolean, default: true },
      canReviewDocuments: { type: Boolean, default: true },
      canManageCustomers: { type: Boolean, default: false },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    emailVerificationOtp: {
      type: String,
      default: null,
    },
    emailVerificationOtpExpires: {
      type: Date,
      default: null,
    },
    whatsappVerified: {
      type: Boolean,
      default: false,
    },
    whatsappVerificationCode: {
      type: String,
      default: null,
    },
    whatsappVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    passwordResetOtp: {
      type: String,
      default: null,
    },
    passwordResetOtpExpires: {
      type: Date,
      default: null,
    },
    passwordResetChannel: {
      type: String,
      enum: ["email", "whatsapp", null],
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
export default User
