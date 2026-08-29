"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { LogIn, LayoutDashboard, Shield } from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface UserSessionState {
  authenticated: boolean
  user?: {
    id: string
    email: string
    role: "customer" | "customer_admin" | "staff" | "super_admin"
    firstName: string
    lastName: string
  }
}

interface AuthNavActionsProps {
  scrolled?: boolean
  isMobile?: boolean
  onMobileClick?: () => void
}

export function AuthNavActions({ scrolled = false, isMobile = false, onMobileClick }: AuthNavActionsProps) {
  const t = useTranslations()
  const [session, setSession] = useState<UserSessionState>({ authenticated: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/me", { method: "GET" })
        if (res.ok) {
          const data = await res.json()
          if (isMounted && data.authenticated) {
            setSession({ authenticated: true, user: data.user })
          }
        }
      } catch {
        // Unauthenticated
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchSession()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className={cn("flex items-center", isMobile ? "w-full" : "flex")}>
        <div className="h-9 w-20 sm:w-24 animate-pulse rounded-xl bg-white/10" />
      </div>
    )
  }

  if (session.authenticated && session.user) {
    const isStaff = session.user.role === "staff" || session.user.role === "super_admin"
    const portalUrl = isStaff ? "/admin" : "/portal"
    const portalLabel = isStaff
      ? (t("nav.adminPortal") || "Admin Portal")
      : (t("nav.clientPortal") || "Client Portal")

    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <Link
            href={portalUrl}
            onClick={onMobileClick}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-primary-700"
          >
            {isStaff ? <Shield className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
            <span>{portalLabel}</span>
          </Link>
        </div>
      )
    }

    return (
      <Link href={portalUrl}>
        <Button
          size="sm"
          className={cn(
            "flex items-center gap-1.5 rounded-xl text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 font-bold shadow-md transition-all",
            scrolled
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "border border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
          )}
        >
          {isStaff ? <Shield className="h-3.5 w-3.5" /> : <LayoutDashboard className="h-3.5 w-3.5" />}
          <span>{portalLabel}</span>
        </Button>
      </Link>
    )
  }

  const loginLabel = t("nav.portalLogin") || t("nav.clientPortal") || "Client Portal"

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/login"
          onClick={onMobileClick}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-primary-500/25"
        >
          {/* Shimmer Light Streak */}
          <div className="pointer-events-none absolute inset-0 -top-1 -bottom-1 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-sweep" />
          <LogIn className="relative z-10 h-4 w-4" />
          <span className="relative z-10">{loginLabel}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      <Link href="/login">
        <Button
          size="sm"
          className={cn(
            "group relative flex items-center gap-1.5 overflow-hidden rounded-xl text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 font-bold shadow-md transition-all",
            scrolled
              ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 hover:shadow-lg hover:shadow-primary-500/20"
              : "border border-white/30 bg-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:shadow-lg hover:shadow-white/10"
          )}
        >
          {/* Shimmer Light Streak */}
          <div className="pointer-events-none absolute inset-0 -top-1 -bottom-1 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shine-sweep" />
          <LogIn className="relative z-10 h-3.5 w-3.5" />
          <span className="relative z-10">{loginLabel}</span>
        </Button>
      </Link>
    </div>
  )
}
