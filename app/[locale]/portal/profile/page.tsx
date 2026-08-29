"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { PortalHeader } from "@/components/portal/PortalHeader"
import {
  Building2,
  User,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Phone,
  Mail,
  FileCheck2,
  Package,
  Globe,
  MapPin,
  AtSign,
  KeyRound,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { usePortal } from "@/components/portal/PortalContext"
import { PasswordRequirements } from "@/components/auth/PasswordRequirements"
import { ExpiringDocumentsList, ExpiringDocumentItem } from "@/components/portal/profile/ExpiringDocumentsList"
import { ShipmentServicesSummary, OperationsStats } from "@/components/portal/profile/ShipmentServicesSummary"
import { cn } from "@/lib/utils"

export default function PortalProfilePage() {
  const t = useTranslations()
  const locale = useLocale()
  const { user: authUser, customer: authCustomer, refreshData } = usePortal()

  const [activeTab, setActiveTab] = useState<"corporate" | "security" | "compliance">("corporate")
  const [loading, setLoading] = useState(true)

  // Profile data from /api/portal/profile
  const [companyName, setCompanyName] = useState("")
  const [commercialRegisterNumber, setCommercialRegisterNumber] = useState("")
  const [taxCardNumber, setTaxCardNumber] = useState("")
  const [industry, setIndustry] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("Alexandria")
  const [country, setCountry] = useState("Egypt")

  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)
  const [whatsappVerified, setWhatsappVerified] = useState(false)

  const [operations, setOperations] = useState<OperationsStats>({
    totalShipments: 0,
    activeShipments: 0,
    deliveredShipments: 0,
    activeServices: [
      "Sea Freight (FCL / LCL)",
      "Air Cargo Express",
      "Customs Clearance Alexandria & Sokhna",
      "Bonded Warehousing",
    ],
  })

  const [expiringDocuments, setExpiringDocuments] = useState<ExpiringDocumentItem[]>([])

  // Password Change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/portal/profile")
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUsername(data.user.username || "")
          setFirstName(data.user.firstName || "")
          setLastName(data.user.lastName || "")
          setPhone(data.user.phone || "")
          setEmail(data.user.email || "")
          setEmailVerified(!!data.user.emailVerified)
          setWhatsappVerified(!!data.user.whatsappVerified)
        }
        if (data.customer) {
          setCompanyName(data.customer.companyName || "")
          setCommercialRegisterNumber(data.customer.commercialRegisterNumber || "")
          setTaxCardNumber(data.customer.taxCardNumber || "")
          setIndustry(data.customer.industry || "")
          setAddress(data.customer.address || "")
          setCity(data.customer.city || "Alexandria")
          setCountry(data.customer.country || "Egypt")
        }
        if (data.operations) {
          setOperations(data.operations)
        }
        if (data.expiringDocuments) {
          setExpiringDocuments(data.expiringDocuments)
        }
      }
    } catch {
      // offline / error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [])

  const handleSaveCorporateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileSuccess(null)
    setProfileError(null)

    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username ? username.trim() : undefined,
          firstName,
          lastName,
          phone,
          companyName,
          address,
          city,
          country,
          industry,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setProfileSuccess(
          locale === "ar"
            ? "تم حفظ وتحديث بيانات الملف المؤسسي بنجاح!"
            : "Corporate profile updated successfully!"
        )
        refreshData()
      } else {
        setProfileError(data.error || "Failed to update profile.")
      }
    } catch {
      setProfileError("Network error while updating profile.")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccess(null)
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError(
        locale === "ar" ? "كلمتا المرور غير متطابقتين" : "New passwords do not match"
      )
      return
    }

    setSavingPassword(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()
      if (res.ok) {
        setPasswordSuccess(
          locale === "ar"
            ? "تم تغيير كلمة المرور بنجاح!"
            : "Password updated successfully!"
        )
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordError(data.error || "Failed to change password.")
      }
    } catch {
      setPasswordError("Network error while changing password.")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="flex flex-col">
      <PortalHeader
        title={locale === "ar" ? "الملف المؤسسي والامتثال" : "Corporate Profile & Operations"}
        subtitle={
          locale === "ar"
            ? "إدارة البيانات القانونية، الشحنات، إعدادات الأمان، ومتابعة تواريخ انتهاء المستندات"
            : "Manage legal entity data, shipping operations, security credentials, and document compliance"
        }
      />

      <div className="space-y-6 p-6 sm:p-8">
        {/* Top Operations KPIs & Services Summary */}
        <ShipmentServicesSummary operations={operations} />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-secondary-200/80 pb-3 dark:border-secondary-800">
          <button
            onClick={() => {
              setActiveTab("corporate")
              setProfileSuccess(null)
              setProfileError(null)
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
              activeTab === "corporate"
                ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                : "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
            )}
          >
            <Building2 className="h-4 w-4" />
            <span>{locale === "ar" ? "بيانات الشركة والكيان القانوني" : "Corporate Legal Info"}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("security")
              setPasswordSuccess(null)
              setPasswordError(null)
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
              activeTab === "security"
                ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                : "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
            )}
          >
            <KeyRound className="h-4 w-4" />
            <span>{locale === "ar" ? "إعدادات الأمان وكلمة المرور" : "Security & Credentials"}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("compliance")
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all",
              activeTab === "compliance"
                ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                : "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
            )}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>
              {locale === "ar"
                ? "متابعة انتهاء المستندات والامتثال"
                : "Document Compliance & Expirations"}
            </span>
            {expiringDocuments.length > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {expiringDocuments.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Corporate Legal Info Form */}
        {activeTab === "corporate" && (
          <div className="space-y-6">
            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-50 p-4 text-xs font-bold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{profileError}</span>
              </div>
            )}

            <form
              onSubmit={handleSaveCorporateProfile}
              className="rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900"
            >
              <div className="mb-6 flex items-center justify-between border-b border-secondary-100 pb-4 dark:border-secondary-800">
                <div>
                  <h3 className="text-sm font-bold text-secondary-900 dark:text-white">
                    {locale === "ar" ? "بيانات السجل التجاري والضرائب" : "Official Commercial Registry & Tax Data"}
                  </h3>
                  <p className="mt-0.5 text-xs text-secondary-500 dark:text-secondary-400">
                    {locale === "ar"
                      ? "المعلومات القانونية المعتمدة لدى مصلحة الجمارك والموانئ المصرية"
                      : "Verified corporate identity registered with Egyptian maritime authorities"}
                  </p>
                </div>
                <span className="rounded-xl border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  {locale === "ar" ? "حساب معتمد" : "Verified Entity"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "اسم الشركة التجاري *" : "Company Legal Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "رقم السجل التجاري (مغلق)" : "Commercial Register No. (Locked)"}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={commercialRegisterNumber || "—"}
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-100/60 p-2.5 text-xs font-semibold text-secondary-500 dark:border-secondary-800 dark:bg-secondary-800/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "رقم البطاقة الضريبية (مغلق)" : "Tax Card No. (Locked)"}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={taxCardNumber || "—"}
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-100/60 p-2.5 text-xs font-semibold text-secondary-500 dark:border-secondary-800 dark:bg-secondary-800/40"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "قطاع النشاط والصناعة" : "Industry & Sector"}
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Export & Import, Manufacturing"
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "المدينة / المحافظة" : "City / Governorate"}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "العنوان المسجل للشركة" : "Registered Office / Facility Address"}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14 El-Horreya Avenue, Alexandria"
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl bg-primary-600 px-5 text-xs font-bold text-white shadow hover:bg-primary-700"
                >
                  {savingProfile ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{locale === "ar" ? "جاري الحفظ..." : "Saving..."}</span>
                    </span>
                  ) : (
                    <span>{locale === "ar" ? "حفظ التعديلات المؤسسية" : "Save Company Changes"}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Security, Username & Password Management */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Account Manager & Username Box */}
            <form
              onSubmit={handleSaveCorporateProfile}
              className="rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900"
            >
              <div className="mb-5 border-b border-secondary-100 pb-3 dark:border-secondary-800">
                <h3 className="text-sm font-bold text-secondary-900 dark:text-white">
                  {locale === "ar" ? "اسم المستخدم والمسؤول المعتمد" : "Authorized Manager & Username"}
                </h3>
                <p className="mt-0.5 text-xs text-secondary-500 dark:text-secondary-400">
                  {locale === "ar"
                    ? "اسم المستخدم المعتمد لتسجيل الدخول ومعلومات الاتصال"
                    : "Login username identifier and primary authorized contact"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Username Input */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "اسم المستخدم (Username) *" : "Login Username *"}
                  </label>
                  <div className="relative">
                    <AtSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. mohamed_alex"
                      className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 py-2.5 pr-4 pl-9 text-xs font-bold text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pr-9 rtl:pl-4"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-secondary-500">
                    {locale === "ar"
                      ? "يمكنك استخدامه لتسجيل الدخول بدلاً من البريد الإلكتروني"
                      : "Can be used to sign in instead of your business email"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                      {locale === "ar" ? "الاسم الأول" : "First Name"}
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                      {locale === "ar" ? "اسم العائلة" : "Last Name"}
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "بريد العمل (مغلق)" : "Business Email (Verified)"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full rounded-xl border border-secondary-200 bg-secondary-100/60 p-2.5 text-xs font-semibold text-secondary-500 dark:border-secondary-800 dark:bg-secondary-800/40"
                    />
                    <span
                      className={cn(
                        "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold",
                        emailVerified
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      )}
                    >
                      {emailVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "رقم الهاتف / WhatsApp" : "Mobile Phone / WhatsApp"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                    />
                    <span
                      className={cn(
                        "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold",
                        whatsappVerified
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      )}
                    >
                      {whatsappVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="w-full rounded-xl bg-primary-600 text-xs font-bold text-white shadow hover:bg-primary-700"
                  >
                    {savingProfile ? "Saving..." : locale === "ar" ? "حفظ اسم المستخدم والبيانات" : "Save Username & Contact"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Password Change Box with PasswordRequirements Component */}
            <form
              onSubmit={handleChangePassword}
              className="rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900"
            >
              <div className="mb-5 border-b border-secondary-100 pb-3 dark:border-secondary-800">
                <h3 className="text-sm font-bold text-secondary-900 dark:text-white">
                  {locale === "ar" ? "تحديث كلمة المرور" : "Change Password"}
                </h3>
                <p className="mt-0.5 text-xs text-secondary-500 dark:text-secondary-400">
                  {locale === "ar"
                    ? "اختر كلمة مرور قوية لحماية حساب الشحن والتخليص الجمركي"
                    : "Set a secure password adhering to enterprise compliance rules"}
                </p>
              </div>

              {passwordSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-50 p-3 text-xs font-bold text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "كلمة المرور الحالية *" : "Current Password *"}
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "كلمة المرور الجديدة *" : "New Password *"}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>

                {/* Real-Time Password Complexity Checklist */}
                {newPassword && (
                  <div className="rounded-xl border border-secondary-200/80 bg-secondary-50/50 p-3.5 dark:border-secondary-800 dark:bg-secondary-800/40">
                    <PasswordRequirements password={newPassword} />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 dark:text-secondary-300">
                    {locale === "ar" ? "تأكيد كلمة المرور الجديدة *" : "Confirm New Password *"}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-2.5 text-xs font-medium text-secondary-900 transition-all focus:border-primary-500 focus:bg-white focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full rounded-xl bg-primary-600 text-xs font-bold text-white shadow hover:bg-primary-700"
                  >
                    {savingPassword ? "Updating..." : locale === "ar" ? "تحديث كلمة المرور" : "Update Password"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Document Compliance & Sorted Expiring Documents Queue */}
        {activeTab === "compliance" && (
          <div className="space-y-6">
            <ExpiringDocumentsList documents={expiringDocuments} loading={loading} />
          </div>
        )}
      </div>
    </div>
  )
}
