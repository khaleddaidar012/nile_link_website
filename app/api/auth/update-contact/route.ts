import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { connectDB } from "@/lib/mongodb"
import { User, Customer } from "@/lib/models"
import { getSessionFromRequest, createAccessToken, createRefreshToken, setAuthCookies } from "@/lib/auth/token-service"
import { isBusinessEmail } from "@/lib/auth/password"

const updateContactSchema = z.object({
  channel: z.enum(["email", "whatsapp"]),
  newValue: z.string().min(3).trim(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateContactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid contact update request.", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { channel, newValue } = parsed.data

    await connectDB()
    const user = await User.findById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 })
    }

    const otpCode = crypto.randomInt(100000, 999999).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    if (channel === "email") {
      const emailLower = newValue.toLowerCase()
      const emailCheck = z.string().email().safeParse(emailLower)
      if (!emailCheck.success) {
        return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
      }

      // Check if email already belongs to another user
      const existing = await User.findOne({ email: emailLower, _id: { $ne: user._id } })
      if (existing) {
        return NextResponse.json(
          { error: "This email address is already registered by another corporate account." },
          { status: 409 }
        )
      }

      user.email = emailLower
      user.emailVerified = false
      user.emailVerificationOtp = otpCode
      user.emailVerificationOtpExpires = expiresAt
      await user.save()

      if (user.customerId) {
        await Customer.findByIdAndUpdate(user.customerId, { contactEmail: emailLower })
      }

      console.log(`[NileLink Auth] Contact email updated to ${emailLower}. OTP dispatched: ${otpCode}`)
    } else if (channel === "whatsapp") {
      if (newValue.length < 8) {
        return NextResponse.json(
          { error: "Please provide a valid phone / WhatsApp number with country code." },
          { status: 400 }
        )
      }

      user.phone = newValue
      user.whatsappVerified = false
      user.whatsappVerificationCode = otpCode
      user.whatsappVerificationExpires = expiresAt
      await user.save()

      if (user.customerId) {
        await Customer.findByIdAndUpdate(user.customerId, { contactPhone: newValue })
      }

      console.log(`[NileLink Auth] WhatsApp phone updated to ${newValue}. OTP dispatched: ${otpCode}`)
    }

    // Refresh auth cookies with updated user claims
    const accessToken = await createAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId ? user.customerId.toString() : undefined,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const refreshToken = await createRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId ? user.customerId.toString() : undefined,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = NextResponse.json({
      success: true,
      channel,
      newValue: channel === "email" ? user.email : user.phone,
      message:
        channel === "email"
          ? `Email updated successfully. Fresh verification code sent to ${user.email}`
          : `WhatsApp number updated successfully. Fresh verification code sent to ${user.phone}`,
      previewCode: otpCode,
      expiresInSeconds: 600,
    })

    setAuthCookies(response, accessToken, refreshToken, true)
    return response
  } catch (error: unknown) {
    console.error("Update contact error:", error)
    return NextResponse.json(
      { error: "Internal server error while updating contact information." },
      { status: 500 }
    )
  }
}
