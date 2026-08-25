import { NextResponse } from "next/server"
import { clearAuthCookies } from "@/lib/auth/token-service"

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  })

  clearAuthCookies(response)
  return response
}
