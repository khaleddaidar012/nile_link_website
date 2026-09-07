"use client"

import { useTranslations } from "next-intl"
import { FileText, Send, CheckCircle2, XCircle, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuoteSummaryCardsProps {
  data: {
    total: number
    sent: number
    accepted: number
    rejected: number
    pending: number
    totalValue: number
  }
  loading: boolean
}

export function QuoteSummaryCards({ data, loading }: QuoteSummaryCardsProps) {
  const t = useTranslations()

  const cards = [
    {
      title: t("portal.quotes.metrics.total") || "Total Quotes",
      value: data.total,
      icon: FileText,
      color: "text-secondary-600 dark:text-secondary-400",
      bg: "bg-secondary-100 dark:bg-secondary-800",
    },
    {
      title: t("portal.quotes.metrics.pending") || "Pending",
      value: data.pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/40",
    },
    {
      title: t("portal.quotes.metrics.accepted") || "Accepted",
      value: data.accepted,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/40",
    },
    {
      title: t("portal.quotes.metrics.totalValue") || "Total Value",
      value: `$${data.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/40",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="relative overflow-hidden rounded-2xl border border-secondary-200/80 bg-white p-4 sm:p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12", card.bg, card.color)}>
              <card.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-1">
                {card.title}
              </p>
              {loading ? (
                <div className="h-7 w-16 animate-pulse rounded bg-secondary-200 dark:bg-secondary-700" />
              ) : (
                <p className="text-xl font-bold text-secondary-900 dark:text-white sm:text-2xl">
                  {card.value}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
