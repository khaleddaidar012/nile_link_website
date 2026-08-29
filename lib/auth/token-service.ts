import { SignJWT, jwtVerify, JWTPayload } from "jose"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { UserRole, IStaffPermissions } from "@/lib/models/User"
import { AccountStatus } from "@/lib/models/Customer"

export const ACCESS_COOKIE_NAME = "nilelink_access_token"
export const REFRESH_COOKIE_NAME = "nilelink_refresh_token"

const ACCESS_EXPIRY_SECONDS = 60 * 60 // 1 hour
const REFRESH_EXPIRY_SECONDS = 60 * 60 * 24 * 7 // 7 days

export interface UserTokenData {
  userId: string
  email: string
  role: UserRole
  customerId?: string | null
  accountStatus?: AccountStatus
  firstName: string
  lastName: string
  phone?: string
  staffPermissions?: IStaffPermissions
  emailVerified?: boolean
  whatsappVerified?: boolean
}

export interface AuthSessionPayload extends JWTPayload, UserTokenData {}

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.ANALYTICS_SECRET ||
    "nilelink_production_secure_jwt_secret_key_2026_enterprise"
  return new TextEncoder().encode(secret)
}

export async function createAccessToken(payload: UserTokenData): Promise<string> {
  return await new SignJWT({ ...payload, tokenType: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_EXPIRY_SECONDS}s`)
    .sign(getJwtSecret())
}

export async function createRefreshToken(payload: UserTokenData): Promise<string> {
  return await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    customerId: payload.customerId,
    tokenType: "refresh",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_EXPIRY_SECONDS}s`)
    .sign(getJwtSecret())
}

export async function verifyAuthToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as AuthSessionPayload
  } catch {
    return null
  }
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean = true
) {
  const isProd = process.env.NODE_ENV === "production"

  response.cookies.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe ? ACCESS_EXPIRY_SECONDS : undefined,
  })

  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe ? REFRESH_EXPIRY_SECONDS : undefined,
  })
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}

export async function getServerSession(): Promise<AuthSessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value
    if (!accessToken) return null
    return await verifyAuthToken(accessToken)
  } catch {
    return null
  }
}

export async function getSessionFromRequest(request: Request): Promise<AuthSessionPayload | null> {
  try {
    const cookieHeader = request.headers.get("cookie") || ""
    const cookiesMap = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=")
        return [k, v.join("=")]
      })
    )

    const accessToken = cookiesMap[ACCESS_COOKIE_NAME]
    if (!accessToken) return null
    return await verifyAuthToken(accessToken)
  } catch {
    return null
  }
}
