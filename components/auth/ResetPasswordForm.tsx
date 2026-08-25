"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetFormData = z.infer<typeof resetSchema>

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const onSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.newPassword }),
      })

      const result = await res.json()

      if (!res.ok) {
        setServerError(result.error || "Failed to reset password")
        return
      }

      setIsSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2500)
    } catch {
      setServerError("A network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-secondary-200 bg-white p-8 text-center shadow-premium-xl dark:border-secondary-800 dark:bg-secondary-900"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
          {t("auth.resetPassword.title") || "Password Updated!"}
        </h2>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          {t("auth.resetPassword.success") || "Your password has been reset successfully! Redirecting to login..."}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md rounded-2xl border border-secondary-200/80 bg-white/95 p-8 shadow-premium-xl backdrop-blur-xl dark:border-secondary-800/80 dark:bg-secondary-900/95"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-white">
          {t("auth.resetPassword.title") || "Set New Password"}
        </h1>
        <p className="mt-1.5 text-sm text-secondary-600 dark:text-secondary-400">
          {t("auth.resetPassword.subtitle") || "Please enter a strong password for your account"}
        </p>
      </div>

      {serverError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-secondary-700 uppercase tracking-wider dark:text-secondary-300">
            {t("auth.resetPassword.newPassword") || "New Password"}
          </label>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("newPassword")}
              className={cn(
                "w-full rounded-xl border bg-secondary-50/50 py-2.5 pr-10 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white rtl:pr-10 rtl:pl-10",
                errors.newPassword ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 rtl:right-auto rtl:left-3"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-secondary-700 uppercase tracking-wider dark:text-secondary-300">
            {t("auth.resetPassword.confirmPassword") || "Confirm New Password"}
          </label>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={cn(
                "w-full rounded-xl border bg-secondary-50/50 py-2.5 pr-10 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white rtl:pr-10 rtl:pl-10",
                errors.confirmPassword ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
              )}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary-600 py-3 font-semibold text-white shadow-md hover:bg-primary-700"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating Password...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>{t("auth.resetPassword.submit") || "Update Password"}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  )
}
