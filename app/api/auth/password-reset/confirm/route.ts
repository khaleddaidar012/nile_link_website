import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { hashPassword, validatePasswordComplexity } from "@/lib/auth/password"
import { verifyUserOtp } from "@/lib/auth/otp-service"

const confirmSchema = z.object({
  identifier: z.string().min(3, "Identifier is required").trim(),
  channel: z.enum(["email", "whatsapp"]),
  code: z.string().length(6, "Verification code must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = confirmSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      )
    }

    const { identifier, channel, code, newPassword } = parsed.data

    const passwordCheck = validatePasswordComplexity(newPassword)
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.error }, { status: 400 })
    }

    await connectDB()

    let user = null
    if (channel === "email") {
      user = await User.findOne({ email: identifier.toLowerCase().trim() })
    } else {
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
      return NextResponse.json(
        { error: "No account found matching this verification request." },
        { status: 404 }
      )
    }

    const verification = verifyUserOtp(user, channel, code, "password_reset")
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || "Invalid or expired verification code." },
        { status: 400 }
      )
    }

    // Hash and update new password
    user.passwordHash = await hashPassword(newPassword)
    user.passwordResetOtp = undefined
    user.passwordResetOtpExpires = undefined
    user.passwordResetChannel = undefined
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Password has been successfully reset. You can now log in with your new password.",
    })
  } catch (error: unknown) {
    console.error("Password reset confirmation error:", error)
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    )
  }
}
