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
  Lock,
  ShieldAlert,
} from "lucide-react"
import Image from "next/image"
import logoImg from "@/public/images/logo.png"
import { Link, usePathname } from "@/navigation"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

export function PortalSidebar() {
  const t = useTranslations()
  const pathname = usePathname()
  const { user, customer, documentStats, unreadCount, logout } = usePortal()
  const [collapsed, setCollapsed] = useState(false)
  const isUnverified = Boolean(user && !user.emailVerified)

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
        <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          <span>{t("documents.statuses.approved") || "Active"}</span>
        </span>
      )
    }
    if (customer.accountStatus === "warning") {
      return (
        <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 animate-pulse">
          <AlertTriangle className="h-3 w-3" />
          <span>{t("documents.statuses.expiring_soon") || "Action"}</span>
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
        <XCircle className="h-3 w-3" />
        <span>{t("documents.statuses.expired") || "Restricted"}</span>
      </span>
    )
  }

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-r rtl:border-r-0 rtl:border-l border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 dark:border-slate-800/80 dark:bg-[#0d1322]/95 backdrop-blur-xl dark:text-white md:flex z-30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
        {!collapsed && (
          <Link href="/portal" className="flex items-center gap-2.5">
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
                {t("nav.clientPortal") || "Client Portal"}
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="relative mx-auto h-[32px] w-[32px]">
            <Image
              src={logoImg}
              alt="NileLink"
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
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
        <div className="mx-3 mt-4 rounded-xl border border-slate-200/90 bg-slate-50/90 p-3.5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
              {customer.companyName}
            </span>
            {getStatusBadge()}
          </div>
          {documentStats && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>
                {t("documents.registeredCount", {
                  count: documentStats.totalDocs,
                  max: documentStats.maxAllowed,
                }) || `${documentStats.totalDocs} / ${documentStats.maxAllowed} documents`}
              </span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
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

      {/* Verification Warning Pill if unverified */}
      {!collapsed && isUnverified && (
        <div className="mx-3 mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-400">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{t("portal.verification.title") || "تفعيل الحساب مطلوب"}</span>
          </div>
          <p className="mt-1 text-[11px] leading-tight text-slate-600 dark:text-slate-300">
            {t("portal.healthBanners.unverifiedDesc") || "يرجى إكمال توثيق البريد لتفعيل باقي تابات المنصة."}
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {/* If unverified, display prominent Verification Nav Item */}
        {isUnverified && (
          <Link
            href="/portal/verification"
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all mb-2",
              pathname === "/portal/verification"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/25 font-bold"
                : "border border-rose-500/30 bg-rose-50/70 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300"
            )}
          >
            <ShieldAlert className="h-5 w-5 shrink-0 animate-pulse text-rose-500 dark:text-rose-400" />
            {!collapsed && (
              <span className="flex-1 truncate font-bold">
                {t("portal.verification.title") || "Security Verification"}
              </span>
            )}
            {!collapsed && (
              <span className="ml-auto rtl:ml-0 rtl:mr-auto rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                {t("common.required") || "Required"}
              </span>
            )}
          </Link>
        )}

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/portal")

          if (isUnverified) {
            return (
              <div
                key={item.href}
                className="group relative flex cursor-not-allowed items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 opacity-50 dark:text-slate-500 select-none"
                title={t("portal.healthBanners.unverifiedTitle") || "Locked until email verified"}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && (
                  <Lock className="ml-auto rtl:ml-0 rtl:mr-auto h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/25 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white"
                )}
              />
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "ml-auto rtl:ml-0 rtl:mr-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm",
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
      <div className="border-t border-slate-100 p-3 dark:border-slate-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
        >
          <LogOut className="h-5 w-5 shrink-0 rtl:rotate-180" />
          {!collapsed && <span>{t("portal.sidebar.logout") || "Sign Out"}</span>}
        </button>
      </div>
    </aside>
  )
}
