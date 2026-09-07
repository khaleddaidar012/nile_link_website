"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export function QuoteStatusBadge({ status }: { status: string }) {
  const t = useTranslations()
  
  let styles = "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
  
  if (status === "draft") {
    styles = "bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-800 dark:text-secondary-400"
  } else if (status === "sent" || status === "pending" || status === "viewed") {
    styles = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50"
  } else if (status === "accepted") {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50"
  } else if (status === "rejected") {
    styles = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50"
  } else if (status === "expired") {
    styles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50"
  }

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide", styles)}>
      {t(`portal.quotes.status.${status}`) || status}
    </span>
  )
}
