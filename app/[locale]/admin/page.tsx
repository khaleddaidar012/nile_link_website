"use client"

import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminAnalyticsOverview } from "@/components/admin/analytics/AdminAnalyticsOverview"
import { CustomerOverviewTable } from "@/components/admin/customers/CustomerOverviewTable"

export default function AdminDashboardPage() {
  const t = useTranslations()

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={t("admin.dashboard.title") || "Operations & Expiry Analytics"}
        subtitle={
          t("admin.dashboard.subtitle") ||
          "Live document verification queue, upcoming expirations & customer compliance"
        }
      />

      <div className="space-y-6 p-6 sm:p-8">
        {/* Executive KPIs & Fast Actions */}
        <AdminAnalyticsOverview />

        {/* Customer Accounts Quick Overview */}
        <div className="pt-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-secondary-900 dark:text-white">
              {t("admin.customerTable.title") || "Customer Accounts Overview"}
            </h3>
          </div>
          <CustomerOverviewTable />
        </div>
      </div>
    </div>
  )
}
