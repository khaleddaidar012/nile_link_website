"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { Building2, User, Lock, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { usePortal } from "@/components/portal/PortalContext"

export default function PortalProfilePage() {
  const t = useTranslations()
  const { user, customer, refreshData } = usePortal()

  const [activeTab, setActiveTab] = useState<"company" | "personal" | "security">("company")
  const [companyName, setCompanyName] = useState(customer?.companyName || "")
  const [address, setAddress] = useState(customer?.address || "")
  const [city, setCity] = useState(customer?.city || "Cairo")
  const [country, setCountry] = useState(customer?.country || "Egypt")

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [phone, setPhone] = useState(user?.phone || "")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          companyName,
          address,
          city,
          country,
        }),
      })
      if (res.ok) {
        setFeedback("Profile updated successfully!")
        refreshData()
      } else {
        setFeedback("Failed to update profile.")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match")
      return
    }
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setFeedback("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setFeedback(data.error || "Failed to change password.")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col">
      <PortalHeader
        title={t("portal.sidebar.profile") || "Company & User Profile"}
        subtitle="Manage corporate details, authorized contacts, and security credentials"
      />

      <div className="space-y-6 p-6 sm:p-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-secondary-200 pb-3 dark:border-secondary-800">
          <button
            onClick={() => {
              setActiveTab("company")
              setFeedback(null)
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "company"
                ? "bg-primary-600 text-white shadow"
                : "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Company Information</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("personal")
              setFeedback(null)
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "personal"
                ? "bg-primary-600 text-white shadow"
                : "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Account Manager</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("security")
              setFeedback(null)
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              activeTab === "security"
                ? "bg-primary-600 text-white shadow"
                : "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {feedback && (
          <div className="rounded-xl border border-primary-500/20 bg-primary-50 p-3 text-xs font-semibold text-primary-800 dark:bg-primary-950/40 dark:text-primary-300">
            {feedback}
          </div>
        )}

        {/* Tab 1: Company Profile */}
        {activeTab === "company" && (
          <form onSubmit={handleSaveProfile} className="max-w-2xl space-y-4 rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white">Legal Entity Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Commercial Register Number</label>
                <input
                  type="text"
                  disabled
                  value={customer?.commercialRegisterNumber || "—"}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-100/50 p-2.5 text-xs text-secondary-500 dark:border-secondary-800 dark:bg-secondary-800/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Tax Card Number</label>
                <input
                  type="text"
                  disabled
                  value={customer?.taxCardNumber || "—"}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-100/50 p-2.5 text-xs text-secondary-500 dark:border-secondary-800 dark:bg-secondary-800/40"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Office / Facility Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" disabled={saving} className="bg-primary-600 font-semibold text-white">
                {saving ? "Saving..." : "Save Company Changes"}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Personal Profile */}
        {activeTab === "personal" && (
          <form onSubmit={handleSaveProfile} className="max-w-2xl space-y-4 rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white">Account Administrator Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Work Email</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || "—"}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-100/50 p-2.5 text-xs text-secondary-500 dark:border-secondary-800 dark:bg-secondary-800/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Mobile Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" disabled={saving} className="bg-primary-600 font-semibold text-white">
                {saving ? "Saving..." : "Save Personal Info"}
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === "security" && (
          <form onSubmit={handleChangePassword} className="max-w-2xl space-y-4 rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white">Change Account Password</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" disabled={saving} className="bg-primary-600 font-semibold text-white">
                {saving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
