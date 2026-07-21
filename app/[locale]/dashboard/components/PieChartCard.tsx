"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PieDataItem {
  name: string
  value: number
  percentage?: number
}

interface PieChartCardProps {
  data: PieDataItem[]
  title: string
  subtitle?: string
  height?: number
}

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"]

export function PieChartCard({ data, title, subtitle, height = 300 }: PieChartCardProps) {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              backgroundColor: "rgba(255,255,255,0.95)",
              fontSize: "13px",
            }}
            formatter={(value) => [`${Number(value).toLocaleString()} visitors`]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value: string) => (
              <span className="text-xs text-secondary-600 dark:text-secondary-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
