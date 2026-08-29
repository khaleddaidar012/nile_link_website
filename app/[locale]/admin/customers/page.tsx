"use client"

import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { CustomerOverviewTable } from "@/components/admin/customers/CustomerOverviewTable"

export default function AdminCustomersPage() {
  const t = useTranslations()

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={t("admin.customers.pageTitle") || "Customer Accounts & Compliance Directory"}
        subtitle={
          t("admin.customers.pageSubtitle") ||
          "Inspect client compliance health, audit legal documents, and govern account operational access"
        }
      />

      <div className="space-y-6 p-6 sm:p-8">
        <CustomerOverviewTable />
      </div>
    </div>
  )
}
