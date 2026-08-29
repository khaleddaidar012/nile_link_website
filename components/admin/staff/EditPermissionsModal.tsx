"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Shield,
  Bell,
  FileCheck,
  Users,
  Loader2,
  CheckCircle2,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface StaffItem {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  status: string
  staffPermissions: {
    canSendAlerts: boolean
    canReviewDocuments: boolean
    canManageCustomers: boolean
  }
}

interface EditPermissionsModalProps {
  staff: StaffItem | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditPermissionsModal({
  staff,
  isOpen,
  onClose,
  onSuccess,
}: EditPermissionsModalProps) {
  const t = useTranslations()
  const [canSendAlerts, setCanSendAlerts] = useState(
    staff?.staffPermissions?.canSendAlerts ?? true
  )
  const [canReviewDocuments, setCanReviewDocuments] = useState(
    staff?.staffPermissions?.canReviewDocuments ?? true
  )
  const [canManageCustomers, setCanManageCustomers] = useState(
    staff?.staffPermissions?.canManageCustomers ?? false
  )
  const [status, setStatus] = useState(staff?.status || "active")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !staff) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/staff/${staff.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          staffPermissions: {
            canSendAlerts,
            canReviewDocuments,
            canManageCustomers,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to update staff permissions")
        return
      }

      onSuccess()
      onClose()
    } catch {
      setError("Network error while updating staff")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900"
        >
          <div className="flex items-center justify-between border-b border-secondary-100 pb-4 dark:border-secondary-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-secondary-900 dark:text-white">
                  {t("admin.staff.editTitle") || "Edit Permissions"}
                </h3>
                <p className="text-xs text-secondary-500">
                  {staff.firstName} {staff.lastName} • {staff.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-700 dark:hover:bg-secondary-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="mt-5 space-y-4">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* Account Status Toggle */}
            <div>
              <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                {t("admin.staff.accountStatus") || "Employee Account Status"}
              </label>
              <div className="mt-1.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("active")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    status === "active"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "border-secondary-200 text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-400"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t("common.active") || "Active"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("suspended")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    status === "suspended"
                      ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                      : "border-secondary-200 text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-400"
                  }`}
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>{t("common.suspended") || "Suspended"}</span>
                </button>
              </div>
            </div>

            {/* Permissions Box */}
            <div className="space-y-2.5 rounded-xl border border-secondary-200/80 bg-secondary-50/70 p-3.5 dark:border-secondary-800 dark:bg-secondary-800/40">
              <span className="text-xs font-bold text-secondary-900 dark:text-white">
                {t("admin.staff.permissionsHeading") || "Assigned Permissions"}
              </span>

              {/* Send Alerts */}
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-white dark:hover:bg-secondary-800">
                <input
                  type="checkbox"
                  checked={canSendAlerts}
                  onChange={(e) => setCanSendAlerts(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-secondary-900 dark:text-white">
                    <Bell className="h-3.5 w-3.5 text-primary-500" />
                    <span>{t("admin.staff.permAlerts") || "Send Alerts & Broadcasts"}</span>
                  </div>
                  <p className="text-[11px] text-secondary-500">
                    {t("admin.staff.permAlertsDesc") || "Can trigger manual client notifications and expiry warnings"}
                  </p>
                </div>
              </label>

              {/* Review Documents */}
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-white dark:hover:bg-secondary-800">
                <input
                  type="checkbox"
                  checked={canReviewDocuments}
                  onChange={(e) => setCanReviewDocuments(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-secondary-900 dark:text-white">
                    <FileCheck className="h-3.5 w-3.5 text-teal-500" />
                    <span>{t("admin.staff.permReview") || "Approve & Reject Documents"}</span>
                  </div>
                  <p className="text-[11px] text-secondary-500">
                    {t("admin.staff.permReviewDesc") || "Can verify compliance files, set validity dates, and reject files"}
                  </p>
                </div>
              </label>

              {/* Manage Customers */}
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-white dark:hover:bg-secondary-800">
                <input
                  type="checkbox"
                  checked={canManageCustomers}
                  onChange={(e) => setCanManageCustomers(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-secondary-900 dark:text-white">
                    <Users className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{t("admin.staff.permCustomers") || "Activate & Deactivate Customers"}</span>
                  </div>
                  <p className="text-[11px] text-secondary-500">
                    {t("admin.staff.permCustomersDesc") || "Can change customer status (Active, Warning, Restricted)"}
                  </p>
                </div>
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-secondary-100 pt-4 dark:border-secondary-800">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary-600 font-bold text-white hover:bg-primary-700">
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>{t("common.saving") || "Saving..."}</span>
                  </span>
                ) : (
                  <span>{t("common.saveChanges") || "Save Permissions"}</span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
