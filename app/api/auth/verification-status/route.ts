import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { getSessionFromRequest } from "@/lib/auth/token-service"

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(session.userId).select("email phone emailVerified whatsappVerified firstName lastName")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      email: user.email,
      phone: user.phone || "",
      emailVerified: !!user.emailVerified,
      whatsappVerified: !!user.whatsappVerified,
      firstName: user.firstName,
      lastName: user.lastName,
    })
  } catch (error) {
    console.error("Verification status fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
