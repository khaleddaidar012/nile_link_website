import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Notification } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const body = await req.json().catch(() => ({}))
    const notificationId = body.notificationId

    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, {
        isRead: true,
        readAt: new Date(),
      })
    } else {
      await Notification.updateMany(
        {
          $or: [
            { recipientUserId: session.userId },
            { recipientCustomerId: session.customerId },
          ],
          isRead: false,
        },
        {
          isRead: true,
          readAt: new Date(),
        }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Mark notifications read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
