"use client"

import { motion } from "framer-motion"
import { RecentQuote } from "@/lib/analytics"

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  contacted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
}

interface RecentQuotesTableProps {
  quotes: RecentQuote[]
}

export function RecentQuotesTable({ quotes }: RecentQuotesTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800"
    >
      <h3 className="mb-4 text-sm font-bold text-secondary-900 dark:text-white">Recent Quote Requests</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-secondary-200 text-xs uppercase tracking-wider text-secondary-500 dark:border-secondary-700">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Company</th>
              <th className="pb-3 pr-4 font-medium">Country</th>
              <th className="pb-3 pr-4 font-medium">Email</th>
              <th className="pb-3 pr-4 font-medium">Service</th>
              <th className="pb-3 pr-4 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id} className="border-b border-secondary-100 last:border-0 dark:border-secondary-700">
                <td className="py-3 pr-4 font-medium text-secondary-900 dark:text-white">{quote.name}</td>
                <td className="py-3 pr-4 text-secondary-500">{quote.company}</td>
                <td className="py-3 pr-4 text-secondary-500">{quote.country}</td>
                <td className="py-3 pr-4 text-secondary-500">{quote.email}</td>
                <td className="py-3 pr-4 text-secondary-500">{quote.service}</td>
                <td className="py-3 pr-4 text-secondary-500">{quote.date}</td>
                <td className="py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${statusStyles[quote.status]}`}>
                    {quote.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
