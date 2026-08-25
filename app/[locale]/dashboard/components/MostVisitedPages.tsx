"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type { MostVisitedPage } from "@/lib/analytics"

interface MostVisitedPagesProps {
  pages: MostVisitedPage[]
}

export function MostVisitedPages({ pages }: MostVisitedPagesProps) {
  const maxVisitors = Math.max(...pages.map((p) => p.visitors))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800"
    >
      <h3 className="mb-4 text-sm font-bold text-secondary-900 dark:text-white">Most Visited Pages</h3>
      <div className="space-y-3">
        {pages.map((page, index) => (
          <div key={page.path}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-secondary-400 w-5 shrink-0">{index + 1}</span>
                <ExternalLink className="h-3 w-3 shrink-0 text-secondary-400" />
                <span className="truncate text-sm text-secondary-700 dark:text-secondary-300">{page.title}</span>
                <span className="hidden sm:inline truncate text-xs text-secondary-400 font-mono">{page.path}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-sm font-medium text-secondary-900 dark:text-white">
                  {page.visitors.toLocaleString()}
                </span>
                <span className="text-xs text-secondary-400 w-10 text-right">{page.percentage}%</span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary-100 dark:bg-secondary-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(page.visitors / maxVisitors) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.05, ease: "easeOut" }}
                className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
