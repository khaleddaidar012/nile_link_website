"use client"

import { useState, useEffect } from "react"
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
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/Button"

interface CreateStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface RoleConfig {
  id: string
  title: string
  permissions: {
    canSendAlerts: boolean
    canReviewDocuments: boolean
    canManageCustomers: boolean
  }
}

export function CreateStaffModal({ isOpen, onClose, onSuccess }: CreateStaffModalProps) {
  const t = useTranslations()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("+20")
  const [password, setPassword] = useState("")
  
  // Roles State
  const [roles, setRoles] = useState<RoleConfig[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>("super_admin")
  const [loadingRoles, setLoadingRoles] = useState(false)
  
  // New Role Form State
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [newRoleTitle, setNewRoleTitle] = useState("")
  const [newCanSendAlerts, setNewCanSendAlerts] = useState(false)
  const [newCanReviewDocs, setNewCanReviewDocs] = useState(false)
  const [newCanManageCust, setNewCanManageCust] = useState(false)
  const [creatingRoleLoading, setCreatingRoleLoading] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchRoles()
    }
  }, [isOpen])

  const fetchRoles = async () => {
    setLoadingRoles(true)
    try {
      const res = await fetch("/api/admin/roles")
      if (res.ok) {
        const data = await res.json()
        setRoles(data.roles || [])
      }
    } catch (err) {
      console.error("Failed to fetch roles", err)
    } finally {
      setLoadingRoles(false)
    }
  }

  const handleCreateRole = async () => {
    if (!newRoleTitle.trim()) return
    setCreatingRoleLoading(true)
    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newRoleTitle,
          permissions: {
            canSendAlerts: newCanSendAlerts,
            canReviewDocuments: newCanReviewDocs,
            canManageCustomers: newCanManageCust,
          }
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setRoles([...roles, data.role])
        setSelectedRoleId(data.role.id)
        setIsCreatingRole(false)
        setNewRoleTitle("")
        setNewCanSendAlerts(false)
        setNewCanReviewDocs(false)
        setNewCanManageCust(false)
      } else {
        setError(data.error || "Failed to create role")
      }
    } catch (err) {
      setError("Network error creating role")
    } finally {
      setCreatingRoleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let roleType = "staff"
      let staffPermissions = {
        canSendAlerts: false,
        canReviewDocuments: false,
        canManageCustomers: false
      }
      let jobTitleStr = ""

      if (selectedRoleId === "super_admin") {
        roleType = "super_admin"
        staffPermissions = { canSendAlerts: true, canReviewDocuments: true, canManageCustomers: true }
      } else {
        const selectedRoleObj = roles.find(r => r.id === selectedRoleId)
        if (selectedRoleObj) {
          jobTitleStr = selectedRoleObj.title
          staffPermissions = selectedRoleObj.permissions
        }
      }

      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          jobTitle: jobTitleStr,
          email,
          phone,
          password,
          role: roleType,
          staffPermissions,
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

  if (!isOpen) return null

  // Get current permissions based on selection
  let currentPermissions = { canSendAlerts: true, canReviewDocuments: true, canManageCustomers: true }
  if (selectedRoleId !== "super_admin") {
    const r = roles.find(x => x.id === selectedRoleId)
    if (r) currentPermissions = r.permissions
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
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-secondary-200 bg-white py-2 pr-3 pl-8 text-xs font-medium text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pr-8 rtl:pl-3"
                  />
                </div>
              </div>
            </div>

            {/* ROLES SELECTOR */}
            <div>
              <label className="mb-1 flex items-center justify-between text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                <span>{t("admin.staff.jobTitle") || "Job Title & Permissions"}</span>
                <button 
                  type="button" 
                  onClick={() => setIsCreatingRole(!isCreatingRole)}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  <Plus className="h-3 w-3" />
                  {t("common.add") || "Add New Role"}
                </button>
              </label>

              {isCreatingRole && (
                <div className="mb-3 mt-2 rounded-xl border border-primary-100 bg-primary-50/50 p-3 dark:border-primary-900/50 dark:bg-primary-950/30">
                  <input
                    type="text"
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    placeholder={t("admin.staff.newRoleTitle") || "e.g. Finance Auditor"}
                    className="w-full rounded-lg border border-secondary-200 bg-white px-3 py-1.5 text-xs text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={newCanSendAlerts} onChange={e => setNewCanSendAlerts(e.target.checked)} className="rounded text-primary-600" />
                      {t("admin.staff.permAlerts") || "Send Alerts"}
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={newCanReviewDocs} onChange={e => setNewCanReviewDocs(e.target.checked)} className="rounded text-primary-600" />
                      {t("admin.staff.permReview") || "Review Docs"}
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={newCanManageCust} onChange={e => setNewCanManageCust(e.target.checked)} className="rounded text-primary-600" />
                      {t("admin.staff.permCustomers") || "Manage Customers"}
                    </label>
                  </div>
                  <Button type="button" onClick={handleCreateRole} disabled={creatingRoleLoading} className="mt-2 h-7 w-full text-[11px]">
                    {creatingRoleLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : (t("common.save") || "Save Role")}
                  </Button>
                </div>
              )}

              <div className="relative">
                <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:left-auto rtl:right-3" />
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  disabled={loadingRoles}
                  className="w-full rounded-xl border border-secondary-200 bg-white p-2.5 pl-9 text-xs text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pl-2.5 rtl:pr-9"
                >
                  <option value="super_admin">{t("admin.staff.roleAdmin") || "Administrator (Full Access)"}</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Readonly Permissions Display */}
            <div className="rounded-xl border border-secondary-200/80 bg-secondary-50/70 p-3.5 dark:border-secondary-800 dark:bg-secondary-800/40">
              <span className="text-xs font-bold text-secondary-900 dark:text-white">
                {t("admin.staff.permissionsHeading") || "Assigned Operational Permissions"}
              </span>
              <div className="mt-2 space-y-1.5 text-[11px] text-secondary-600 dark:text-secondary-400">
                <div className="flex items-center justify-between">
                  <span>{t("admin.staff.permAlerts") || "Send Alerts & Broadcasts"}</span>
                  {currentPermissions.canSendAlerts ? <span className="text-emerald-500">✔</span> : <span className="text-secondary-300">✖</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("admin.staff.permReview") || "Approve & Reject Documents"}</span>
                  {currentPermissions.canReviewDocuments ? <span className="text-emerald-500">✔</span> : <span className="text-secondary-300">✖</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("admin.staff.permCustomers") || "Manage Customer Accounts"}</span>
                  {currentPermissions.canManageCustomers ? <span className="text-emerald-500">✔</span> : <span className="text-secondary-300">✖</span>}
                </div>
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
