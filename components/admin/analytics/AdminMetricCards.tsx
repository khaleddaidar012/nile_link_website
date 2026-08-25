"use client"

import { useTranslations } from "next-intl"
import { Users, FileCheck, Clock, AlertOctagon, ArrowUpRight, TrendingUp } from "lucide-react"

interface AdminMetricsProps {
  metrics: {
    totalCustomers: number
    activeCustomers: number
    warningCustomers: number
    inactiveCustomers: number
    pendingReviewDocs: number
    expiringSoonDocs: number
    expiredDocs: number
    totalNotificationsSent: number
  }
}

export function AdminMetricCards({ metrics }: AdminMetricsProps) {
  const t = useTranslations()

  const cards = [
    {
      title: t("admin.dashboard.totalClients") || "Total Clients",
      value: metrics.totalCustomers,
      subtitle: `${metrics.activeCustomers} active • ${metrics.warningCustomers + metrics.inactiveCustomers} action needed`,
      icon: Users,
      color: "text-blue-400 bg-blue-950/50 border-blue-800/40",
      glow: "hover:border-blue-700/60",
    },
    {
      title: t("admin.dashboard.pendingReview") || "Review Queue",
      value: metrics.pendingReviewDocs,
      subtitle: "Awaiting NileLink inspector review",
      icon: FileCheck,
      color: "text-indigo-400 bg-indigo-950/50 border-indigo-800/40",
      glow: "hover:border-indigo-700/60",
    },
    {
      title: t("admin.dashboard.expiringSoon") || "Expiring (≤10 Days)",
      value: metrics.expiringSoonDocs,
      subtitle: "Urgent renewal notices active",
      icon: Clock,
      color: "text-amber-400 bg-amber-950/50 border-amber-800/40",
      glow: "hover:border-amber-700/60",
    },
    {
      title: t("admin.dashboard.expiredTotal") || "Expired Documents",
      value: metrics.expiredDocs,
      subtitle: "Compliance restrictions active",
      icon: AlertOctagon,
      color: "text-rose-400 bg-rose-950/50 border-rose-800/40",
      glow: "hover:border-rose-700/60",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 ${c.glow}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {c.title}
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-transform group-hover:scale-110 ${c.color}`}>
              <c.icon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">{c.value}</h2>
            <p className="mt-1 text-xs text-slate-400 line-clamp-1">{c.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
