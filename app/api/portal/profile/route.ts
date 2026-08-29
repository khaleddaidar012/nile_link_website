import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User, Customer, Document as DocumentModel, CustomerRequest } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, underscores, and dots")
    .optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  companyName: z.string().min(2).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.userId).lean()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let customer = null
    let operations = {
      totalShipments: 0,
      activeShipments: 0,
      deliveredShipments: 0,
      activeServices: [
        "Sea Freight (FCL / LCL)",
        "Air Cargo Express",
        "Customs Clearance Alexandria & Sokhna",
        "Bonded Warehousing",
      ],
    }

    let expiringDocuments: any[] = []

    if (user.customerId) {
      customer = await Customer.findById(user.customerId).lean()

      // Calculate operations counts from CustomerRequest
      const totalRequests = await CustomerRequest.countDocuments({
        customerId: user.customerId,
      })
      const activeRequests = await CustomerRequest.countDocuments({
        customerId: user.customerId,
        status: { $in: ["submitted", "under_review", "in_progress", "waiting_customer"] },
      })
      const completedRequests = await CustomerRequest.countDocuments({
        customerId: user.customerId,
        status: "completed",
      })

      operations = {
        totalShipments: totalRequests,
        activeShipments: activeRequests,
        deliveredShipments: completedRequests,
        activeServices: [
          "Sea Freight (FCL / LCL)",
          "Air Cargo Express",
          "Customs Clearance Alexandria & Sokhna",
          "Bonded Warehousing",
        ],
      }

      // Query expiring documents strictly sorted in ASCENDING order of urgency (closest expiry date first)
      const rawExpiring = await DocumentModel.find({
        customerId: user.customerId,
        isArchived: false,
        expiryDate: { $exists: true, $ne: null },
      })
        .sort({ expiryDate: 1, title: 1 })
        .lean()

      expiringDocuments = rawExpiring.map((doc) => ({
        id: doc._id.toString(),
        title: doc.title,
        category: doc.category,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        status: doc.status,
        startDate: doc.startDate?.toISOString() || null,
        expiryDate: doc.expiryDate?.toISOString() || null,
        rejectionReason: doc.rejectionReason || null,
        warningEscalationTier: doc.warningEscalationTier || "none",
        createdAt: doc.createdAt?.toISOString(),
      }))
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        username: user.username || "",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
        avatarUrl: user.avatarUrl,
        role: user.role,
        emailVerified: !!user.emailVerified,
        whatsappVerified: !!user.whatsappVerified,
        createdAt: user.createdAt,
      },
      customer: customer
        ? {
            id: customer._id.toString(),
            companyName: customer.companyName,
            commercialRegisterNumber: customer.commercialRegisterNumber,
            taxCardNumber: customer.taxCardNumber,
            accountStatus: customer.accountStatus,
            statusReason: customer.statusReason,
            contactPhone: customer.contactPhone,
            contactEmail: customer.contactEmail,
            industry: customer.industry || "Import & Export",
            country: customer.country,
            city: customer.city || "Alexandria",
            address: customer.address || "",
            maxAllowedDocuments: customer.maxAllowedDocuments || 20,
          }
        : null,
      operations,
      expiringDocuments,
    })
  } catch (error: unknown) {
    console.error("GET /api/portal/profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      )
    }

    await connectDB()

    // 1. If updating username, ensure unique across all users
    if (parsed.data.username) {
      const existingUser = await User.findOne({
        username: parsed.data.username.toLowerCase().trim(),
        _id: { $ne: session.userId },
      })
      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken by another user." },
          { status: 400 }
        )
      }
    }

    // 2. Update User Record
    const userUpdateFields: Record<string, any> = {}
    if (parsed.data.username) userUpdateFields.username = parsed.data.username.toLowerCase().trim()
    if (parsed.data.firstName) userUpdateFields.firstName = parsed.data.firstName
    if (parsed.data.lastName) userUpdateFields.lastName = parsed.data.lastName
    if (parsed.data.phone !== undefined) userUpdateFields.phone = parsed.data.phone

    if (Object.keys(userUpdateFields).length > 0) {
      await User.findByIdAndUpdate(session.userId, userUpdateFields)
    }

    // 3. Update Customer Record
    if (session.customerId) {
      const customerUpdateFields: Record<string, any> = {}
      if (parsed.data.companyName) customerUpdateFields.companyName = parsed.data.companyName
      if (parsed.data.address !== undefined) customerUpdateFields.address = parsed.data.address
      if (parsed.data.city) customerUpdateFields.city = parsed.data.city
      if (parsed.data.country) customerUpdateFields.country = parsed.data.country
      if (parsed.data.industry) customerUpdateFields.industry = parsed.data.industry

      if (Object.keys(customerUpdateFields).length > 0) {
        await Customer.findByIdAndUpdate(session.customerId, customerUpdateFields)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error: unknown) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
