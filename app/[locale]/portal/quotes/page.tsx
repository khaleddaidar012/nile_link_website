"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { FileCheck, Clock, CheckCircle2, XCircle, ChevronRight, Loader2 } from "lucide-react"
import { Link } from "@/navigation"
import { toast } from "sonner"

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  sent:     { icon: Clock,          color: "text-blue-700 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
  accepted: { icon: CheckCircle2,   color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" },
  rejected: { icon: XCircle,        color: "text-red-700 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
  expired:  { icon: Clock,          color: "text-gray-500",                       bg: "bg-gray-50 dark:bg-secondary-800/50 border-gray-200 dark:border-secondary-700" },
}

export default function PortalQuotesListPage() {
  const t = useTranslations()
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/portal/quotes")
      const data = await res.json()
      if (data.success) {
        setQuotes(data.quotes)
      } else {
        toast.error(t("portal_quotes.list.fetchError") || "Failed to load quotes")
      }
    } catch {
      toast.error(t("portal_quotes.list.fetchError") || "Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col pb-20">
      <PortalHeader
        title={t("portal_quotes.list.title") || "Quotes & Pricing Offers"}
        subtitle={t("portal_quotes.list.subtitle") || "View and respond to pricing quotes from NileLink."}
      />

      <div className="p-6 sm:p-8 max-w-5xl space-y-4">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : quotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileCheck className="h-16 w-16 text-secondary-300 dark:text-secondary-600 mb-4" />
            <h3 className="text-lg font-bold text-secondary-700 dark:text-secondary-300">
              {t("portal_quotes.list.empty") || "No quotes yet"}
            </h3>
            <p className="text-sm text-secondary-500 mt-2 max-w-xs">
              {t("portal_quotes.list.emptyDesc") || "Quotes will appear here once our team reviews your service requests."}
            </p>
            <Link
              href="/portal/requests"
              className="mt-6 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-700 transition-colors"
            >
              {t("portal_quotes.list.goToRequests") || "View My Requests"}
            </Link>
          </div>
        ) : (
          quotes.map((quote) => {
            const cfg = statusConfig[quote.status] || statusConfig.expired
            const StatusIcon = cfg.icon
            const isActionable = quote.status === "sent"

            return (
              <Link
                key={quote._id}
                href={`/portal/quotes/${quote._id}`}
                className={`group flex items-center justify-between rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${cfg.bg}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 rounded-xl p-2 ${isActionable ? "bg-blue-100 dark:bg-blue-900/30" : "bg-secondary-100 dark:bg-secondary-800"}`}>
                    <StatusIcon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-secondary-900 dark:text-white text-sm">
                        {quote.quoteNumber}
                      </h3>
                      {isActionable && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-pulse">
                          {t("portal_quotes.list.actionRequired") || "ACTION REQUIRED"}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-primary-600 mt-1">
                      {quote.totalAmount?.toLocaleString()} <span className="text-base font-semibold text-secondary-500">{quote.currency}</span>
                    </p>
                    <p suppressHydrationWarning className="text-xs text-secondary-500 mt-1">
                      {t("portal_quotes.list.validUntil") || "Valid until"}: {new Date(quote.validUntil).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${cfg.color} border ${cfg.bg}`}>
                    {t(`portal_quotes.status.${quote.status}`) || quote.status}
                  </span>
                  <ChevronRight className="h-5 w-5 text-secondary-400 group-hover:text-primary-600 transition-colors rtl:rotate-180" />
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
