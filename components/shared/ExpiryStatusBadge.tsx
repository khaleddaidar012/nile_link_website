"use client"

import { useTranslations } from "next-intl"
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

  if (status === "pending_review") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400",
          className
        )}
      >
        <Send className="h-3 w-3" />
        <span>{t("documents.statuses.pending_review") || "Pending Review"}</span>
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
        <span>{t("documents.statuses.rejected") || "Rejected"}</span>
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
        <span>{t("documents.statuses.approved") || "Approved"}</span>
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

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
        expiry.colorClasses.badge,
        className
      )}
    >
      {getIcon()}
      <span>{expiry.label}</span>
    </span>
  )
}
