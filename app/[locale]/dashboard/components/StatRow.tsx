"use client"

import { cn } from "@/lib/utils"

interface StatRowProps {
  label: string
  value: string | number
  percentage?: number
  className?: string
  flag?: string
}

export function StatRow({ label, value, percentage, className, flag }: StatRowProps) {
  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      <div className="flex items-center gap-2">
        {flag && <span className="text-base leading-none">{flag}</span>}
        <span className="text-sm text-secondary-600 dark:text-secondary-400">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-secondary-900 dark:text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {percentage !== undefined && (
          <div className="w-16 text-right">
            <span className="text-xs text-secondary-400">{percentage}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

interface StatRowListProps {
  children: React.ReactNode
  title?: string
}

export function StatRowList({ children, title }: StatRowListProps) {
  return (
    <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800">
      {title && (
        <h3 className="mb-3 text-sm font-bold text-secondary-900 dark:text-white">{title}</h3>
      )}
      <div className="divide-y divide-secondary-100 dark:divide-secondary-700">
        {children}
      </div>
    </div>
  )
}
