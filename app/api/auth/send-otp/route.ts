import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import { createAndSendUserOtp } from "@/lib/auth/otp-service"

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const body = await req.json()
    const { channel } = body

    if (channel !== "email" && channel !== "whatsapp") {
      return NextResponse.json(
        { error: "Invalid verification channel. Must be 'email' or 'whatsapp'." },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 })
    }

    // Dispatch OTP using unified service
    const dispatch = await createAndSendUserOtp(user, channel, "account_verification")

    if (!dispatch.success) {
      return NextResponse.json(
        { error: dispatch.error || "Failed to dispatch verification code." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      channel,
      message:
        channel === "email"
          ? `Verification code dispatched to ${user.email}`
          : `Verification code dispatched via WhatsApp to ${user.phone}`,
      previewCode: dispatch.previewCode,
      expiresInSeconds: 600,
    })
  } catch (error: unknown) {
    console.error("Send OTP error:", error)
    return NextResponse.json(
      { error: "Failed to dispatch verification code. Please try again." },
      { status: 500 }
    )
  }
}
