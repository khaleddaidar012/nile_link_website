"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  className?: string
  iconColor?: string
}

export function MetricCard({ title, value, description, icon: Icon, trend, trendLabel, className, iconColor }: MetricCardProps) {
  const isPositive = trend !== undefined && trend >= 0
  const isNeutral = trend === undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-secondary-900 dark:text-white truncate">
            {typeof value === "number" ? (
              <AnimatedCounter value={value} />
            ) : (
              value
            )}
          </p>
          {description && (
            <p className="mt-0.5 text-xs text-secondary-400 dark:text-secondary-500 truncate">
              {description}
            </p>
          )}
          {!isNeutral && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {isPositive ? "+" : ""}{trend}%
                </span>
              </div>
              {trendLabel && (
                <span className="text-[11px] text-secondary-400 dark:text-secondary-500">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          iconColor || "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}
