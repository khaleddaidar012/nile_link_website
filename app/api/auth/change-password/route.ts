import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"
import { verifyPassword, hashPassword, validatePasswordComplexity } from "@/lib/auth/password"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = changePasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = parsed.data

    const passwordCheck = validatePasswordComplexity(newPassword)
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.error }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(session.userId).select("+passwordHash")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    user.passwordHash = await hashPassword(newPassword)
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error: unknown) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
