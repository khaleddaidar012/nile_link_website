import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session || (session.role !== "staff" && session.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden: Staff access required" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "30", 10)

    await connectDB()

    const notifications = await Notification.find({
      $or: [{ targetAudience: "staff" }, { targetAudience: "all_staff" }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("recipientCustomerId", "companyName commercialRegisterNumber")
      .lean()

    const mappedNotifications = notifications.map((n: any) => {
      let actionUrl = n.actionUrl
      if (!actionUrl) {
        if (n.relatedRequestId) {
          actionUrl = `/admin/requests/${n.relatedRequestId}`
        } else if (n.relatedDocumentId) {
          actionUrl = `/admin/documents/review`
        }
      }
      return { ...n, actionUrl }
    })

    return NextResponse.json({
      notifications: mappedNotifications,
      total: notifications.length,
    })
  } catch (error: unknown) {
    console.error("Admin fetch notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
