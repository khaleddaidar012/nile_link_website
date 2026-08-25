import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User, Customer, Document as DocumentModel, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.userId).lean()
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    let customer = null
    let documentStats = null

    if (user.customerId) {
      customer = await Customer.findById(user.customerId).lean()

      const totalDocs = await DocumentModel.countDocuments({
        customerId: user.customerId,
        isArchived: false,
      })

      const approvedDocs = await DocumentModel.countDocuments({
        customerId: user.customerId,
        status: "approved",
        isArchived: false,
      })

      const expiringDocs = await DocumentModel.countDocuments({
        customerId: user.customerId,
        status: "expiring_soon",
        isArchived: false,
      })

      const expiredDocs = await DocumentModel.countDocuments({
        customerId: user.customerId,
        status: "expired",
        isArchived: false,
      })

      const pendingDocs = await DocumentModel.countDocuments({
        customerId: user.customerId,
        status: "pending_review",
        isArchived: false,
      })

      documentStats = {
        totalDocs,
        approvedDocs,
        expiringDocs,
        expiredDocs,
        pendingDocs,
        maxAllowed: customer?.maxAllowedDocuments || 20,
      }
    }

    const unreadNotificationsCount = await Notification.countDocuments({
      $or: [
        { recipientUserId: user._id, isRead: false },
        { targetAudience: user.role === "staff" || user.role === "super_admin" ? "staff" : "customer", isRead: false },
      ],
    })

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        status: user.status,
        emailVerified: user.emailVerified,
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
            industry: customer.industry,
            country: customer.country,
            city: customer.city,
            address: customer.address,
          }
        : null,
      documentStats,
      unreadNotificationsCount,
    })
  } catch (error: unknown) {
    console.error("/api/auth/me error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
