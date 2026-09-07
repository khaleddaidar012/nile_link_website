"use client"

import { useTranslations } from "next-intl"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

interface FinancialsToolbarProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
}

export function FinancialsToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: FinancialsToolbarProps) {
  const t = useTranslations()

  return (
    <div className="flex flex-col gap-4 border-b border-secondary-200/80 bg-secondary-50/50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-secondary-800 dark:bg-secondary-900/50">
      
      <div className="relative w-full sm:max-w-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 rtl:left-auto rtl:right-0 rtl:pr-3">
          <Search className="h-4 w-4 text-secondary-400" />
        </div>
        <input
          type="text"
          placeholder={t("portal.financials.searchPlaceholder") || "Search invoice #..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-secondary-200 bg-white py-2 pl-9 pr-4 text-sm font-medium outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rtl:pl-4 rtl:pr-9 dark:border-secondary-700 dark:bg-secondary-950 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Filter className="absolute left-3 h-4 w-4 text-secondary-400 rtl:left-auto rtl:right-3" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-xl border border-secondary-200 bg-white py-2 pl-9 pr-8 text-sm font-bold text-secondary-700 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rtl:pl-8 rtl:pr-9 dark:border-secondary-700 dark:bg-secondary-950 dark:text-secondary-300"
          >
            <option value="all">{t("portal.financials.filters.all") || "All Statuses"}</option>
            <option value="sent">{t("portal.financials.status.sent") || "Sent"}</option>
            <option value="partially_paid">{t("portal.financials.status.partially_paid") || "Partially Paid"}</option>
            <option value="paid">{t("portal.financials.status.paid") || "Paid"}</option>
            <option value="overdue">{t("portal.financials.status.overdue") || "Overdue"}</option>
          </select>
        </div>
        
        <button className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-secondary-200 bg-white text-secondary-500 transition-colors hover:bg-secondary-100 hover:text-secondary-900 dark:border-secondary-700 dark:bg-secondary-950 dark:hover:bg-secondary-800 dark:hover:text-white">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

    </div>
  )
}
