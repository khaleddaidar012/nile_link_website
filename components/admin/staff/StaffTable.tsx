"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Shield,
  Search,
  RefreshCw,
  UserPlus,
  Bell,
  FileCheck,
  Users,
  CheckCircle2,
  Ban,
  SlidersHorizontal,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { CreateStaffModal } from "./CreateStaffModal"
import { EditPermissionsModal, StaffItem } from "./EditPermissionsModal"

export function StaffTable() {
  const t = useTranslations()
  const [staffList, setStaffList] = useState<StaffItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffItem | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/staff")
      if (res.ok) {
        const data = await res.json()
        setStaffList(data.staff || [])
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const filteredStaff = staffList.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.includes(q)
    )
  })

  return (
    <div className="space-y-4">
      {/* Top Filter & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            placeholder={t("admin.staff.searchPlaceholder") || "Search staff by name, email, or phone..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-secondary-200 bg-white py-2.5 pr-4 pl-10 text-xs font-medium transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-800 dark:bg-secondary-900 dark:text-white rtl:pr-10 rtl:pl-4 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStaff}
            className="border-secondary-200 bg-white hover:bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-900"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="ml-1.5 hidden sm:inline rtl:mr-1.5 rtl:ml-0">{t("common.refresh") || "Refresh"}</span>
          </Button>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary-600 font-bold text-white shadow-md hover:bg-primary-700"
          >
            <UserPlus className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
            <span>{t("admin.staff.addEmployee") || "Add Employee"}</span>
          </Button>
        </div>
      </div>

      {/* Staff Data Table */}
      <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs rtl:text-right">
            <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
              <tr>
                <th className="px-5 py-3.5">{t("admin.staff.colEmployee") || "Employee"}</th>
                <th className="px-4 py-3.5">{t("admin.staff.colRole") || "Role"}</th>
                <th className="px-4 py-3.5">{t("admin.staff.colStatus") || "Status"}</th>
                <th className="px-4 py-3.5">{t("admin.staff.colPermissions") || "Permissions"}</th>
                <th className="px-5 py-3.5 text-right rtl:text-left">{t("common.actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-secondary-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                      <span>{t("common.loading") || "Loading staff records..."}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-400 dark:bg-secondary-800">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-secondary-900 dark:text-white">
                      {t("admin.staff.noStaffFound") || "No employee records found"}
                    </p>
                    <p className="mt-1 text-xs text-secondary-500">
                      {t("admin.staff.noStaffSub") || "Click 'Add Employee' above to create new staff accounts."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="transition-colors hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-bold text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                          {staff.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-secondary-900 dark:text-white">
                            {staff.firstName} {staff.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-secondary-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {staff.email}
                            </span>
                            {staff.phone && (
                              <span className="flex items-center gap-1">
                                • <Phone className="h-3 w-3" />
                                {staff.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${
                          staff.role === "super_admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300"
                            : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        <span>{staff.role === "super_admin" ? (t("admin.staff.manager") || "System Manager") : (t("admin.staff.staff") || "Operations Staff")}</span>
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {staff.status === "active" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{t("common.active") || "Active"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                          <Ban className="h-3 w-3" />
                          <span>{t("common.suspended") || "Suspended"}</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {staff.role === "super_admin" ? (
                          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                            {t("admin.staff.allPermissions") || "All Privileges (Manager)"}
                          </span>
                        ) : (
                          <>
                            {staff.staffPermissions?.canSendAlerts && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
                                <Bell className="h-2.5 w-2.5" />
                                <span>{t("admin.staff.permAlertsShort") || "Alerts"}</span>
                              </span>
                            )}
                            {staff.staffPermissions?.canReviewDocuments && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                                <FileCheck className="h-2.5 w-2.5" />
                                <span>{t("admin.staff.permReviewShort") || "Docs Review"}</span>
                              </span>
                            )}
                            {staff.staffPermissions?.canManageCustomers && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                                <Users className="h-2.5 w-2.5" />
                                <span>{t("admin.staff.permCustomersShort") || "Customer Mgmt"}</span>
                              </span>
                            )}
                            {!staff.staffPermissions?.canSendAlerts &&
                              !staff.staffPermissions?.canReviewDocuments &&
                              !staff.staffPermissions?.canManageCustomers && (
                                <span className="text-[11px] text-secondary-400">
                                  {t("admin.staff.noPermissions") || "No permissions assigned"}
                                </span>
                              )}
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right rtl:text-left">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStaff(staff)
                          setIsEditOpen(true)
                        }}
                        className="rounded-xl border-secondary-200 bg-white font-semibold text-secondary-700 shadow-sm hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                      >
                        <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                        <span>{t("admin.staff.manage") || "Permissions"}</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateStaffModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchStaff}
      />

      <EditPermissionsModal
        staff={selectedStaff}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setSelectedStaff(null)
        }}
        onSuccess={fetchStaff}
      />
    </div>
  )
}
