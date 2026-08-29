import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User, IStaffPermissions } from "@/lib/models/User"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import { hashPassword } from "@/lib/auth/password"

const createStaffSchema = z.object({
  firstName: z.string().min(2, "First name is required").trim(),
  lastName: z.string().min(2, "Last name is required").trim(),
  email: z.string().email("Valid email required").toLowerCase().trim(),
  phone: z.string().min(6, "Valid phone required").trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  staffPermissions: z.object({
    canSendAlerts: z.boolean().default(true),
    canReviewDocuments: z.boolean().default(true),
    canManageCustomers: z.boolean().default(false),
  }),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const staffList = await User.find({
      role: { $in: ["staff", "super_admin"] },
    })
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean()

    const formattedStaff = staffList.map((s) => ({
      id: s._id.toString(),
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      phone: s.phone || "",
      role: s.role,
      status: s.status,
      staffPermissions: s.staffPermissions || {
        canSendAlerts: true,
        canReviewDocuments: true,
        canManageCustomers: false,
      },
      lastLoginAt: s.lastLoginAt,
      createdAt: s.createdAt,
    }))

    return NextResponse.json({
      success: true,
      staff: formattedStaff,
      totalCount: formattedStaff.length,
    })
  } catch (error: unknown) {
    console.error("GET /api/admin/staff error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Access denied. Only managers can create employee accounts." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const parsed = createStaffSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, password, staffPermissions } = parsed.data

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email address already exists." },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const newStaff = await User.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      role: "staff",
      status: "active",
      emailVerified: true,
      whatsappVerified: true,
      staffPermissions,
    })

    return NextResponse.json({
      success: true,
      message: `Staff member ${firstName} ${lastName} created successfully.`,
      staff: {
        id: newStaff._id.toString(),
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        status: newStaff.status,
        staffPermissions: newStaff.staffPermissions,
        createdAt: newStaff.createdAt,
      },
    })
  } catch (error: unknown) {
    console.error("POST /api/admin/staff error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
