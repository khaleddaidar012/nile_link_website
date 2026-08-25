"use client"

import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Bell,
  LogOut,
  Shield,
  Activity,
} from "lucide-react"
import { Link, usePathname, useRouter } from "@/navigation"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
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
  ]

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-white md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 font-bold text-white shadow">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-wide text-white">NileLink</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-400">
            Staff Operations
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/admin")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300"
        >
          <LogOut className="h-5 w-5 rtl:rotate-180" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
