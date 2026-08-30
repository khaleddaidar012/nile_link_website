import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n"
import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken, ACCESS_COOKIE_NAME } from "@/lib/auth/token-service"

const handleI18nRouting = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Intercept portal routes for unverified users
  const isPortal = pathname.includes("/portal")
  const isVerification = pathname.includes("/portal/verification")

  if (isPortal && !isVerification) {
    const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value
    if (token) {
      try {
        const session = await verifyAuthToken(token)
        if (session && session.emailVerified === false) {
          const segments = pathname.split("/").filter(Boolean)
          const firstSegment = segments[0]
          const locale = ["ar", "en", "fr", "de", "it", "zh", "bg"].includes(firstSegment)
            ? firstSegment
            : "ar"
          const targetUrl = new URL(`/${locale}/portal/verification`, request.url)
          return NextResponse.redirect(targetUrl)
        }
      } catch {
        // Fall through to standard routing
      }
    }
  }

  return handleI18nRouting(request)
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|uploads|.*\\..*).*)",
  ],
}
