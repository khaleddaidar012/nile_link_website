import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { SystemSetting } from "@/lib/models/SystemSetting"
import { getSessionFromRequest } from "@/lib/auth/token-service"

const createCategorySchema = z.object({
  key: z.string().min(2, "Category key is required").trim().toLowerCase().regex(/^[a-z0-9_]+$/, "Key must contain only lowercase letters, numbers, and underscores"),
  nameEn: z.string().min(2, "English name is required").trim(),
  nameAr: z.string().min(2, "Arabic name is required").trim(),
  description: z.string().optional().default(""),
  defaultValidityDays: z.number().min(1).default(365),
  isMandatory: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    let settings = await SystemSetting.findOne({ settingKey: "global_system_settings" })
    if (!settings) {
      settings = await SystemSetting.create({ settingKey: "global_system_settings" })
    }

    return NextResponse.json({
      success: true,
      categories: settings.documentCategories,
    })
  } catch (error: unknown) {
    console.error("GET /api/admin/settings/categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Access denied. Only managers can add system document categories." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const parsed = createCategorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    await connectDB()

    let settings = await SystemSetting.findOne({ settingKey: "global_system_settings" })
    if (!settings) {
      settings = await SystemSetting.create({ settingKey: "global_system_settings" })
    }

    const existing = settings.documentCategories.find((c) => c.key === parsed.data.key)
    if (existing) {
      return NextResponse.json(
        { error: `Category key '${parsed.data.key}' already exists.` },
        { status: 409 }
      )
    }

    settings.documentCategories.push({
      ...parsed.data,
      isActive: true,
    })

    await settings.save()

    return NextResponse.json({
      success: true,
      message: `Document category '${parsed.data.nameEn}' added successfully.`,
      categories: settings.documentCategories,
    })
  } catch (error: unknown) {
    console.error("POST /api/admin/settings/categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
