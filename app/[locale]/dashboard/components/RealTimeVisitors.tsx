"use client"

import { motion } from "framer-motion"
import { Users, Activity, TrendingUp, Clock } from "lucide-react"

interface RealTimeVisitorsProps {
  current: number
}

export function RealTimeVisitors({ current }: RealTimeVisitorsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-secondary-200 bg-gradient-to-br from-secondary-900 to-secondary-800 p-6 shadow-sm dark:from-secondary-950 dark:to-secondary-900"
    >
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-4 translate-y-4 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Live</span>
          </div>
          <div className="flex gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
        </div>

        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-white">{current}</span>
          <span className="text-sm font-medium text-secondary-400">visitors</span>
        </div>
        <p className="text-xs text-secondary-500">Active on website right now</p>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-secondary-700/50 pt-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-secondary-400">
              <Users className="h-3 w-3" />
              <span>Today</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">847</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-secondary-400">
              <TrendingUp className="h-3 w-3" />
              <span>Peak</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">1,245</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-secondary-400">
              <Clock className="h-3 w-3" />
              <span>Avg</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">342</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
