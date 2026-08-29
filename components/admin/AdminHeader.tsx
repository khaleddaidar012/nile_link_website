"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "@/components/layout/ThemeProvider"
import { Moon, Sun, Shield, Bell, Globe, ChevronDown } from "lucide-react"
import { Link, usePathname } from "@/navigation"

interface AdminHeaderProps {
  title?: string
  subtitle?: string
}

const languages = [
  { code: "ar", label: "العربية (Arabic)" },
  { code: "en", label: "English (UK)" },
  { code: "fr", label: "Français (French)" },
  { code: "de", label: "Deutsch (German)" },
  { code: "it", label: "Italiano (Italian)" },
  { code: "zh", label: "中文 (Chinese)" },
  { code: "bg", label: "Български (Bulgarian)" },
]

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [langOpen, setLangOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-secondary-200 bg-white/90 px-6 backdrop-blur-md text-secondary-900 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950/90 dark:text-white">
      <div>
        <h1 className="text-base font-bold text-secondary-900 sm:text-lg dark:text-white">
          {title || "Operations Dashboard"}
        </h1>
        {subtitle && (
          <p className="text-xs text-secondary-500 line-clamp-1 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-secondary-200 bg-secondary-50 px-2.5 py-2 text-xs font-semibold text-secondary-700 shadow-sm transition-colors hover:bg-secondary-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="uppercase">{locale}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {langOpen && (
            <div className="absolute top-full right-0 z-50 mt-1 w-44 rounded-xl border border-secondary-200 bg-white py-1 shadow-2xl dark:border-slate-800 dark:bg-slate-900 rtl:right-auto rtl:left-0">
              {languages.map((l) => (
                <Link
                  key={l.code}
                  href={pathname}
                  locale={l.code as any}
                  onClick={() => setLangOpen(false)}
                  className={`block px-3 py-2 text-xs font-medium transition-colors ${
                    locale === l.code
                      ? "bg-primary-50 font-bold text-primary-600 dark:bg-primary-950/60 dark:text-primary-400"
                      : "text-secondary-700 hover:bg-secondary-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
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
            className="rounded-xl border border-secondary-200 bg-secondary-50 p-2 text-secondary-700 shadow-sm hover:bg-secondary-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            title="Notification Center"
          >
            <Bell className="h-4 w-4" />
          </button>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl border border-secondary-200 bg-secondary-50 p-2 text-secondary-700 shadow-sm hover:bg-secondary-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-secondary-700" />
          )}
        </button>

        {/* Staff Role Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-primary-500/30 bg-primary-50 px-3 py-1.5 text-xs text-primary-700 shadow-sm dark:bg-primary-950/40 dark:text-primary-300">
          <Shield className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
          <span className="font-bold">NileLink Staff</span>
        </div>
      </div>
    </header>
  )
}
