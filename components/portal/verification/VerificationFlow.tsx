"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Edit2,
  Check,
  X,
  ShieldAlert,
  KeyRound,
  Inbox,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "@/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface UserStatus {
  email: string
  phone: string
  emailVerified: boolean
  whatsappVerified: boolean
  firstName?: string
  lastName?: string
}

export function VerificationFlow() {
  const t = useTranslations()
  const router = useRouter()

  const [loadingInitial, setLoadingInitial] = useState(true)
  const [userStatus, setUserStatus] = useState<UserStatus>({
    email: "",
    phone: "",
    emailVerified: false,
    whatsappVerified: false,
  })

  // Dynamic Email Editing States
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editEmailValue, setEditEmailValue] = useState("")
  const [isSavingEmail, setIsSavingEmail] = useState(false)

  // Email OTP State
  const [emailOtp, setEmailOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false)
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [emailCooldown, setEmailCooldown] = useState(0)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [emailPreviewCode, setEmailPreviewCode] = useState<string | null>(null)

  // Optional WhatsApp Channel State
  const [whatsappOtp, setWhatsappOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isSendingWhatsappOtp, setIsSendingWhatsappOtp] = useState(false)
  const [isVerifyingWhatsapp, setIsVerifyingWhatsapp] = useState(false)
  const [whatsappCooldown, setWhatsappCooldown] = useState(0)
  const [whatsappError, setWhatsappError] = useState<string | null>(null)
  const [whatsappSuccess, setWhatsappSuccess] = useState<string | null>(null)
  const [whatsappPreviewCode, setWhatsappPreviewCode] = useState<string | null>(null)

  // Input refs
  const emailInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const whatsappInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Fetch initial verification status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/auth/verification-status")
        if (res.ok) {
          const data = await res.json()
          setUserStatus({
            email: data.email || "",
            phone: data.phone || "",
            emailVerified: !!data.emailVerified,
            whatsappVerified: !!data.whatsappVerified,
            firstName: data.firstName,
            lastName: data.lastName,
          })
          setEditEmailValue(data.email || "")
        }
      } catch (err) {
        console.error("Failed to load verification status", err)
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchStatus()
  }, [])

  // Cooldown timers
  useEffect(() => {
    if (emailCooldown <= 0) return
    const timer = setInterval(() => setEmailCooldown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [emailCooldown])

  useEffect(() => {
    if (whatsappCooldown <= 0) return
    const timer = setInterval(() => setWhatsappCooldown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [whatsappCooldown])

  // Handle OTP Input Change
  const handleOtpChange = (
    channel: "email" | "whatsapp",
    index: number,
    value: string
  ) => {
    const cleanVal = value.replace(/[^0-9]/g, "").slice(-1)
    const targetOtp = channel === "email" ? [...emailOtp] : [...whatsappOtp]
    const setTargetOtp = channel === "email" ? setEmailOtp : setWhatsappOtp
    const inputRefs = channel === "email" ? emailInputRefs : whatsappInputRefs

    targetOtp[index] = cleanVal
    setTargetOtp(targetOtp)

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle Paste
  const handleOtpPaste = (
    channel: "email" | "whatsapp",
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6)
    if (!pastedData) return

    const newOtp = Array(6).fill("")
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }

    if (channel === "email") {
      setEmailOtp(newOtp)
      emailInputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    } else {
      setWhatsappOtp(newOtp)
      whatsappInputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }
  }

  // Handle Backspace
  const handleOtpKeyDown = (
    channel: "email" | "whatsapp",
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const targetOtp = channel === "email" ? emailOtp : whatsappOtp
    const inputRefs = channel === "email" ? emailInputRefs : whatsappInputRefs

    if (e.key === "Backspace" && !targetOtp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Send OTP
  const handleSendOtp = async (channel: "email" | "whatsapp") => {
    const isEmail = channel === "email"
    const setLoading = isEmail ? setIsSendingEmailOtp : setIsSendingWhatsappOtp
    const setError = isEmail ? setEmailError : setWhatsappError
    const setSuccess = isEmail ? setEmailSuccess : setWhatsappSuccess
    const setCooldown = isEmail ? setEmailCooldown : setWhatsappCooldown
    const setPreview = isEmail ? setEmailPreviewCode : setWhatsappPreviewCode

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to send verification code")
        return
      }

      setSuccess(data.message || (isEmail ? "تم إرسال كود التفعيل إلى بريدك بنجاح!" : "تم إرسال رمز WhatsApp!"))
      setCooldown(60)
      if (data.previewCode) {
        setPreview(data.previewCode)
      }
    } catch {
      setError("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  // Save updated email and re-send OTP
  const handleSaveEmailAndResend = async () => {
    const newValue = editEmailValue.trim()
    if (!newValue) {
      setEmailError("الرجاء إدخال بريد إلكتروني صحيح للعمل.")
      return
    }

    setIsSavingEmail(true)
    setEmailError(null)
    setEmailSuccess(null)

    try {
      const res = await fetch("/api/auth/update-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "email", newValue }),
      })

      const data = await res.json()
      if (!res.ok) {
        setEmailError(data.error || "فشل تحديث البريد الإلكتروني.")
        return
      }

      setUserStatus((prev) => ({
        ...prev,
        email: data.newValue,
        emailVerified: false,
      }))

      setEmailOtp(["", "", "", "", "", ""])
      setEmailSuccess(data.message || "تم تحديث البريد وإرسال رمز تفعيل جديد!")
      setEmailCooldown(60)
      if (data.previewCode) {
        setEmailPreviewCode(data.previewCode)
      }
      setIsEditingEmail(false)

      setTimeout(() => {
        emailInputRefs.current[0]?.focus()
      }, 200)
    } catch {
      setEmailError("حدث خطأ أثناء تحديث البريد الإلكتروني.")
    } finally {
      setIsSavingEmail(false)
    }
  }

  // Verify OTP
  const handleVerifyOtp = async (channel: "email" | "whatsapp") => {
    const isEmail = channel === "email"
    const otpArray = isEmail ? emailOtp : whatsappOtp
    const code = otpArray.join("")
    const setLoading = isEmail ? setIsVerifyingEmail : setIsVerifyingWhatsapp
    const setError = isEmail ? setEmailError : setWhatsappError
    const setSuccess = isEmail ? setEmailSuccess : setWhatsappSuccess

    if (code.length !== 6) {
      setError("الرجاء إدخال كود التفعيل المكون من 6 أرقام كاملاً.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, code }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "رمز التفعيل غير صحيح، يرجى المحاولة مرة أخرى.")
        return
      }

      setSuccess(data.message || "تم التوثيق بنجاح!")
      setUserStatus((prev) => ({
        ...prev,
        emailVerified: channel === "email" ? true : prev.emailVerified,
        whatsappVerified: channel === "whatsapp" ? true : prev.whatsappVerified,
      }))

      if (channel === "email" || data.isFullyVerified) {
        setTimeout(() => {
          router.push("/portal")
        }, 1500)
      }
    } catch {
      setError("فشل التوثيق. يرجى المحاولة لاحقاً.")
    } finally {
      setLoading(false)
    }
  }

  if (loadingInitial) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-primary-600 dark:text-primary-400" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            جاري التحقق من حالة توثيق الحساب...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white shadow-xl shadow-primary-500/25 ring-4 ring-primary-500/10">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          توثيق البريد الإلكتروني للعمل
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          خطوة واحدة إجبارية لاستكمال إعداد حسابك في منصة نيل لينك واستلام التنبيهات والفواتير الجمركية الرسمية
        </p>
      </motion.div>

      {/* Main Mandatory Email Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-300",
          userStatus.emailVerified
            ? "border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent dark:bg-emerald-950/20"
            : "border-slate-200/90 bg-white/95 dark:border-slate-800/90 dark:bg-slate-900/95"
        )}
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner ring-4",
                userStatus.emailVerified
                  ? "bg-emerald-500 text-white ring-emerald-500/20 shadow-emerald-500/30"
                  : "bg-primary-600 text-white ring-primary-600/20 shadow-primary-600/30"
              )}
            >
              <Mail className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  بريد العمل الرسمي
                </h2>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                    userStatus.emailVerified
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  )}
                >
                  {userStatus.emailVerified ? "إجباري — تم التوثيق" : "إجباري — مطلوب"}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 dir-ltr">
                  {userStatus.email || "name@company.com"}
                </span>
                {!userStatus.emailVerified && !isEditingEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditEmailValue(userStatus.email)
                      setIsEditingEmail(true)
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>تعديل البريد</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {userStatus.emailVerified ? (
            <div className="flex items-center gap-1.5 rounded-2xl bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
              <span>موثق بالكامل</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-2xl bg-amber-500/10 px-4 py-2 text-xs font-black text-amber-700 dark:text-amber-300 border border-amber-500/20">
              <Clock className="h-4 w-4 animate-pulse" />
              <span>بانتظار إدخال الرمز</span>
            </div>
          )}
        </div>

        {/* Edit Email Form */}
        <AnimatePresence>
          {isEditingEmail && !userStatus.emailVerified && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden rounded-2xl border border-primary-500/30 bg-primary-50/50 p-4 dark:bg-primary-950/40"
            >
              <label className="block text-xs font-bold text-primary-900 dark:text-primary-200 mb-1.5">
                تحديث بريد العمل الإلكتروني وإعادة إرسال رمز التفعيل تلقائياً:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={editEmailValue}
                  onChange={(e) => setEditEmailValue(e.target.value)}
                  placeholder="manager@company.com"
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-primary-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={isSavingEmail || !editEmailValue.trim()}
                  onClick={handleSaveEmailAndResend}
                  className="rounded-xl bg-primary-600 px-4 text-xs font-bold text-white shadow hover:bg-primary-700"
                >
                  {isSavingEmail ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      <span>حفظ وإرسال</span>
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingEmail(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Success State */}
        {userStatus.emailVerified ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl bg-emerald-500/10 p-8 text-center border border-emerald-500/20 dark:bg-emerald-950/30">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-emerald-950 dark:text-emerald-100">
              تم توثيق بريد العمل بنجاح!
            </h3>
            <p className="mt-1.5 text-xs text-emerald-800/90 dark:text-emerald-300 max-w-md">
              حسابك الآن مفعل بالكامل. جاري توجيهك إلى لوحة تحكم المنصة...
            </p>
            <Button
              onClick={() => router.push("/portal")}
              className="mt-5 rounded-xl bg-emerald-600 px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
            >
              <span>الانتقال فوراً إلى البوابة</span>
              <ArrowRight className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
            </Button>
          </div>
        ) : (
          /* OTP Input Form */
          <div className="mt-6 space-y-6">
            {/* Status Messages */}
            <AnimatePresence>
              {emailError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{emailError}</span>
                </motion.div>
              )}

              {emailSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-900 dark:text-emerald-300"
                >
                  <Inbox className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{emailSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dev Helper Preview Code */}
            {emailPreviewCode && (
              <div className="rounded-2xl border border-dashed border-primary-500/40 bg-primary-500/10 p-3 text-center text-xs text-primary-900 dark:text-primary-300">
                <span>رمز التفعيل لتسهيل الاختبار السريع: </span>
                <strong className="font-mono text-base font-black tracking-widest text-primary-600 dark:text-primary-400">
                  {emailPreviewCode}
                </strong>
              </div>
            )}

            {/* Segmented 6-Digit OTP Boxes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  أدخل رمز التفعيل المكون من 6 أرقام
                </label>
                {emailCooldown > 0 && (
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    يمكن إعادة الإرسال بعد {emailCooldown} ثانية
                  </span>
                )}
              </div>

              <div className="flex justify-between gap-2 sm:gap-3 dir-ltr" dir="ltr">
                {emailOtp.map((digit, idx) => (
                  <input
                    key={`email-digit-${idx}`}
                    ref={(el) => {
                      emailInputRefs.current[idx] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange("email", idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown("email", idx, e)}
                    onPaste={(e) => handleOtpPaste("email", e)}
                    className="h-14 w-11 sm:w-13 rounded-2xl border border-slate-300 bg-white text-center text-xl font-black text-slate-900 shadow-sm transition-all duration-200 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                ))}
              </div>
            </div>

            {/* Action Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSendingEmailOtp || emailCooldown > 0}
                onClick={() => handleSendOtp("email")}
                className="rounded-2xl border-slate-300 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {isSendingEmailOtp ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : emailCooldown > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>إعادة الإرسال ({emailCooldown}ث)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    <span>إرسال رمز التفعيل للبريد</span>
                  </span>
                )}
              </Button>

              <Button
                type="button"
                disabled={isVerifyingEmail || emailOtp.join("").length !== 6}
                onClick={() => handleVerifyOtp("email")}
                className="flex-1 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3 text-xs font-extrabold text-white shadow-xl shadow-primary-500/20 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50"
              >
                {isVerifyingEmail ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>جاري التحقق من الرمز...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    <span>تأكيد وتفعيل الحساب</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Secondary Optional WhatsApp Preferences Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  رقم WhatsApp لتنبيهات الشحن العاجلة
                </h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  اختياري
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono dir-ltr mt-0.5">
                {userStatus.phone || "+20 100 000 0000"}
              </p>
            </div>
          </div>

          {userStatus.whatsappVerified ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              <span>مفعل</span>
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              غير ملزم
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
