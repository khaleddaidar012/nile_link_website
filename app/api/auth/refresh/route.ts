import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User, Customer } from "@/lib/models"
import {
  REFRESH_COOKIE_NAME,
  verifyAuthToken,
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth/token-service"

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || ""
    const cookiesMap = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=")
        return [k, v.join("=")]
      })
    )

    const refreshToken = cookiesMap[REFRESH_COOKIE_NAME]
    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 401 })
    }

    const payload = await verifyAuthToken(refreshToken)
    if (!payload || payload.tokenType !== "refresh") {
      const response = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
      clearAuthCookies(response)
      return response
    }

    await connectDB()
    const user = await User.findById(payload.userId)
    if (!user || user.status === "suspended" || user.status === "inactive") {
      const response = NextResponse.json({ error: "User account unavailable" }, { status: 401 })
      clearAuthCookies(response)
      return response
    }

    let customer = null
    if (user.customerId) {
      customer = await Customer.findById(user.customerId)
    }

    const newAccessToken = await createAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId ? user.customerId.toString() : null,
      accountStatus: customer?.accountStatus,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const newRefreshToken = await createRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      customerId: user.customerId ? user.customerId.toString() : null,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        customerId: user.customerId ? user.customerId.toString() : null,
        accountStatus: customer?.accountStatus,
      },
    })

    setAuthCookies(response, newAccessToken, newRefreshToken, true)
    return response
  } catch (error: unknown) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
