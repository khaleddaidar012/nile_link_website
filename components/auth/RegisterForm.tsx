"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Building2, User, Mail, Lock, Phone, FileText, CheckCircle2, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { Link, useRouter } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid business email is required"),
  phone: z.string().min(8, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2, "Company name is required"),
  commercialRegisterNumber: z.string().min(3, "Commercial Registration number is required"),
  taxCardNumber: z.string().min(3, "Tax Card number is required"),
  industry: z.string().default("Logistics & Trade"),
  city: z.string().default("Cairo"),
  terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the terms of service",
  }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const t = useTranslations()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      companyName: "",
      commercialRegisterNumber: "",
      taxCardNumber: "",
      industry: "Logistics & Trade",
      city: "Cairo",
      terms: true,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setServerError(result.error || "Registration failed. Please review your information.")
        return
      }

      setIsSuccess(true)
      setTimeout(() => {
        router.push("/portal")
        router.refresh()
      }, 2000)
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
        className="w-full max-w-lg rounded-2xl border border-secondary-200 bg-white p-8 text-center shadow-premium-xl dark:border-secondary-800 dark:bg-secondary-900"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t("auth.register.title") || "Registration Successful!"}
        </h2>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          Your company account has been created. Redirecting to the NileLink Client Portal...
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl rounded-2xl border border-secondary-200/80 bg-white/95 p-8 shadow-premium-xl backdrop-blur-xl dark:border-secondary-800/80 dark:bg-secondary-900/95"
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-white">
          {t("auth.register.title") || "Create Enterprise Account"}
        </h1>
        <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
          {t("auth.register.subtitle") || "Register your company for NileLink digital freight & document services"}
        </p>
      </div>

      {serverError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information Section */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-wider dark:text-primary-400">
            <Building2 className="h-4 w-4" />
            <span>{t("auth.register.companySection") || "Company Legal Information"}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.register.companyName") || "Legal Company Name"} *
              </label>
              <input
                type="text"
                placeholder="e.g. Nile Logistics International S.A.E."
                {...register("companyName")}
                className={cn(
                  "w-full rounded-xl border bg-secondary-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white",
                  errors.companyName ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
                )}
              />
              {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.register.crNumber") || "Commercial Register (CR) No."} *
              </label>
              <div className="relative">
                <FileText className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  placeholder="123456"
                  {...register("commercialRegisterNumber")}
                  className={cn(
                    "w-full rounded-xl border bg-secondary-50/50 pr-3.5 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white rtl:pr-10 rtl:pl-3.5",
                    errors.commercialRegisterNumber ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
                  )}
                />
              </div>
              {errors.commercialRegisterNumber && <p className="mt-1 text-xs text-red-500">{errors.commercialRegisterNumber.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.register.taxNumber") || "Tax Card Number"} *
              </label>
              <div className="relative">
                <FileText className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  placeholder="987-654-321"
                  {...register("taxCardNumber")}
                  className={cn(
                    "w-full rounded-xl border bg-secondary-50/50 pr-3.5 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white rtl:pr-10 rtl:pl-3.5",
                    errors.taxCardNumber ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
                  )}
                />
              </div>
              {errors.taxCardNumber && <p className="mt-1 text-xs text-red-500">{errors.taxCardNumber.message}</p>}
            </div>
          </div>
        </div>

        {/* Account Administrator Section */}
        <div className="border-t border-secondary-200 pt-4 dark:border-secondary-800">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-wider dark:text-primary-400">
            <User className="h-4 w-4" />
            <span>{t("auth.register.personalSection") || "Account Administrator"}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.register.firstName") || "First Name"} *
              </label>
              <input
                type="text"
                placeholder="Ahmed"
                {...register("firstName")}
                className={cn(
                  "w-full rounded-xl border bg-secondary-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white",
                  errors.firstName ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
                )}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.register.lastName") || "Last Name"} *
              </label>
              <input
                type="text"
                placeholder="Hassan"
                {...register("lastName")}
                className={cn(
                  "w-full rounded-xl border bg-secondary-50/50 px-3.5 py-2.5 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white",
                  errors.lastName ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
                )}
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.register.email") || "Work Email"} *
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                <input
                  type="email"
                  placeholder="admin@company.com"
                  {...register("email")}
                  className={cn(
                    "w-full rounded-xl border bg-secondary-50/50 pr-3.5 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white rtl:pr-10 rtl:pl-3.5",
                    errors.email ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
                  )}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.register.phone") || "Mobile Phone (WhatsApp Enabled)"} *
              </label>
              <div className="relative">
                <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                <input
                  type="tel"
                  placeholder="+20 10 0000 0000"
                  {...register("phone")}
                  className={cn(
                    "w-full rounded-xl border bg-secondary-50/50 pr-3.5 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white rtl:pr-10 rtl:pl-3.5",
                    errors.phone ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
                  )}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                {t("auth.register.password") || "Password (min 8 chars, 1 uppercase, 1 number)"} *
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "w-full rounded-xl border bg-secondary-50/50 pr-3.5 pl-10 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/50 dark:text-white rtl:pr-10 rtl:pl-3.5",
                    errors.password ? "border-red-500" : "border-secondary-200 dark:border-secondary-700"
                  )}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            {...register("terms")}
            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="terms" className="ml-2 block text-xs text-secondary-600 dark:text-secondary-400 rtl:mr-2 rtl:ml-0">
            {t("auth.register.terms") || "I agree to the Terms of Service and Privacy Policy"}
          </label>
        </div>
        {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary-700"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Registering Company...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>{t("auth.register.submit") || "Complete Registration"}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 border-t border-secondary-200 pt-4 text-center text-xs text-secondary-600 dark:border-secondary-800 dark:text-secondary-400">
        {t("auth.register.hasAccount") || "Already registered?"}{" "}
        <Link
          href="/login"
          className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
        >
          {t("auth.register.loginLink") || "Sign In"}
        </Link>
      </div>
    </motion.div>
  )
}
