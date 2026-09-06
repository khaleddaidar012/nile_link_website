import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { RoleConfig } from "@/lib/models/RoleConfig"
import { getSessionFromRequest } from "@/lib/auth/token-service"

const createRoleSchema = z.object({
  title: z.string().min(2, "Role title is required").trim(),
  permissions: z.object({
    canSendAlerts: z.boolean().default(false),
    canReviewDocuments: z.boolean().default(false),
    canManageCustomers: z.boolean().default(false),
  }),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "super_admin" && session.role !== "staff")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const roles = await RoleConfig.find().sort({ createdAt: 1 }).lean()

    return NextResponse.json({
      success: true,
      roles: roles.map((r) => ({
        id: r._id.toString(),
        title: r.title,
        permissions: r.permissions,
        isSystem: r.isSystem,
      })),
    })
  } catch (error) {
    console.error("GET /api/admin/roles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = createRoleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { title, permissions } = parsed.data

    await connectDB()

    const existingRole = await RoleConfig.findOne({ title: { $regex: new RegExp(`^${title}$`, "i") } })
    if (existingRole) {
      return NextResponse.json(
        { error: "A role with this title already exists." },
        { status: 409 }
      )
    }

    const newRole = await RoleConfig.create({
      title,
      permissions,
      isSystem: false,
    })

    return NextResponse.json({
      success: true,
      role: {
        id: newRole._id.toString(),
        title: newRole.title,
        permissions: newRole.permissions,
        isSystem: newRole.isSystem,
      },
    })
  } catch (error) {
    console.error("POST /api/admin/roles error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
