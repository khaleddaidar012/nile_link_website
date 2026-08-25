"use client"

import { useTranslations } from "next-intl"
import { ShieldCheck, FileText, Clock, AlertOctagon, Send, ArrowUpRight } from "lucide-react"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

export function DashboardMetricsCards() {
  const t = useTranslations()
  const { customer, documentStats } = usePortal()

  const cards = [
    {
      title: t("portal.dashboard.accountStatus") || "Account Health",
      value:
        customer?.accountStatus === "active"
          ? "Active & Compliant"
          : customer?.accountStatus === "warning"
            ? "Renewal Pending"
            : "Action Required",
      subtitle: customer?.statusReason || "All legal files monitored",
      icon: ShieldCheck,
      color:
        customer?.accountStatus === "active"
          ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
          : customer?.accountStatus === "warning"
            ? "text-amber-500 bg-amber-500/10 border-amber-500/20 animate-pulse"
            : "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: t("portal.dashboard.activeDocs") || "Active Documents",
      value: documentStats ? `${documentStats.approvedDocs} Approved` : "—",
      subtitle: documentStats
        ? `${documentStats.totalDocs} of ${documentStats.maxAllowed} slots used`
        : "Loading registry...",
      icon: FileText,
      color: "text-primary-500 bg-primary-500/10 border-primary-500/20",
    },
    {
      title: t("portal.dashboard.expiringDocs") || "Expiring (≤10d)",
      value: documentStats ? `${documentStats.expiringDocs} Documents` : "0",
      subtitle:
        documentStats && documentStats.expiringDocs > 0
          ? "Urgent renewal recommended"
          : "No immediate expirations",
      icon: Clock,
      color:
        documentStats && documentStats.expiringDocs > 0
          ? "text-amber-500 bg-amber-500/15 border-amber-500/30 font-bold"
          : "text-slate-400 bg-slate-500/10 border-slate-500/20",
    },
    {
      title: t("portal.dashboard.pendingReview") || "Pending Staff Review",
      value: documentStats ? `${documentStats.pendingDocs} Documents` : "0",
      subtitle: "Awaiting NileLink verification",
      icon: Send,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-premium-md dark:border-secondary-800 dark:bg-secondary-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500 uppercase tracking-wider dark:text-secondary-400">
              {card.title}
            </span>
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border transition-transform group-hover:scale-110", card.color)}>
              <card.icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold tracking-tight text-secondary-900 dark:text-white">
              {card.value}
            </h2>
            <p className="mt-1 text-xs text-secondary-500 line-clamp-1 dark:text-secondary-400">
              {card.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
