import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Customer, Document as DocumentModel, Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden: Staff access required" }, { status: 403 })
    }

    await connectDB()

    const totalCustomers = await Customer.countDocuments()
    const activeCustomers = await Customer.countDocuments({ accountStatus: "active" })
    const warningCustomers = await Customer.countDocuments({ accountStatus: "warning" })
    const inactiveCustomers = await Customer.countDocuments({ accountStatus: "inactive" })

    const pendingReviewDocs = await DocumentModel.countDocuments({
      status: "pending_review",
      isArchived: false,
    })

    const expiringSoonDocs = await DocumentModel.countDocuments({
      status: "expiring_soon",
      isArchived: false,
    })

    const expiredDocs = await DocumentModel.countDocuments({
      status: "expired",
      isArchived: false,
    })

    const totalNotificationsSent = await Notification.countDocuments({
      channel: { $in: ["email", "whatsapp", "multi"] },
    })

    // Expiry horizon breakdown for charts
    const now = new Date()
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const in10Days = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000)
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const criticalCount = await DocumentModel.countDocuments({
      expiryDate: { $gte: now, $lte: in3Days },
      isArchived: false,
    })

    const urgentCount = await DocumentModel.countDocuments({
      expiryDate: { $gt: in3Days, $lte: in7Days },
      isArchived: false,
    })

    const warningCount = await DocumentModel.countDocuments({
      expiryDate: { $gt: in7Days, $lte: in10Days },
      isArchived: false,
    })

    const standardCount = await DocumentModel.countDocuments({
      expiryDate: { $gt: in10Days, $lte: in30Days },
      isArchived: false,
    })

    const expiryHorizonChartData = [
      { name: "Expired", count: expiredDocs, color: "#EF4444" },
      { name: "≤3 Days", count: criticalCount, color: "#F43F5E" },
      { name: "4-7 Days", count: urgentCount, color: "#F97316" },
      { name: "8-10 Days", count: warningCount, color: "#F59E0B" },
      { name: "11-30 Days", count: standardCount, color: "#10B981" },
    ]

    return NextResponse.json({
      metrics: {
        totalCustomers,
        activeCustomers,
        warningCustomers,
        inactiveCustomers,
        pendingReviewDocs,
        expiringSoonDocs,
        expiredDocs,
        totalNotificationsSent,
      },
      expiryHorizonChartData,
      urgentCount: criticalCount + urgentCount + warningCount,
    })
  } catch (error: unknown) {
    console.error("Admin analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
