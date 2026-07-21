import mongoose, { Schema, Document } from "mongoose"

export interface IAnalyticsEvent extends Document {
  type: "page_view" | "contact_submit" | "service_view"
  page: string
  country?: string
  device: "mobile" | "desktop" | "tablet"
  userAgent?: string
  ipHash: string
  createdAt: Date
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  type: { type: String, required: true, index: true },
  page: { type: String, required: true, index: true },
  country: { type: String },
  device: { type: String, required: true, enum: ["mobile", "desktop", "tablet"] },
  userAgent: { type: String },
  ipHash: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
})

AnalyticsEventSchema.index({ createdAt: -1 })
AnalyticsEventSchema.index({ type: 1, createdAt: -1 })

export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema)
