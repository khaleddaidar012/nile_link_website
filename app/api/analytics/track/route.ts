import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/mongodb"
import { AnalyticsEvent } from "@/lib/models/AnalyticsEvent"

const DEDUP_WINDOW_MS = 30_000

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16)
}

function detectDevice(userAgent: string): "mobile" | "desktop" | "tablet" {
  const ua = userAgent.toLowerCase()
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) return "tablet"
  if (/mobile|ipod|iphone|blackberry|opera mini|fennec|windows phone/i.test(ua)) return "mobile"
  return "desktop"
}

export async function POST(request: NextRequest) {
  try {
    const ANALYTICS_ENABLED = process.env.ANALYTICS_ENABLED !== "false"
    if (!ANALYTICS_ENABLED) {
      return NextResponse.json({ success: true, message: "Analytics disabled" })
    }

    const body = await request.json()
    const { type, page } = body

    if (!type || !page) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: type, page" },
        { status: 400 }
      )
    }

    const validTypes = ["page_view", "contact_submit", "service_view"]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, message: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")
    const rawIP = forwarded?.split(",")[0]?.trim() || realIP || "127.0.0.1"
    const ipHash = hashIP(rawIP)

    const userAgent = request.headers.get("user-agent") || ""
    const device = detectDevice(userAgent)

    await connectDB()

    const now = Date.now()
    const recent = await AnalyticsEvent.findOne({
      ipHash,
      type,
      page,
      createdAt: { $gte: new Date(now - DEDUP_WINDOW_MS) },
    }).lean()

    if (recent) {
      return NextResponse.json({ success: true, message: "Duplicate ignored" })
    }

    await AnalyticsEvent.create({
      type,
      page,
      device,
      userAgent,
      ipHash,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, message: "Tracked" })
  } catch (error) {
    console.error("[Analytics Track] Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
