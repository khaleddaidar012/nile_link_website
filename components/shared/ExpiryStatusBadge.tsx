"use client"

import { useTranslations, useLocale } from "next-intl"
import { ShieldCheck, Clock, AlertTriangle, AlertOctagon, XCircle, Send, Ban } from "lucide-react"
import { calculateExpiry } from "@/lib/utils/expiry-calculator"
import { cn } from "@/lib/utils"

interface ExpiryStatusBadgeProps {
  status: "pending_review" | "approved" | "expiring_soon" | "expired" | "rejected"
  expiryDate?: Date | string | null
  className?: string
}

export function ExpiryStatusBadge({ status, expiryDate, className }: ExpiryStatusBadgeProps) {
  const t = useTranslations()
  const locale = useLocale()

  if (status === "pending_review") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400",
          className
        )}
      >
        <Send className="h-3 w-3" />
        <span>{t("documents.statuses.pending_review") || "قيد المراجعة"}</span>
      </span>
    )
  }

  if (status === "rejected") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400",
          className
        )}
      >
        <Ban className="h-3 w-3" />
        <span>{t("documents.statuses.rejected") || "مرفوض"}</span>
      </span>
    )
  }

  const expiry = calculateExpiry(expiryDate)

  if (!expiry) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400",
          className
        )}
      >
        <ShieldCheck className="h-3 w-3" />
        <span>{t("documents.statuses.approved") || "معتمد / ساري"}</span>
      </span>
    )
  }

  const getIcon = () => {
    switch (expiry.tier) {
      case "expired":
        return <XCircle className="h-3 w-3" />
      case "critical":
        return <AlertOctagon className="h-3 w-3" />
      case "urgent":
        return <AlertTriangle className="h-3 w-3" />
      case "warning":
        return <Clock className="h-3 w-3" />
      default:
        return <ShieldCheck className="h-3 w-3" />
    }
  }

  const getLocalizedLabel = () => {
    if (locale === "ar") {
      switch (expiry.tier) {
        case "expired":
          return `منتهي (منذ ${Math.abs(expiry.daysRemaining)} يوم)`
        case "critical":
          return expiry.daysRemaining === 0
            ? "ينتهي اليوم"
            : `حرج (متبقي ${expiry.daysRemaining} يوم)`
        case "urgent":
          return `عاجل (متبقي ${expiry.daysRemaining} أيام)`
        case "warning":
          return `تحذير (متبقي ${expiry.daysRemaining} يوم)`
        default:
          return `ساري (متبقي ${expiry.daysRemaining} يوم)`
      }
    }
    return expiry.label
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        expiry.colorClasses.badge,
        className
      )}
    >
      {getIcon()}
      <span>{getLocalizedLabel()}</span>
    </span>
  )
}
