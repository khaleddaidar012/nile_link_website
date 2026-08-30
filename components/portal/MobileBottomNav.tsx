"use client"

import { useTranslations } from "next-intl"
import { LayoutDashboard, FileText, Send, CreditCard, User, ShieldAlert } from "lucide-react"
import { Link, usePathname } from "@/navigation"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const t = useTranslations()
  const pathname = usePathname()
  const { user, documentStats } = usePortal()
  const isUnverified = Boolean(user && !user.emailVerified)

  if (isUnverified) {
    return (
      <nav className="fixed right-0 bottom-0 left-0 z-40 flex h-16 items-center justify-around border-t border-rose-200 bg-white/95 px-2 backdrop-blur-lg md:hidden dark:border-rose-900/40 dark:bg-[#0d1322]/95">
        <Link
          href="/portal/verification"
          className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400"
        >
          <ShieldAlert className="h-4 w-4 animate-pulse" />
          <span>{t("portal.verification.title") || "تفعيل الحساب والأمان (مطلوب)"}</span>
        </Link>
      </nav>
    )
  }

  const links = [
    { href: "/portal", label: t("portal.sidebar.dashboard") || "Dashboard", icon: LayoutDashboard },
    {
      href: "/portal/documents",
      label: t("portal.sidebar.documents") || "Documents",
      icon: FileText,
      badge: documentStats && documentStats.expiringDocs > 0 ? documentStats.expiringDocs : null,
    },
    { href: "/portal/requests", label: t("portal.sidebar.requests") || "Requests", icon: Send },
    { href: "/portal/financials", label: t("portal.sidebar.financials") || "Invoices", icon: CreditCard },
    { href: "/portal/profile", label: t("portal.sidebar.profile") || "Profile", icon: User },
  ]

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 flex h-16 items-center justify-around border-t border-secondary-200 bg-white/95 px-2 backdrop-blur-lg md:hidden dark:border-secondary-800 dark:bg-secondary-900/95">
      {links.map((item) => {
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/portal")

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors",
              isActive
                ? "text-primary-600 dark:text-primary-400 font-bold"
                : "text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
            )}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
