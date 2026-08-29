"use client"

import { useTranslations, useLocale } from "next-intl"
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Bell,
  LogOut,
  Shield,
  Activity,
  Ship,
  FileCheck2,
  Receipt,
  Warehouse,
  Truck,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import logoImg from "@/public/images/logo.png"
import { Link, usePathname, useRouter } from "@/navigation"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const isAr = locale === "ar"

  const coreNavItems = [
    {
      href: "/admin",
      label: t("admin.sidebar.dashboard") || "Analytics & Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/documents/review",
      label: t("admin.sidebar.reviewQueue") || "Document Review Queue",
      icon: FileCheck,
    },
    {
      href: "/admin/customers",
      label: t("admin.sidebar.customers") || "Customer Accounts",
      icon: Users,
    },
    {
      href: "/admin/notifications",
      label: t("admin.sidebar.notifications") || "Notification Center",
      icon: Bell,
    },
    {
      href: "/admin/staff",
      label: t("admin.sidebar.staff") || "Staff & Permissions",
      icon: Users,
    },
    {
      href: "/admin/settings",
      label: t("admin.sidebar.settings") || "System Settings",
      icon: Activity,
    },
  ]

  const upcomingLogisticsModules = [
    {
      href: "/admin/coming-soon/shipments",
      label: isAr ? "الشحنات وتتبع الحاويات" : "Shipment & B/L Tracking",
      icon: Ship,
    },
    {
      href: "/admin/coming-soon/customs",
      label: isAr ? "الإقرارات الجمركية و ACID" : "Customs & ACID Nafeza",
      icon: FileCheck2,
    },
    {
      href: "/admin/coming-soon/financials",
      label: isAr ? "الأرضيات والغرامات والفوترة" : "Demurrage & Financials",
      icon: Receipt,
    },
    {
      href: "/admin/coming-soon/warehouses",
      label: isAr ? "المستودعات والساحات" : "Bonded Warehouses",
      icon: Warehouse,
    },
    {
      href: "/admin/coming-soon/fleet",
      label: isAr ? "أسطول النقل البري (GPS)" : "Fleet & Truck Dispatch",
      icon: Truck,
    },
    {
      href: "/admin/coming-soon/quotes",
      label: isAr ? "عروض الأسعار والعملاء" : "CRM & Rate Engine",
      icon: FileSpreadsheet,
    },
  ]

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-secondary-200 bg-white text-secondary-900 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-white md:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 border-b border-secondary-100 px-6 dark:border-slate-800">
        <div className="relative h-[32px] w-[32px] shrink-0">
          <Image
            src={logoImg}
            alt="NileLink"
            fill
            sizes="32px"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center leading-none">
          <span className="text-sm font-bold tracking-wide text-secondary-900 dark:text-white">NileLink</span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Staff Operations
          </span>
        </div>
      </div>

      {/* Navigation Body */}
      <nav className="flex-1 space-y-6 px-3 py-4 overflow-y-auto">
        {/* Core Group */}
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-secondary-400 dark:text-slate-500">
            {isAr ? "العمليات الأساسية" : "Core Operations"}
          </span>
          <div className="mt-1.5 space-y-1">
            {coreNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href) && item.href !== "/admin")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0 rtl:scale-x-[-1]" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Logistics Industry Roadmap Group ("Coming Soon" / "قريباً") */}
        <div>
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-400 dark:text-slate-500">
              {isAr ? "منظومة الشحن المتكاملة" : "Enterprise Logistics"}
            </span>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-1.5 py-0.2 text-[9px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              {isAr ? "قريباً" : "Soon"}
            </span>
          </div>

          <div className="mt-1.5 space-y-1">
            {upcomingLogisticsModules.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <item.icon className="h-4 w-4 shrink-0 text-secondary-400 group-hover:text-purple-600 dark:text-slate-500 dark:group-hover:text-purple-400 transition-colors" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="shrink-0 rounded bg-secondary-100 px-1.5 py-0.5 text-[9px] font-bold text-secondary-600 group-hover:bg-purple-100 group-hover:text-purple-700 dark:bg-secondary-800 dark:text-secondary-400 dark:group-hover:bg-purple-950 dark:group-hover:text-purple-300">
                    {isAr ? "قريباً" : "Soon"}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Logout */}
      <div className="border-t border-secondary-100 p-3 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4 rtl:rotate-180" />
          <span>{t("common.logout") || "Sign Out"}</span>
        </button>
      </div>
    </aside>
  )
}
