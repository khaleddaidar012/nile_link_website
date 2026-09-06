import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export type PricingType = "fixed" | "route_based" | "manual"

export interface IPricingRule extends MongooseDoc {
  serviceKey: string // matches serviceKey in ServiceConfig
  pricingType: PricingType
  defaultPrice: number
  currency: string
  routeInfo?: {
    origin?: string
    destination?: string
  }
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PricingRuleSchema = new Schema<IPricingRule>(
  {
    serviceKey: {
      type: String,
      required: true,
      index: true,
    },
    pricingType: {
      type: String,
      enum: ["fixed", "route_based", "manual"],
      default: "manual",
    },
    defaultPrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "EGP",
    },
    routeInfo: {
      origin: { type: String, default: null },
      destination: { type: String, default: null },
    },
    notes: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

PricingRuleSchema.index({ serviceKey: 1, pricingType: 1 })

if (mongoose.models.PricingRule) {
  delete mongoose.models.PricingRule
}

export const PricingRule: Model<IPricingRule> = mongoose.model<IPricingRule>("PricingRule", PricingRuleSchema)
export default PricingRule
