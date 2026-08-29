"use client"

import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StaffTable } from "@/components/admin/staff/StaffTable"

export default function AdminStaffPage() {
  const t = useTranslations()

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={t("admin.staff.title") || "Staff Management & Granular RBAC"}
        subtitle={t("admin.staff.subtitle") || "Create employee accounts and assign operational privileges"}
      />

      <div className="p-6 sm:p-8">
        <StaffTable />
      </div>
    </div>
  )
}
