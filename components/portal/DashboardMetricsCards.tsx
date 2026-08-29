"use client"

import { useTranslations } from "next-intl"
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  FolderLock,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react"
import { Link } from "@/navigation"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

export function DashboardMetricsCards() {
  const t = useTranslations()
  const { user, customer, documentStats } = usePortal()

  const isChannelsVerified = !!user?.emailVerified && !!user?.whatsappVerified

  const totalUploaded = documentStats?.totalDocs ?? 0
  const maxAllowed = documentStats?.maxAllowed ?? 20
  const approvedCount = documentStats?.approvedDocs ?? 0
  const pendingCount = documentStats?.pendingDocs ?? 0
  const expiringCount = documentStats?.expiringDocs ?? 0

  // Calculate ratios against total uploaded files (needs.md Requirement 10)
  const approvedPercentage = totalUploaded > 0 ? Math.round((approvedCount / totalUploaded) * 100) : 0
  const pendingPercentage = totalUploaded > 0 ? Math.round((pendingCount / totalUploaded) * 100) : 0
  const expiringPercentage = totalUploaded > 0 ? Math.round((expiringCount / totalUploaded) * 100) : 0

  const cards = [
    // 1. Communication Channels Status
    {
      title: t("portal.dashboard.kpi.channels") || "Communication Channels",
      value: isChannelsVerified
        ? (t("portal.verification.verified") || "Verified")
        : (t("portal.verification.unverified") || "Pending Verification"),
      subtitle: isChannelsVerified
        ? (t("portal.dashboard.kpi.channelsConnected") || "WhatsApp & Email Connected")
        : (t("portal.dashboard.kpi.channelsPending") || "Channels Verification Required"),
      badge: isChannelsVerified
        ? (t("portal.verification.verified") || "Verified")
        : (t("portal.dashboard.kpi.actionRequired") || "Action Needed"),
      icon: isChannelsVerified ? ShieldCheck : ShieldAlert,
      href: "/portal/verification",
      color: isChannelsVerified
        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        : "text-amber-500 bg-amber-500/10 border-amber-500/20 animate-pulse",
      badgeColor: isChannelsVerified
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    },

    // 2. Account Health & Activation
    {
      title: t("portal.dashboard.accountStatus") || "Account Status",
      value:
        customer?.accountStatus === "active"
          ? (t("portal.dashboard.kpi.activeCompliant") || "Active & Compliant")
          : customer?.accountStatus === "warning"
            ? (t("portal.dashboard.kpi.warningPending") || "Pending Documents")
            : (t("portal.dashboard.kpi.actionRequired") || "Action Required"),
      subtitle: customer?.statusReason || "Enterprise Legal Compliance",
      badge: customer?.accountStatus === "active" ? "Compliant" : "Review",
      icon: customer?.accountStatus === "active" ? CheckCircle2 : AlertCircle,
      href: "/portal/profile",
      color:
        customer?.accountStatus === "active"
          ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
          : customer?.accountStatus === "warning"
            ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
            : "text-rose-500 bg-rose-500/10 border-rose-500/20",
      badgeColor:
        customer?.accountStatus === "active"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    },

    // 3. Total Uploaded Documents (needs.md Requirement 10: Just integer count e.g. 10 or 5)
    {
      title: t("portal.dashboard.kpi.totalDocs") || "Total Uploaded Files",
      value: documentStats ? `${totalUploaded}` : "0",
      subtitle: `${maxAllowed - totalUploaded} ${t("portal.dashboard.kpi.slotsAvailable") || "slots available"} (${maxAllowed} max)`,
      badge: t("portal.dashboard.kpi.storage") || "Storage",
      icon: FolderLock,
      href: "/portal/documents",
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300",
    },

    // 4. Active & Approved Documents Ratio (needs.md Requirement 10: approved / total uploaded)
    {
      title: t("portal.dashboard.activeDocs") || "Approved Documents Ratio",
      value: `${approvedCount} / ${totalUploaded}`,
      subtitle: `${approvedPercentage}% ${t("portal.dashboard.kpi.ofTotalUploaded") || "of uploaded files approved"}`,
      badge: `${approvedPercentage}%`,
      icon: FileCheck2,
      href: "/portal/documents?status=approved",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    },

    // 5. Documents Pending Staff Review Ratio (needs.md Requirement 10: in-review / total uploaded)
    {
      title: t("portal.dashboard.pendingReview") || "In-Review Documents Ratio",
      value: `${pendingCount} / ${totalUploaded}`,
      subtitle: `${pendingPercentage}% ${t("portal.dashboard.kpi.ofTotalPending") || "awaiting staff review"}`,
      badge: `${pendingPercentage}%`,
      icon: Send,
      href: "/portal/documents?status=pending_review",
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
    },

    // 6. Documents Expiring Soon Ratio (needs.md Requirement 10: expiring / total uploaded)
    {
      title: t("portal.dashboard.expiringDocs") || "Expiring Soon Ratio (≤10d)",
      value: `${expiringCount} / ${totalUploaded}`,
      subtitle:
        expiringCount > 0
          ? `${expiringPercentage}% ${t("portal.dashboard.kpi.requiresRenewal") || "requires immediate renewal"}`
          : (t("portal.dashboard.kpi.allGood") || "All documents up to date"),
      badge: expiringCount > 0 ? `${expiringPercentage}%` : "0%",
      icon: Clock,
      href: "/portal/documents?status=expiring_soon",
      color:
        expiringCount > 0
          ? "text-amber-500 bg-amber-500/15 border-amber-500/30 font-bold"
          : "text-slate-400 bg-slate-500/10 border-slate-500/20",
      badgeColor:
        expiringCount > 0
          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, idx) => (
        <Link
          key={idx}
          href={card.href}
          className="group relative overflow-hidden rounded-2xl border border-secondary-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-premium-md dark:border-secondary-800/80 dark:bg-secondary-900/90"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500 uppercase tracking-wider dark:text-secondary-400">
              {card.title}
            </span>
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border transition-transform group-hover:scale-110",
                card.color
              )}
            >
              <card.icon className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <h2 className="text-xl font-black tracking-tight text-secondary-900 dark:text-white">
              {card.value}
            </h2>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                card.badgeColor
              )}
            >
              {card.badge}
            </span>
          </div>

          <p className="mt-1 text-xs text-secondary-500 line-clamp-1 dark:text-secondary-400">
            {card.subtitle}
          </p>
        </Link>
      ))}
    </div>
  )
}
