"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ExpiryEscalationTable } from "@/components/admin/notifications/ExpiryEscalationTable"
import { Bell, Radar, History, ShieldAlert } from "lucide-react"

export default function AdminNotificationsPage() {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<"radar" | "feed">("radar")

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={t("admin.notifications.title") || "Notification Center & Document Expiry Radar"}
        subtitle={
          t("admin.notifications.subtitle") ||
          "Multi-tier 30d, 20d, 10d, and 5d automated escalation tracking and operational broadcasts"
        }
      />

      <div className="space-y-6 p-6 sm:p-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-secondary-200 dark:border-secondary-800 pb-3">
          <button
            onClick={() => setActiveTab("radar")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "radar"
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-secondary-600 hover:bg-secondary-100 dark:bg-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800"
            }`}
          >
            <Radar className="h-4 w-4" />
            <span>{t("admin.notifications.tabRadar") || "Expiry Escalation Radar (30/20/10/5 Days)"}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "radar" && (
          <div className="space-y-4">
            <ExpiryEscalationTable />
          </div>
        )}
      </div>
    </div>
  )
}
