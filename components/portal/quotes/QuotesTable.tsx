"use client"

import { useTranslations } from "next-intl"
import { QuoteStatusBadge } from "./QuoteStatusBadge"
import { ChevronRight, FileText, Calendar, Inbox } from "lucide-react"
import { format } from "date-fns"

interface QuotesTableProps {
  quotes: any[]
  loading: boolean
  onViewDetails: (quote: any) => void
}

export function QuotesTable({ quotes, loading, onViewDetails }: QuotesTableProps) {
  const t = useTranslations()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
        <p className="mt-4 text-sm font-medium text-secondary-500">{t("portal.quotes.loading") || "Loading quotes..."}</p>
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-100/50 text-secondary-400 dark:bg-secondary-800/50 dark:text-secondary-500">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
          {t("portal.quotes.empty.title") || "No Quotes Found"}
        </h3>
        <p className="mt-1 text-sm text-secondary-500 max-w-sm">
          {t("portal.quotes.empty.description") || "You don't have any shipping quotes matching your criteria at the moment."}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm rtl:text-right">
        <thead className="border-b border-secondary-200/80 bg-secondary-50/75 text-[11px] font-bold uppercase tracking-wider text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-400">
          <tr>
            <th className="px-5 py-4">{t("portal.quotes.table.quoteNumber") || "Quote #"}</th>
            <th className="px-4 py-4">{t("portal.quotes.table.requestNumber") || "Request #"}</th>
            <th className="px-4 py-4">{t("portal.quotes.table.totalAmount") || "Amount"}</th>
            <th className="px-4 py-4">{t("portal.quotes.table.date") || "Created Date"}</th>
            <th className="px-4 py-4">{t("portal.quotes.table.validUntil") || "Valid Until"}</th>
            <th className="px-4 py-4">{t("portal.quotes.table.status") || "Status"}</th>
            <th className="px-5 py-4 text-right rtl:text-left">{t("portal.quotes.table.actions") || "Actions"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800/60">
          {quotes.map((quote) => (
            <tr 
              key={quote._id} 
              className="group cursor-pointer transition-colors hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40"
              onClick={() => onViewDetails(quote)}
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-secondary-400" />
                  <span className="font-mono font-bold text-primary-600 dark:text-primary-400">
                    {quote.quoteNumber}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 font-mono text-xs text-secondary-500">
                {quote.requestNumber || "-"}
              </td>
              <td className="px-4 py-4">
                <span className="font-bold text-secondary-900 dark:text-white">
                  ${(quote.totalAmount || 0).toLocaleString()}
                </span>
                <span className="ml-1 text-xs text-secondary-500">{quote.currency || "USD"}</span>
              </td>
              <td className="px-4 py-4 text-secondary-600 dark:text-secondary-400">
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  {quote.createdAt ? format(new Date(quote.createdAt), "MMM d, yyyy") : "-"}
                </div>
              </td>
              <td className="px-4 py-4 text-secondary-600 dark:text-secondary-400">
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  {quote.validUntil ? format(new Date(quote.validUntil), "MMM d, yyyy") : "-"}
                </div>
              </td>
              <td className="px-4 py-4">
                <QuoteStatusBadge status={quote.status} />
              </td>
              <td className="px-5 py-4 text-right rtl:text-left">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetails(quote)
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-secondary-200 bg-white px-3 py-1.5 text-xs font-semibold text-secondary-700 shadow-sm transition-all hover:bg-secondary-100 hover:text-secondary-900 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-white"
                >
                  <span>{t("portal.quotes.table.view") || "View"}</span>
                  <ChevronRight className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
