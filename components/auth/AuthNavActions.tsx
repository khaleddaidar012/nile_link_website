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
      <div className={cn("flex items-center", isMobile ? "w-full" : "hidden sm:flex")}>
        <div className="h-9 w-24 animate-pulse rounded-xl bg-white/10" />
      </div>
    )
  }

  if (session.authenticated && session.user) {
    const isStaff = session.user.role === "staff" || session.user.role === "super_admin"
    const portalUrl = isStaff ? "/admin" : "/portal"
    const portalLabel = isStaff
      ? (t("portal.header.adminPortal") || "Admin Operations")
      : (t("portal.header.clientPortal") || "Client Portal")

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
            "flex items-center gap-1.5 rounded-xl font-bold shadow-md transition-all",
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

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/login"
          onClick={onMobileClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-primary-700"
        >
          <LogIn className="h-4 w-4" />
          <span>{t("auth.login.submit") || "Client Portal / Login"}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="hidden items-center sm:flex">
      <Link href="/login">
        <Button
          size="sm"
          className={cn(
            "flex items-center gap-1.5 rounded-xl font-bold shadow-md transition-all",
            scrolled
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "border border-white/25 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
          )}
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>{t("auth.login.submit") || "Sign In to Portal"}</span>
        </Button>
      </Link>
    </div>
  )
}
