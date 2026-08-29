"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  UserPlus,
  Shield,
  Bell,
  FileCheck,
  Users,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/Button"

interface CreateStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateStaffModal({ isOpen, onClose, onSuccess }: CreateStaffModalProps) {
  const t = useTranslations()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("+20")
  const [password, setPassword] = useState("")
  const [canSendAlerts, setCanSendAlerts] = useState(true)
  const [canReviewDocuments, setCanReviewDocuments] = useState(true)
  const [canManageCustomers, setCanManageCustomers] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
          staffPermissions: {
            canSendAlerts,
            canReviewDocuments,
            canManageCustomers,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create staff account")
        return
      }

      onSuccess()
      onClose()
    } catch {
      setError("Network error while creating staff account")
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
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900"
        >
          <div className="flex items-center justify-between border-b border-secondary-100 pb-4 dark:border-secondary-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-secondary-900 dark:text-white">
                  {t("admin.staff.createTitle") || "Add New Employee"}
                </h3>
                <p className="text-xs text-secondary-500">
                  {t("admin.staff.createSubtitle") || "Create a staff account and configure operational permissions"}
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

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  {t("admin.staff.firstName") || "First Name"}
                </label>
                <div className="relative mt-1">
                  <User className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Karim"
                    className="w-full rounded-xl border border-secondary-200 bg-white py-2 pr-3 pl-8 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pr-8 rtl:pl-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  {t("admin.staff.lastName") || "Last Name"}
                </label>
                <div className="relative mt-1">
                  <User className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nasser"
                    className="w-full rounded-xl border border-secondary-200 bg-white py-2 pr-3 pl-8 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pr-8 rtl:pl-3"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                {t("admin.staff.email") || "Corporate Email"}
              </label>
              <div className="relative mt-1">
                <Mail className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karim@nilelink.com"
                  className="w-full rounded-xl border border-secondary-200 bg-white py-2 pr-3 pl-8 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pr-8 rtl:pl-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  {t("admin.staff.phone") || "WhatsApp / Mobile"}
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+201000000000"
                    className="w-full rounded-xl border border-secondary-200 bg-white py-2 pr-3 pl-8 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pr-8 rtl:pl-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  {t("admin.staff.password") || "Initial Password"}
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-secondary-200 bg-white py-2 pr-3 pl-8 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pr-8 rtl:pl-3"
                  />
                </div>
              </div>
            </div>

            {/* Granular Permissions Box */}
            <div className="rounded-xl border border-secondary-200/80 bg-secondary-50/70 p-3.5 dark:border-secondary-800 dark:bg-secondary-800/40">
              <span className="text-xs font-bold text-secondary-900 dark:text-white">
                {t("admin.staff.permissionsHeading") || "Assigned Operational Permissions"}
              </span>
              <p className="text-[11px] text-secondary-500">
                {t("admin.staff.permissionsSub") || "Select the exact privileges this employee can execute"}
              </p>

              <div className="mt-3 space-y-2.5">
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
                      {t("admin.staff.permReviewDesc") || "Can verify compliance files, set validity dates, and reject illegible files"}
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
                      <span>{t("admin.staff.permCustomers") || "Activate & Deactivate Customer Accounts"}</span>
                    </div>
                    <p className="text-[11px] text-secondary-500">
                      {t("admin.staff.permCustomersDesc") || "Can change customer account status (Active, Warning, Restricted)"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-secondary-100 pt-4 dark:border-secondary-800">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button type="submit" disabled={loading} className="bg-primary-600 font-bold text-white hover:bg-primary-700">
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>{t("common.saving") || "Creating..."}</span>
                  </span>
                ) : (
                  <span>{t("admin.staff.createButton") || "Create Employee"}</span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
