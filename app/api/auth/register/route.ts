import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User, Customer } from "@/lib/models"
import { hashPassword, generateSecureToken, validatePasswordComplexity } from "@/lib/auth/password"
import { createAccessToken, createRefreshToken, setAuthCookies } from "@/lib/auth/token-service"

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(8, "Phone number is required").trim(),
  companyName: z.string().min(2, "Company name is required").trim(),
  commercialRegisterNumber: z.string().min(3, "Commercial Registration number is required").trim(),
  taxCardNumber: z.string().min(3, "Tax Card number is required").trim(),
  industry: z.string().optional().default("Logistics & Trade"),
  country: z.string().optional().default("Egypt"),
  city: z.string().optional().default("Cairo"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      companyName,
      commercialRegisterNumber,
      taxCardNumber,
      industry,
      country,
      city,
    } = parsed.data

    const passwordCheck = validatePasswordComplexity(password)
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.error }, { status: 400 })
    }

    await connectDB()

    // Check if user email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      )
    }

    // Check if company already registered by CR number
    const existingCustomer = await Customer.findOne({ commercialRegisterNumber })
    if (existingCustomer) {
      return NextResponse.json(
        { error: "A company with this Commercial Registration Number is already registered" },
        { status: 409 }
      )
    }

    // 1. Create Customer record
    const customer = await Customer.create({
      companyName,
      commercialRegisterNumber,
      taxCardNumber,
      industry,
      country,
      city,
      contactPhone: phone,
      contactEmail: email,
      accountStatus: "warning",
      statusReason: "Pending document upload and verification",
      maxAllowedDocuments: 20,
    })

    // 2. Hash password and create User record
    const passwordHash = await hashPassword(password)
    const verificationToken = generateSecureToken(32)
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const user = await User.create({
      email,
      passwordHash,
      role: "customer_admin",
      customerId: customer._id,
      firstName,
      lastName,
      phone,
      status: "active",
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    })

    // Generate JWT tokens
    const accessToken = await createAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: customer._id.toString(),
      accountStatus: customer.accountStatus,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const refreshToken = await createRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: customer._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = NextResponse.json(
      {
        success: true,
        message: "Account registered successfully",
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          customerId: customer._id.toString(),
          companyName: customer.companyName,
          accountStatus: customer.accountStatus,
        },
      },
      { status: 201 }
    )

    setAuthCookies(response, accessToken, refreshToken, true)
    return response
  } catch (error: unknown) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    )
  }
}
