"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarDays, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalyticsPeriod } from "@/lib/analytics"

interface DateFilterProps {
  period: AnalyticsPeriod
  onPeriodChange: (period: AnalyticsPeriod) => void
  onCustomRange?: (start: string, end: string) => void
}

const periods: { value: AnalyticsPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
  { value: "last90", label: "Last 90 Days" },
  { value: "lastYear", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
]

export function DateFilter({ period, onPeriodChange, onCustomRange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const currentLabel = periods.find((p) => p.value === period)?.label || "Select Period"

  function handleSelect(value: AnalyticsPeriod) {
    onPeriodChange(value)
    setIsOpen(false)
    if (value === "custom") {
      setShowCustom(true)
    } else {
      setShowCustom(false)
    }
  }

  function handleApplyCustom() {
    if (startDate && endDate && onCustomRange) {
      onCustomRange(startDate, endDate)
    }
    setShowCustom(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors",
          "text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700"
        )}
      >
        <CalendarDays className="h-4 w-4 text-secondary-400" />
        <span>{currentLabel}</span>
        <ChevronDown className={cn("h-4 w-4 text-secondary-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => handleSelect(p.value)}
              className={cn(
                "flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors",
                period === p.value
                  ? "bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/20 dark:text-primary-400"
                  : "text-secondary-600 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-700"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {showCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-secondary-200 bg-white p-6 shadow-premium-xl dark:border-secondary-700 dark:bg-secondary-800">
            <h3 className="mb-4 text-sm font-bold text-secondary-900 dark:text-white">Custom Date Range</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary-500">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2 text-sm text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-900 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary-500">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2 text-sm text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-900 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowCustom(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-700"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                disabled={!startDate || !endDate}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
