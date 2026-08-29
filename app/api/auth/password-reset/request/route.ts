import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { createAndSendUserOtp } from "@/lib/auth/otp-service"
import { checkRateLimit } from "@/lib/auth/rate-limiter"

const requestSchema = z.object({
  identifier: z.string().min(3, "Email or phone number is required").trim(),
  channel: z.enum(["email", "whatsapp"]),
})

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
    const rateLimit = checkRateLimit(`pwd-reset-req:${ip}`, { windowMs: 15 * 60 * 1000, maxAttempts: 6 })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many reset attempts. Please try again later." },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }

    const { identifier, channel } = parsed.data
    await connectDB()

    let user = null

    if (channel === "email") {
      user = await User.findOne({ email: identifier.toLowerCase().trim() })
    } else {
      // WhatsApp channel: normalize phone query (handle e.g. "+201012345678", "01012345678", "201012345678")
      const digitsOnly = identifier.replace(/\D/g, "")
      const last8Digits = digitsOnly.slice(-8)

      user = await User.findOne({
        $or: [
          { phone: identifier.trim() },
          { phone: { $regex: last8Digits, $options: "i" } },
          { email: identifier.toLowerCase().trim() },
        ],
      })
    }

    if (!user) {
      // Return success with generic message to prevent account enumeration
      return NextResponse.json({
        success: true,
        channel,
        message:
          channel === "email"
            ? "If an account matches this email, a 6-digit reset code has been sent."
            : "If an account matches this WhatsApp number, a 6-digit reset code has been sent.",
        expiresInSeconds: 600,
      })
    }

    const dispatch = await createAndSendUserOtp(user, channel, "password_reset")

    return NextResponse.json({
      success: true,
      channel,
      message:
        channel === "email"
          ? `Password reset code sent to ${user.email}`
          : `Password reset code sent via WhatsApp to ${user.phone}`,
      previewCode: dispatch.previewCode,
      expiresInSeconds: 600,
    })
  } catch (error: unknown) {
    console.error("Password reset request error:", error)
    return NextResponse.json(
      { error: "Failed to initiate password reset. Please try again." },
      { status: 500 }
    )
  }
}
