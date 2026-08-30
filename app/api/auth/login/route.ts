import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User, Customer, Document as DocumentModel, Invoice, CustomerRequest } from "@/lib/models"
import { verifyPassword, hashPassword } from "@/lib/auth/password"
import { createAccessToken, createRefreshToken, setAuthCookies } from "@/lib/auth/token-service"
import { checkRateLimit, resetRateLimit } from "@/lib/auth/rate-limiter"

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required").trim(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(true),
})

async function autoSeedIfEmpty() {
  // 1. Check/create Manager Super-Admin
  const managerExists = await User.findOne({ email: "manager@nilelink.com" })
  if (!managerExists) {
    const managerPasswordHash = await hashPassword("Manager2026!")
    await User.create({
      email: "manager@nilelink.com",
      passwordHash: managerPasswordHash,
      role: "super_admin",
      firstName: "Admin",
      lastName: "Manager",
      phone: "+201000000000",
      status: "active",
      emailVerified: true,
      whatsappVerified: true,
      staffPermissions: {
        canSendAlerts: true,
        canReviewDocuments: true,
        canManageCustomers: true,
      },
    })
  }

  // 2. Check/create Staff
  const staffExists = await User.findOne({ email: "staff@nilelink.com" })
  let staffUser = staffExists
  if (!staffExists) {
    const staffPasswordHash = await hashPassword("StaffAdmin2026!")
    staffUser = await User.create({
      email: "staff@nilelink.com",
      passwordHash: staffPasswordHash,
      role: "staff",
      firstName: "Karim",
      lastName: "Nasser",
      phone: "+201000000001",
      status: "active",
      emailVerified: true,
      whatsappVerified: true,
      staffPermissions: {
        canSendAlerts: true,
        canReviewDocuments: true,
        canManageCustomers: false,
      },
    })
  }

  // 3. Customer & Document Seed if customer is missing
  const custExists = await Customer.findOne({ contactEmail: "mohamed@alexexport.com" })
  if (!custExists) {
    const clientPasswordHash = await hashPassword("SecurePass123!")
    const cust1 = await Customer.create({
      companyName: "Alexandria Exporting Co.",
      commercialRegisterNumber: "CR-98421-EG",
      taxCardNumber: "TAX-55219-ALX",
      contactEmail: "mohamed@alexexport.com",
      contactPhone: "+201001234567",
      accountStatus: "active",
      statusReason: "All company documents are verified and up to date.",
      city: "Alexandria",
      country: "Egypt",
      maxAllowedDocuments: 20,
    })

    const user1 = await User.create({
      email: "mohamed@alexexport.com",
      passwordHash: clientPasswordHash,
      role: "customer_admin",
      customerId: cust1._id,
      firstName: "Mohamed",
      lastName: "Ahmed",
      phone: "+201001234567",
      status: "active",
      emailVerified: true,
      whatsappVerified: true,
    })

    const now = new Date()
    const in1Year = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

    await DocumentModel.create({
      customerId: cust1._id,
      uploadedBy: user1._id,
      title: "Commercial Register 2026",
      category: "commercial_register",
      fileName: "Commercial_Register_Alex.pdf",
      storedFileName: "cr_alex_2026.pdf",
      fileUrl: "/uploads/documents/sample_cr.pdf",
      fileSize: 1024 * 1024 * 2,
      mimeType: "application/pdf",
      status: "approved",
      startDate: now,
      expiryDate: in1Year,
      reviewedBy: staffUser?._id,
      reviewedAt: now,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
    const rateLimit = checkRateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, maxAttempts: 15 })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
          code: "RATE_LIMITED",
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid login credentials", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { identifier, password, rememberMe } = parsed.data

    await connectDB()

    // Auto-seed default testing credentials if DB is currently empty
    await autoSeedIfEmpty()

    const normalizedIdentifier = identifier.toLowerCase()
    const user = await User.findOne({
      $or: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
    }).select("+passwordHash")

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email/username or password" },
        { status: 401 }
      )
    }

    if (user.status === "suspended") {
      return NextResponse.json(
        { error: "Your account has been suspended. Please contact support." },
        { status: 403 }
      )
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email/username or password" },
        { status: 401 }
      )
    }

    // Reset rate limiter on successful password verification
    resetRateLimit(`login:${ip}`)

    let customerData = null
    if (user.customerId) {
      customerData = await Customer.findById(user.customerId)
    }

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    const accessToken = await createAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId ? user.customerId.toString() : null,
      accountStatus: customerData?.accountStatus,
      firstName: user.firstName,
      lastName: user.lastName,
      staffPermissions: user.staffPermissions,
    })

    const refreshToken = await createRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId ? user.customerId.toString() : null,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        staffPermissions: user.staffPermissions,
        customerId: user.customerId ? user.customerId.toString() : null,
        companyName: customerData?.companyName,
        accountStatus: customerData?.accountStatus,
        statusReason: customerData?.statusReason,
      },
    })

    setAuthCookies(response, accessToken, refreshToken, rememberMe)
    return response
  } catch (error: unknown) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    )
  }
}
