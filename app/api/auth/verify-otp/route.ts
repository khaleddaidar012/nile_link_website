import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User, Customer } from "@/lib/models"
import {
  getSessionFromRequest,
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
} from "@/lib/auth/token-service"

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const body = await req.json()
    const { channel, code } = body

    if (!code || typeof code !== "string" || code.trim().length !== 6) {
      return NextResponse.json(
        { error: "Invalid OTP format. Please enter the 6-digit code." },
        { status: 400 }
      )
    }

    if (channel !== "email" && channel !== "whatsapp") {
      return NextResponse.json(
        { error: "Invalid channel specified." },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 })
    }

    const now = new Date()
    const cleanCode = code.trim()

    if (channel === "email") {
      if (!user.emailVerificationOtp || user.emailVerificationOtp !== cleanCode) {
        return NextResponse.json(
          { error: "Invalid email verification code. Please check and try again." },
          { status: 400 }
        )
      }
      if (user.emailVerificationOtpExpires && user.emailVerificationOtpExpires < now) {
        return NextResponse.json(
          { error: "Email verification code has expired. Please request a new code." },
          { status: 400 }
        )
      }

      user.emailVerified = true
      user.emailVerificationOtp = undefined
      user.emailVerificationOtpExpires = undefined
      await user.save()
    } else if (channel === "whatsapp") {
      if (!user.whatsappVerificationCode || user.whatsappVerificationCode !== cleanCode) {
        return NextResponse.json(
          { error: "Invalid WhatsApp verification code. Please check and try again." },
          { status: 400 }
        )
      }
      if (user.whatsappVerificationExpires && user.whatsappVerificationExpires < now) {
        return NextResponse.json(
          { error: "WhatsApp verification code has expired. Please request a new code." },
          { status: 400 }
        )
      }

      user.whatsappVerified = true
      user.whatsappVerificationCode = undefined
      user.whatsappVerificationExpires = undefined
      await user.save()
    }

    // Check if customer status should be promoted if both channels are verified
    let customerStatus = session.accountStatus || "warning"
    if (user.emailVerified && user.whatsappVerified && user.customerId) {
      const customer = await Customer.findById(user.customerId)
      if (customer && customer.accountStatus === "warning" && customer.statusReason?.includes("Pending")) {
        // If documents are not yet uploaded, customer remains in good standing for documents
        customerStatus = customer.accountStatus
      }
    }

    // Refresh JWT tokens with latest verification status
    const accessToken = await createAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId?.toString(),
      accountStatus: customerStatus,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      emailVerified: user.emailVerified,
      whatsappVerified: user.whatsappVerified,
    })

    const refreshToken = await createRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId?.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      emailVerified: user.emailVerified,
      whatsappVerified: user.whatsappVerified,
    })

    const response = NextResponse.json({
      success: true,
      message: `${channel === "email" ? "Business Email" : "WhatsApp"} verified successfully!`,
      channel,
      emailVerified: user.emailVerified,
      whatsappVerified: user.whatsappVerified,
      allVerified: user.emailVerified,
      isFullyVerified: user.emailVerified,
    })

    setAuthCookies(response, accessToken, refreshToken, true)
    return response
  } catch (error: unknown) {
    console.error("Verify OTP error:", error)
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 }
    )
  }
}
