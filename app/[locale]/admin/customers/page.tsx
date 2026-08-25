"use client"

import { AdminHeader } from "@/components/admin/AdminHeader"
import { CustomerOverviewTable } from "@/components/admin/customers/CustomerOverviewTable"

export default function AdminCustomersPage() {
  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Customer Accounts & Compliance"
        subtitle="Manage client organizations, review registered legal documents, and send renewal warnings"
      />

      <div className="space-y-6 p-6 sm:p-8">
        <CustomerOverviewTable />
      </div>
    </div>
  )
}
