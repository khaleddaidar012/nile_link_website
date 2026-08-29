"use client"

import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { DocumentCategoriesManager } from "@/components/admin/settings/DocumentCategoriesManager"
import { Sliders } from "lucide-react"

export default function AdminSettingsPage() {
  const t = useTranslations()

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={t("admin.settings.title") || "System Settings & Operational Configurations"}
        subtitle={
          t("admin.settings.subtitle") ||
          "Manage allowed corporate document types, default validities, and platform parameters"
        }
      />

      <div className="space-y-6 p-6 sm:p-8">
        <DocumentCategoriesManager />
      </div>
    </div>
  )
}
