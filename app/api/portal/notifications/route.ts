import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const page = parseInt(searchParams.get("page") || "1", 10)

    await connectDB()

    const query: Record<string, unknown> = {
      $or: [
        { recipientUserId: session.userId },
        { recipientCustomerId: session.customerId },
        { targetAudience: "customer", recipientUserId: null, recipientCustomerId: null },
      ],
    }

    const total = await Notification.countDocuments(query)
    const rawNotifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // Process broadcast notifications read state
    const notifications = rawNotifications.map((n: any) => {
      let read = n.isRead
      if (n.targetAudience && n.targetAudience !== "customer" && n.readBy) {
         read = n.isRead || n.readBy.some((id: any) => id.toString() === session.userId)
      } else if (n.targetAudience === "customer" && n.readBy) {
         read = n.isRead || n.readBy.some((id: any) => id.toString() === session.userId)
      }
      return { ...n, isRead: read }
    })

    return NextResponse.json({
      notifications,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error: unknown) {
    console.error("Fetch notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
