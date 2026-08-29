import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { SystemSetting } from "@/lib/models/SystemSetting"

export async function GET() {
  try {
    await connectDB()

    let settings = await SystemSetting.findOne({ settingKey: "global_system_settings" })
    if (!settings) {
      settings = await SystemSetting.create({ settingKey: "global_system_settings" })
    }

    const activeCategories = (settings.documentCategories || [])
      .filter((cat) => cat.isActive)
      .map((cat) => ({
        key: cat.key,
        nameEn: cat.nameEn,
        nameAr: cat.nameAr,
        description: cat.description || "",
        defaultValidityDays: cat.defaultValidityDays || 365,
        isMandatory: cat.isMandatory || false,
      }))

    return NextResponse.json({
      success: true,
      categories: activeCategories,
    })
  } catch (error: unknown) {
    console.error("GET /api/settings/document-categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
