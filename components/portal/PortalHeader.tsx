"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "@/components/layout/ThemeProvider"
import { Moon, Sun, User, LogOut, Globe, ChevronDown } from "lucide-react"
import { Link, usePathname } from "@/navigation"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { usePortal } from "./PortalContext"
import { NotificationBellPopover } from "./NotificationBellPopover"

interface PortalHeaderProps {
  title?: string
  subtitle?: string
}

const languages = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
]

export function PortalHeader({ title, subtitle }: PortalHeaderProps) {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const { user, customer, logout } = usePortal()
  const { theme, setTheme } = useTheme()
  const [langOpen, setLangOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0d1322]/90 gap-2">
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-white sm:text-lg truncate flex items-center gap-2">
            {title || (customer ? customer.companyName : "Client Portal")}
            {customer && (
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                customer.accountStatus === "active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                customer.accountStatus === "warning" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
              }`}>
                {customer.accountStatus === "active" && <CheckCircle2 className="h-3 w-3" />}
                {customer.accountStatus === "warning" && <AlertTriangle className="h-3 w-3" />}
                {customer.accountStatus === "inactive" && <XCircle className="h-3 w-3" />}
                {customer.accountStatus === "active" ? (locale === "ar" ? "شركة موثقة" : "Verified Company") :
                 customer.accountStatus === "warning" ? (locale === "ar" ? "قيد المراجعة" : "Pending Review") :
                 (locale === "ar" ? "غير موثق" : "Unverified")}
              </span>
            )}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-secondary-500 dark:text-secondary-400 line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-secondary-200/80 bg-white px-2.5 py-2 text-xs font-semibold text-secondary-700 shadow-sm transition-colors hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="uppercase">{locale}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {langOpen && (
            <div className="absolute top-full right-0 z-50 mt-1 w-28 rounded-xl border border-secondary-200 bg-white py-1 shadow-lg dark:border-secondary-700 dark:bg-secondary-900 rtl:right-auto rtl:left-0">
              {languages.map((l) => (
                <Link
                  key={l.code}
                  href={pathname}
                  locale={l.code as any}
                  onClick={() => setLangOpen(false)}
                  className={`block px-3 py-1.5 text-xs font-medium transition-colors ${
                    locale === l.code
                      ? "bg-primary-50 font-bold text-primary-600 dark:bg-primary-950/40 dark:text-primary-400"
                      : "text-secondary-700 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-800"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <NotificationBellPopover />

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl border border-secondary-200/80 bg-white p-2 text-secondary-600 shadow-sm transition-colors hover:bg-secondary-50 hover:text-secondary-900 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-white"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Pill */}
        {user && (
          <div className="flex items-center gap-2 rounded-xl border border-secondary-200/80 bg-secondary-50/80 py-1 pr-2.5 pl-1.5 shadow-sm dark:border-secondary-800 dark:bg-secondary-800/80 rtl:pr-1.5 rtl:pl-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white shadow-sm">
              {user.firstName ? user.firstName[0].toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="hidden text-left text-xs sm:block rtl:text-right">
              <div className="flex items-center gap-1.5">
                <p className="truncate max-w-[120px] font-bold text-secondary-900 dark:text-white leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                {(!user.emailVerified || !user.whatsappVerified) && (
                  <Link
                    href="/portal/verification"
                    title="Account Pending Verification"
                    className="shrink-0 rounded bg-secondary-100 px-1.5 py-0.5 text-[9px] font-bold text-secondary-600 dark:bg-secondary-800 dark:text-secondary-400 hover:bg-secondary-200"
                  >
                    {locale === "ar" ? "تأكيد الحساب" : "Verify Account"}
                  </Link>
                )}
              </div>
              <p className="text-[10px] text-secondary-500 capitalize dark:text-secondary-400">
                {t(`portal.roles.${user.role}`) || user.role.replace("_", " ")}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="ml-1.5 rounded-lg p-1 text-secondary-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 rtl:mr-1.5 rtl:ml-0 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
