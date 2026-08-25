"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  LayoutDashboard,
  FileText,
  Send,
  CreditCard,
  Bell,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Ship,
} from "lucide-react"
import { Link, usePathname } from "@/navigation"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

export function PortalSidebar() {
  const t = useTranslations()
  const pathname = usePathname()
  const { customer, documentStats, unreadCount, logout } = usePortal()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    {
      href: "/portal",
      label: t("portal.sidebar.dashboard") || "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: "/portal/documents",
      label: t("portal.sidebar.documents") || "Documents & Legal",
      icon: FileText,
      badge:
        documentStats && documentStats.expiringDocs > 0
          ? `${documentStats.expiringDocs}`
          : null,
      badgeColor: "bg-amber-500",
    },
    {
      href: "/portal/requests",
      label: t("portal.sidebar.requests") || "Service Requests",
      icon: Send,
      badge: null,
    },
    {
      href: "/portal/financials",
      label: t("portal.sidebar.financials") || "Financials & Invoices",
      icon: CreditCard,
      badge: null,
    },
    {
      href: "/portal/notifications",
      label: t("portal.sidebar.notifications") || "Notifications",
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      badgeColor: "bg-primary-500",
    },
    {
      href: "/portal/profile",
      label: t("portal.sidebar.profile") || "Company Profile",
      icon: Building2,
      badge: null,
    },
  ]

  const getStatusBadge = () => {
    if (!customer) return null
    if (customer.accountStatus === "active") {
      return (
        <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          <span>Active</span>
        </span>
      )
    }
    if (customer.accountStatus === "warning") {
      return (
        <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 animate-pulse">
          <AlertTriangle className="h-3 w-3" />
          <span>Action</span>
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400">
        <XCircle className="h-3 w-3" />
        <span>Restricted</span>
      </span>
    )
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-r border-slate-800 bg-slate-950 text-slate-100 shadow-2xl transition-all duration-300 md:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        {!collapsed && (
          <Link href="/portal" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-700 to-primary-500 text-sm font-bold text-white shadow-md shadow-primary-500/20">
              <Ship className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide text-white">NileLink</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-400">
                Client Portal
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow">
            <Ship className="h-5 w-5" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={t("portal.sidebar.collapse") || "Collapse Sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          ) : (
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          )}
        </button>
      </div>

      {/* Company Status Pill */}
      {!collapsed && customer && (
        <div className="mx-3 mt-4 rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-bold text-white">
              {customer.companyName}
            </span>
            {getStatusBadge()}
          </div>
          {documentStats && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>{documentStats.totalDocs} / {documentStats.maxAllowed} documents</span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-primary-500"
                  style={{
                    width: `${Math.min(100, (documentStats.totalDocs / documentStats.maxAllowed) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/portal")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                )}
              />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm",
                    item.badgeColor || "bg-primary-500"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out Action */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-950/40 hover:text-rose-300"
        >
          <LogOut className="h-5 w-5 shrink-0 rtl:rotate-180" />
          {!collapsed && <span>{t("portal.sidebar.logout") || "Sign Out"}</span>}
        </button>
      </div>
    </aside>
  )
}
