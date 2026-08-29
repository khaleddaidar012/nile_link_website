import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { SystemSetting } from "@/lib/models/SystemSetting"
import { getSessionFromRequest } from "@/lib/auth/token-service"

const updateCategorySchema = z.object({
  nameEn: z.string().min(2).optional(),
  nameAr: z.string().min(2).optional(),
  description: z.string().optional(),
  defaultValidityDays: z.number().min(1).optional(),
  isMandatory: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

interface RouteParams {
  params: Promise<{ key: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Access denied. Only managers can update document categories." },
        { status: 403 }
      )
    }

    const { key } = await params
    const body = await req.json()
    const parsed = updateCategorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    await connectDB()

    const settings = await SystemSetting.findOne({ settingKey: "global_system_settings" })
    if (!settings) {
      return NextResponse.json({ error: "System settings not found" }, { status: 404 })
    }

    const categoryIndex = settings.documentCategories.findIndex((c) => c.key === key)
    if (categoryIndex === -1) {
      return NextResponse.json({ error: `Category '${key}' not found` }, { status: 404 })
    }

    const target = settings.documentCategories[categoryIndex]
    if (parsed.data.nameEn !== undefined) target.nameEn = parsed.data.nameEn
    if (parsed.data.nameAr !== undefined) target.nameAr = parsed.data.nameAr
    if (parsed.data.description !== undefined) target.description = parsed.data.description
    if (parsed.data.defaultValidityDays !== undefined)
      target.defaultValidityDays = parsed.data.defaultValidityDays
    if (parsed.data.isMandatory !== undefined) target.isMandatory = parsed.data.isMandatory
    if (parsed.data.isActive !== undefined) target.isActive = parsed.data.isActive

    settings.markModified("documentCategories")
    await settings.save()

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category: target,
    })
  } catch (error: unknown) {
    console.error("PATCH /api/admin/settings/categories/[key] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
