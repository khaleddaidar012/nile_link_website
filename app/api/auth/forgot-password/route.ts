import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { generateSecureToken } from "@/lib/auth/password"
import { checkRateLimit } from "@/lib/auth/rate-limiter"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
})

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
    const rateLimit = checkRateLimit(`forgot-pwd:${ip}`, { windowMs: 15 * 60 * 1000, maxAttempts: 4 })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many reset requests. Please try again later.", code: "RATE_LIMITED" },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const { email } = parsed.data
    await connectDB()

    const user = await User.findOne({ email })

    if (user) {
      const resetToken = generateSecureToken(32)
      user.passwordResetToken = resetToken
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      await user.save()

      // Log or trigger reset email delivery (handled via email service in production)
      console.log(`[AUTH] Password reset token generated for ${email}: ${resetToken}`)
    }

    // Always return generic success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, password reset instructions have been sent.",
    })
  } catch (error: unknown) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
