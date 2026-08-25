import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SESSION_COOKIE = "analytics_session"
const SESSION_DURATION = 60 * 60 * 24

function getSecret(): Uint8Array {
  const secret = process.env.ANALYTICS_SECRET || process.env.ANALYTICS_PASSWORD || "fallback"
  return new TextEncoder().encode(secret)
}

export async function createSession(): Promise<string> {
  return await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret())
}

export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) return false
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export async function verifyApiSession(request: Request): Promise<boolean> {
  try {
    const cookieHeader = request.headers.get("cookie") || ""
    const token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${SESSION_COOKIE}=`))
      ?.split("=")[1]
    if (!token) return false
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}
