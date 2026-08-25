"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const forgotSchema = z.object({
  email: z.string().email("Valid email address is required"),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export function ForgotPasswordForm() {
  const t = useTranslations()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data: ForgotFormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        setServerError(result.error || "Failed to send reset link")
        return
      }

      setIsSubmitted(true)
    } catch {
      setServerError("A network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-secondary-200 bg-white p-8 text-center shadow-premium-xl dark:border-secondary-800 dark:bg-secondary-900"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
          {t("auth.forgotPassword.successTitle") || "Check Your Inbox"}
        </h2>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          {t("auth.forgotPassword.successDesc") || "If an account matches that email, we have sent instructions to reset your password."}
        </p>
        <div className="mt-6">
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              {t("auth.forgotPassword.backToLogin") || "Back to Login"}
            </Button>
          </Link>
        </div>
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
          {t("auth.forgotPassword.title") || "Reset Password"}
        </h1>
        <p className="mt-1.5 text-sm text-secondary-600 dark:text-secondary-400">
          {t("auth.forgotPassword.subtitle") || "Enter your registered email address to receive recovery instructions"}
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
            {t("auth.forgotPassword.email") || "Registered Email"}
          </label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
            <input
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              className={cn(
                "w-full rounded-xl border bg-secondary-50/50 py-2.5 pr-4 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white rtl:pr-10 rtl:pl-4",
                errors.email ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
              )}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary-600 py-3 font-semibold text-white shadow-md hover:bg-primary-700"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>{t("auth.forgotPassword.submit") || "Send Recovery Link"}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-xs font-medium text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1 rtl:rotate-180" />
          {t("auth.forgotPassword.backToLogin") || "Back to Login"}
        </Link>
      </div>
    </motion.div>
  )
}
