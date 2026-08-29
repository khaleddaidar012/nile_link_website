import mongoose, { Schema, Document as MongooseDoc, Model } from "mongoose"

export interface IDocumentCategoryConfig {
  key: string
  nameEn: string
  nameAr: string
  description?: string
  defaultValidityDays: number
  isMandatory: boolean
  isActive: boolean
  createdAt?: Date
}

export interface ISystemSetting extends MongooseDoc {
  settingKey: string
  documentCategories: IDocumentCategoryConfig[]
  defaultMaxDocumentsPerClient: number
  expiryWarningDaysTiers: number[]
  updatedAt: Date
  createdAt: Date
}

const DocumentCategorySchema = new Schema<IDocumentCategoryConfig>(
  {
    key: { type: String, required: true },
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    description: { type: String, default: "" },
    defaultValidityDays: { type: Number, default: 365 },
    isMandatory: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const SystemSettingSchema = new Schema<ISystemSetting>(
  {
    settingKey: {
      type: String,
      required: true,
      unique: true,
      default: "global_system_settings",
      index: true,
    },
    documentCategories: {
      type: [DocumentCategorySchema],
      default: [
        {
          key: "commercial_register",
          nameEn: "Commercial Registration (CR)",
          nameAr: "السجل التجاري",
          description: "Official company registration with Ministry of Supply and Internal Trade",
          defaultValidityDays: 365,
          isMandatory: true,
          isActive: true,
        },
        {
          key: "tax_card",
          nameEn: "Tax Registration Card",
          nameAr: "البطاقة الضريبية",
          description: "Corporate Tax Authority identity certificate and VAT registration",
          defaultValidityDays: 1825, // 5 years
          isMandatory: true,
          isActive: true,
        },
        {
          key: "license",
          nameEn: "Import / Export Card & Customs License",
          nameAr: "بطاقة استيرادية / تصديرية",
          description: "General Organization for Export and Import Control (GOEIC) license",
          defaultValidityDays: 730,
          isMandatory: true,
          isActive: true,
        },
        {
          key: "customs_certificate",
          nameEn: "Customs Clearance & ACID Bond",
          nameAr: "شهادة جمركية وترخيص الإفراج",
          description: "MTS Nafeza ACID pre-clearance agreement and agent authorization",
          defaultValidityDays: 365,
          isMandatory: false,
          isActive: true,
        },
        {
          key: "contract",
          nameEn: "Freight & Logistics Service Agreement",
          nameAr: "عقد خدمات الشحن واللوجستيات",
          description: "Master service agreement signed with NileLink Global Logistics",
          defaultValidityDays: 365,
          isMandatory: false,
          isActive: true,
        },
        {
          key: "other",
          nameEn: "General Business Document / Certificate",
          nameAr: "وثيقة / شهادة عامة",
          description: "Power of attorney, Chamber of Commerce membership, Free Zone permits",
          defaultValidityDays: 365,
          isMandatory: false,
          isActive: true,
        },
      ],
    },
    defaultMaxDocumentsPerClient: {
      type: Number,
      default: 20,
    },
    expiryWarningDaysTiers: {
      type: [Number],
      default: [30, 20, 10, 5],
    },
  },
  {
    timestamps: true,
  }
)

export const SystemSetting: Model<ISystemSetting> =
  mongoose.models.SystemSetting ||
  mongoose.model<ISystemSetting>("SystemSetting", SystemSettingSchema)
export default SystemSetting
