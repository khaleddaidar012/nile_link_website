"use client"

import { useTranslations } from "next-intl"
import { FileText, DollarSign, Wallet, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

interface FinancialsSummaryCardsProps {
  data: {
    totalInvoicesValue: number
    totalPaid: number
    totalRemaining: number
  }
  count: number
  loading: boolean
}

export function FinancialsSummaryCards({ data, count, loading }: FinancialsSummaryCardsProps) {
  const t = useTranslations()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(value || 0)
  }

  const cards = [
    {
      title: t("portal.financials.metrics.totalValue") || "Total Invoices Value",
      value: formatCurrency(data.totalInvoicesValue),
      subtitle: `${count} ${t("portal.financials.metrics.invoices") || "invoices"}`,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/40",
      border: "border-blue-200/50 dark:border-blue-800/30"
    },
    {
      title: t("portal.financials.metrics.totalPaid") || "Total Paid",
      value: formatCurrency(data.totalPaid),
      subtitle: t("portal.financials.metrics.received") || "Payments received",
      icon: Wallet,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/40",
      border: "border-emerald-200/50 dark:border-emerald-800/30"
    },
    {
      title: t("portal.financials.metrics.totalRemaining") || "Total Remaining",
      value: formatCurrency(data.totalRemaining),
      subtitle: t("portal.financials.metrics.outstanding") || "Outstanding balance",
      icon: CreditCard,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-100 dark:bg-rose-900/40",
      border: "border-rose-200/50 dark:border-rose-800/30"
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-secondary-900",
            card.border
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                {card.title}
              </p>
              {loading ? (
                <div className="h-8 w-32 animate-pulse rounded bg-secondary-200 dark:bg-secondary-700 mb-1" />
              ) : (
                <p className="text-2xl font-black text-secondary-900 dark:text-white sm:text-3xl mb-1 tracking-tight">
                  {card.value}
                </p>
              )}
              <p className="text-sm font-medium text-secondary-500 dark:text-secondary-500">
                {card.subtitle}
              </p>
            </div>
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", card.bg, card.color)}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
