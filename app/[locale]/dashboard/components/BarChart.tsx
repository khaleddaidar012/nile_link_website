"use client"

import { motion } from "framer-motion"
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TimeSeriesDataPoint } from "@/lib/analytics"

interface BarChartCardProps {
  data: TimeSeriesDataPoint[]
  title: string
  subtitle?: string
  color?: string
  height?: number
}

export function BarChartCard({ data, title, subtitle, color = "#2563eb", height = 300 }: BarChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800"
    >
      <div className="mb-4">
        <h3 className="text-sm font-bold text-secondary-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-secondary-400 dark:text-secondary-500">{subtitle}</p>}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              const d = new Date(v)
              return `${d.getDate()}/${d.getMonth() + 1}`
            }}
          />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              backgroundColor: "rgba(255,255,255,0.95)",
              fontSize: "13px",
            }}
            labelFormatter={(v) => {
              if (typeof v !== "string" && typeof v !== "number") return ""
              return new Date(v).toLocaleDateString()
            }}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          />
        </RechartsBar>
      </ResponsiveContainer>
    </motion.div>
  )
}
