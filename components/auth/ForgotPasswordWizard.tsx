"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import {
  Mail,
  MessageSquare,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react"
import Image from "next/image"
import logoImg from "@/public/images/logo.png"
import { Link, useRouter } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { PasswordRequirements } from "@/components/auth/PasswordRequirements"
import { evaluatePasswordStrength } from "@/lib/auth/password"

type Channel = "email" | "whatsapp"
type Step = "channel" | "otp" | "password" | "success"

export function ForgotPasswordWizard() {
  const t = useTranslations()
  const router = useRouter()

  const [step, setStep] = useState<Step>("channel")
  const [channel, setChannel] = useState<Channel>("email")
  const [identifier, setIdentifier] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [previewCode, setPreviewCode] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [countdown, setCountdown] = useState(60)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverMessage, setServerMessage] = useState<string | null>(null)

  // Resend timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    } else if (countdown === 0) {
      setIsCountingDown(false)
    }
    return () => clearTimeout(timer)
  }, [isCountingDown, countdown])

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword

  const isPasswordValid = evaluatePasswordStrength(newPassword).isValid

  // 1. Request OTP Code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) {
      setServerError(
        channel === "email"
          ? "Please enter your registered email address"
          : "Please enter your registered WhatsApp phone number"
      )
      return
    }

    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          channel,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || "Failed to dispatch verification code")
        return
      }

      if (data.previewCode) {
        setPreviewCode(data.previewCode)
      }

      setServerMessage(data.message)
      setStep("otp")
      setCountdown(60)
      setIsCountingDown(true)
    } catch {
      setServerError("A network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (isCountingDown) return
    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          channel,
        }),
      })

      const data = await res.json()
      if (data.previewCode) {
        setPreviewCode(data.previewCode)
      }
      setCountdown(60)
      setIsCountingDown(true)
    } catch {
      setServerError("Failed to resend code. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Verify OTP Code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode.trim().length !== 6) {
      setServerError("Please enter a valid 6-digit security code")
      return
    }
    setServerError(null)
    setStep("password")
  }

  // 3. Confirm New Password
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPasswordValid) {
      setServerError("Password must meet all security criteria")
      return
    }
    if (!passwordsMatch) {
      setServerError("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          channel,
          code: otpCode.trim(),
          newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || "Failed to update password. Please check your code.")
        return
      }

      setStep("success")
    } catch {
      setServerError("A network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg rounded-2xl border border-secondary-200/80 bg-white/95 p-6 sm:p-8 shadow-premium-xl backdrop-blur-xl dark:border-secondary-800/80 dark:bg-secondary-900/95"
    >
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center gap-2.5">
          <div className="relative h-[44px] w-[44px] shrink-0">
            <Image
              src={logoImg}
              alt="NileLink Logistics"
              fill
              sizes="44px"
              priority
              className="object-contain"
            />
          </div>
          <span className="flex flex-col text-left rtl:text-right leading-none">
            <span className="text-xl font-bold tracking-wide text-secondary-900 dark:text-white">
              Nile Link
            </span>
            <span className="my-0.5 border-t border-primary-500" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-secondary-500 dark:text-secondary-400">
              Logistics
            </span>
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-white">
          {t("auth.forgotPassword.title") || "Reset Your Password"}
        </h1>
        <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">
          {t("auth.forgotPassword.subtitle") ||
            "Recover your NileLink account via Email or WhatsApp verification"}
        </p>
      </div>

      {/* Progress Indicators */}
      {step !== "success" && (
        <div className="mb-6 flex items-center justify-center gap-2">
          {(["channel", "otp", "password"] as const).map((s, idx) => {
            const isActive = step === s
            const isCompleted =
              (s === "channel" && (step === "otp" || step === "password")) ||
              (s === "otp" && step === "password")
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                    isActive
                      ? "bg-primary-600 text-white ring-4 ring-primary-500/20"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-secondary-100 text-secondary-400 dark:bg-secondary-800"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                {idx < 2 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 transition-colors",
                      isCompleted ? "bg-emerald-500" : "bg-secondary-200 dark:bg-secondary-800"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Error Banner */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{serverError}</span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: CHANNEL SELECTION & IDENTIFIER */}
        {step === "channel" && (
          <motion.form
            key="step-channel"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleRequestOtp}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-xs font-bold text-secondary-700 uppercase tracking-wider dark:text-secondary-300">
                {t("auth.forgotPassword.chooseChannel") || "Choose Recovery Channel"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Email Option */}
                <button
                  type="button"
                  onClick={() => {
                    setChannel("email")
                    setServerError(null)
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3.5 text-center transition-all",
                    channel === "email"
                      ? "border-primary-500 bg-primary-50/50 text-primary-900 ring-2 ring-primary-500/20 dark:bg-primary-950/30 dark:text-primary-200"
                      : "border-secondary-200 bg-secondary-50/50 text-secondary-600 hover:border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800/40 dark:text-secondary-400"
                  )}
                >
                  <Mail
                    className={cn(
                      "h-5 w-5",
                      channel === "email" ? "text-primary-600 dark:text-primary-400" : "text-secondary-400"
                    )}
                  />
                  <div>
                    <div className="text-xs font-bold">
                      {t("auth.forgotPassword.emailChannel") || "Email"}
                    </div>
                    <div className="text-[10px] text-secondary-500 mt-0.5">
                      {t("auth.forgotPassword.emailChannelDesc") || "6-digit OTP to email"}
                    </div>
                  </div>
                </button>

                {/* WhatsApp Option */}
                <button
                  type="button"
                  onClick={() => {
                    setChannel("whatsapp")
                    setServerError(null)
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3.5 text-center transition-all",
                    channel === "whatsapp"
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-secondary-200 bg-secondary-50/50 text-secondary-600 hover:border-secondary-300 dark:border-secondary-700 dark:bg-secondary-800/40 dark:text-secondary-400"
                  )}
                >
                  <MessageSquare
                    className={cn(
                      "h-5 w-5",
                      channel === "whatsapp" ? "text-emerald-600 dark:text-emerald-400" : "text-secondary-400"
                    )}
                  />
                  <div>
                    <div className="text-xs font-bold">
                      {t("auth.forgotPassword.whatsappChannel") || "WhatsApp"}
                    </div>
                    <div className="text-[10px] text-secondary-500 mt-0.5">
                      {t("auth.forgotPassword.whatsappChannelDesc") || "6-digit OTP to WhatsApp"}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {channel === "email"
                  ? t("auth.forgotPassword.email") || "Email Address"
                  : t("auth.forgotPassword.phone") || "WhatsApp Mobile Number"}
              </label>
              <div className="relative">
                {channel === "email" ? (
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                ) : (
                  <MessageSquare className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                )}
                <input
                  type={channel === "email" ? "email" : "tel"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    channel === "email"
                      ? t("auth.forgotPassword.emailPlaceholder") || "name@company.com"
                      : t("auth.forgotPassword.phonePlaceholder") || "+20 10 0000 0000"
                  }
                  required
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/80 pr-4 pl-10 py-2.5 text-xs font-medium text-secondary-900 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800/90 dark:text-white rtl:pr-10 rtl:pl-4"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary-600 py-3 font-bold text-white shadow-md transition-all hover:bg-primary-700"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("auth.forgotPassword.sendingOtp") || "Sending Code..."}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>{t("auth.forgotPassword.sendOtp") || "Send Verification Code"}</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </span>
              )}
            </Button>
          </motion.form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <motion.form
            key="step-otp"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleVerifyOtp}
            className="space-y-4"
          >
            <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-3 text-center text-xs text-primary-800 dark:border-primary-900/50 dark:bg-primary-950/30 dark:text-primary-200">
              <div className="font-semibold">
                {t("auth.forgotPassword.otpSubtitle") || "We have sent a verification code to"}:
              </div>
              <div className="mt-0.5 font-bold tracking-wide text-primary-900 dark:text-white">
                {identifier}
              </div>
            </div>

            {/* Dev Preview Pill */}
            {previewCode && (
              <div
                onClick={() => setOtpCode(previewCode)}
                className="cursor-pointer rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-center text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300 transition-colors"
              >
                <span className="mr-1">⚡ Dev Preview OTP:</span>
                <span className="font-mono font-bold tracking-widest text-primary-600 dark:text-primary-400">
                  {previewCode}
                </span>
                <span className="ml-1.5 text-[10px] text-amber-600 dark:text-amber-400">(Click to auto-fill)</span>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-center text-xs font-bold text-secondary-700 uppercase tracking-wider dark:text-secondary-300">
                {t("auth.forgotPassword.otpTitle") || "Enter 6-Digit Security Code"}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoFocus
                className="w-full rounded-xl border border-secondary-200 bg-secondary-50/80 py-3 text-center font-mono text-2xl font-bold tracking-[0.5em] text-secondary-900 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800/90 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-secondary-500">
              <button
                type="button"
                onClick={() => setStep("channel")}
                className="flex items-center gap-1 font-semibold text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                <span>Change identifier</span>
              </button>

              {isCountingDown ? (
                <span className="text-[11px] font-medium text-secondary-400">
                  {t("auth.forgotPassword.resendIn") || "Resend code in"} {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 font-bold text-primary-600 hover:underline dark:text-primary-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t("auth.forgotPassword.resendBtn") || "Resend Code"}</span>
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={otpCode.length !== 6}
              className="w-full rounded-xl bg-primary-600 py-3 font-bold text-white shadow-md transition-all hover:bg-primary-700 disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                <span>{t("auth.forgotPassword.verifyOtp") || "Verify Code & Proceed"}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </span>
            </Button>
          </motion.form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === "password" && (
          <motion.form
            key="step-password"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleConfirmReset}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.forgotPassword.newPassword") || "New Password"} *
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-secondary-200 bg-secondary-50/80 pr-10 pl-10 py-2.5 text-xs font-medium text-secondary-900 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800/90 dark:text-white rtl:pr-10 rtl:pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 rtl:right-auto rtl:left-3"
                  aria-label="Toggle new password visibility"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                  {t("auth.forgotPassword.confirmPassword") || "Confirm New Password"} *
                </label>
                {confirmPassword.length > 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-bold",
                      passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                    )}
                  >
                    {passwordsMatch ? "Passwords match ✓" : "Passwords do not match"}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={cn(
                    "w-full rounded-xl border bg-secondary-50/80 pr-16 pl-10 py-2.5 text-xs font-medium text-secondary-900 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/90 dark:text-white rtl:pr-10 rtl:pl-16",
                    passwordsMatch
                      ? "border-emerald-500"
                      : "border-secondary-200 dark:border-secondary-700"
                  )}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1.5 rtl:right-auto rtl:left-3">
                  {passwordsMatch && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200"
                    aria-label="Toggle confirm new password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <PasswordRequirements password={newPassword} />

            <Button
              type="submit"
              disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
              className="w-full rounded-xl bg-primary-600 py-3 font-bold text-white shadow-md transition-all hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("auth.forgotPassword.resetting") || "Updating Password..."}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t("auth.forgotPassword.resetBtn") || "Reset Password & Secure Account"}</span>
                </span>
              )}
            </Button>
          </motion.form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === "success" && (
          <motion.div
            key="step-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
              {t("auth.forgotPassword.successTitle") || "Password Reset Successfully!"}
            </h2>
            <p className="mt-2 text-xs text-secondary-600 dark:text-secondary-400">
              {t("auth.forgotPassword.successDesc") ||
                "Your account password has been securely updated. You can now sign in with your new credentials."}
            </p>

            <div className="mt-6">
              <Button
                onClick={() => router.push("/login")}
                className="w-full rounded-xl bg-primary-600 py-3 font-bold text-white shadow-md transition-all hover:bg-primary-700"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{t("auth.forgotPassword.signInBtn") || "Sign In to Portal"}</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 border-t border-secondary-200 pt-4 text-center text-xs text-secondary-600 dark:border-secondary-800 dark:text-secondary-400">
        <Link
          href="/login"
          className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
        >
          ← {t("auth.forgotPassword.backToLogin") || "Back to Login"}
        </Link>
      </div>
    </motion.div>
  )
}
