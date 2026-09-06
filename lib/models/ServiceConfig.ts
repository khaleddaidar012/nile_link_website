import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export interface IServiceStatus {
  key: string
  labelEn: string
  labelAr: string
  isEndState: boolean
  isCustomerVisible: boolean
}

export interface IDocumentRequirement {
  documentType: string
  labelEn: string
  labelAr: string
  isRequired: boolean
  condition?: "import" | "export" | "transit" | "fcl" | "lcl" | "egypt_import"
}

export interface IServiceConfig extends MongooseDoc {
  serviceKey: string // e.g. "sea_freight", "air_freight"
  nameEn: string
  nameAr: string
  descriptionEn: string
  descriptionAr: string
  icon: string
  isActive: boolean
  statuses: IServiceStatus[]
  documentRequirements: IDocumentRequirement[]
}

const ServiceStatusSchema = new Schema<IServiceStatus>(
  {
    key: { type: String, required: true },
    labelEn: { type: String, required: true },
    labelAr: { type: String, required: true },
    isEndState: { type: Boolean, default: false },
    isCustomerVisible: { type: Boolean, default: true },
  },
  { _id: false }
)

const DocumentRequirementSchema = new Schema<IDocumentRequirement>(
  {
    documentType: { type: String, required: true },
    labelEn: { type: String, required: true },
    labelAr: { type: String, required: true },
    isRequired: { type: Boolean, default: false },
    condition: { type: String, default: null },
  },
  { _id: false }
)

const ServiceConfigSchema = new Schema<IServiceConfig>(
  {
    serviceKey: { type: String, required: true, unique: true, index: true },
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    icon: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    statuses: { type: [ServiceStatusSchema], default: [] },
    documentRequirements: { type: [DocumentRequirementSchema], default: [] },
  },
  { timestamps: true }
)

export const ServiceConfig: Model<IServiceConfig> =
  mongoose.models.ServiceConfig ||
  mongoose.model<IServiceConfig>("ServiceConfig", ServiceConfigSchema)
export default ServiceConfig
