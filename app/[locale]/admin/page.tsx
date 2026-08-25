"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminMetricCards } from "@/components/admin/analytics/AdminMetricCards"
import { ExpiryTrendsChart } from "@/components/admin/analytics/ExpiryTrendsChart"
import { UrgentExpiryTicker } from "@/components/admin/analytics/UrgentExpiryTicker"
import { CustomerOverviewTable } from "@/components/admin/customers/CustomerOverviewTable"
import { Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
  const t = useTranslations()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics/overview")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={t("admin.dashboard.title") || "Operations & Expiry Analytics"}
        subtitle="Live document verification queue, upcoming expirations & customer compliance"
      />

      <div className="space-y-6 p-6 sm:p-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <>
            {/* Urgent Expiry Alert Ticker */}
            <UrgentExpiryTicker urgentCount={data?.urgentCount || 0} />

            {/* 4 Metric Cards */}
            {data?.metrics && <AdminMetricCards metrics={data.metrics} />}

            {/* Expiry Distribution Horizon Chart */}
            {data?.expiryHorizonChartData && (
              <ExpiryTrendsChart data={data.expiryHorizonChartData} />
            )}

            {/* Customer Accounts Quick Overview */}
            <div className="pt-4">
              <h3 className="mb-4 text-base font-bold text-white">Customer Compliance Overview</h3>
              <CustomerOverviewTable />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
