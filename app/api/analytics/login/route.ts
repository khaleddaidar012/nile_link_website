import { NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const validUsername = process.env.ANALYTICS_USERNAME
    const validPassword = process.env.ANALYTICS_PASSWORD

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { success: false, message: "Analytics authentication is not configured" },
        { status: 500 }
      )
    }

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      )
    }

    const token = await createSession()

    const response = NextResponse.json({ success: true })
    response.cookies.set("analytics_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
