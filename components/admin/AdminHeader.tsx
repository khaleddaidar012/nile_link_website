"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { useTheme } from "@/components/layout/ThemeProvider"
import { Moon, Sun, Shield, Bell, Globe, ChevronDown } from "lucide-react"
import { Link, usePathname } from "@/navigation"

interface AdminHeaderProps {
  title?: string
  subtitle?: string
}

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
]

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [langOpen, setLangOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 backdrop-blur-md text-white shadow-md">
      <div>
        <h1 className="text-base font-bold text-white sm:text-lg">{title || "Operations Dashboard"}</h1>
        {subtitle && <p className="text-xs text-slate-400 line-clamp-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs font-semibold text-slate-300 shadow-sm transition-colors hover:bg-slate-800"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="uppercase">{locale}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {langOpen && (
            <div className="absolute top-full right-0 z-50 mt-1 w-28 rounded-xl border border-slate-800 bg-slate-900 py-1 shadow-2xl rtl:right-auto rtl:left-0">
              {languages.map((l) => (
                <Link
                  key={l.code}
                  href={pathname}
                  locale={l.code as any}
                  onClick={() => setLangOpen(false)}
                  className={`block px-3 py-1.5 text-xs font-medium transition-colors ${
                    locale === l.code
                      ? "bg-primary-950/60 font-bold text-primary-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Center Link */}
        <Link href="/admin/notifications">
          <button
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 shadow-sm hover:bg-slate-800 hover:text-white transition-colors"
            title="Notification Center"
          >
            <Bell className="h-4 w-4" />
          </button>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 shadow-sm hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Staff Role Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-primary-500/30 bg-primary-950/40 px-3 py-1.5 text-xs text-primary-300 shadow-sm">
          <Shield className="h-3.5 w-3.5 text-primary-400" />
          <span className="font-bold">NileLink Staff</span>
        </div>
      </div>
    </header>
  )
}
