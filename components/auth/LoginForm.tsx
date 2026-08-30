"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
  User,
  Sparkles,
  Building2,
  FileText,
  Phone,
  CheckCircle2,
  LogIn,
  UserPlus,
} from "lucide-react"
import Image from "next/image"
import logoImg from "@/public/images/logo.png"
import { Link, useRouter } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { isBusinessEmail, evaluatePasswordStrength } from "@/lib/auth/password"
import { PasswordRequirements } from "@/components/auth/PasswordRequirements"

// Schema for Login
const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(true),
})

type LoginFormData = z.infer<typeof loginSchema>

// Schema for Registration
const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Valid email is required"),
    phone: z.string().min(8, "Phone number is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => evaluatePasswordStrength(val).isValid, {
        message: "Password does not meet all security requirements",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    companyName: z.string().min(2, "Company name is required"),
    commercialRegisterNumber: z.string().min(3, "Commercial Registration number is required"),
    taxCardNumber: z.string().min(3, "Tax Card number is required"),
    industry: z.string().default("Logistics & Trade"),
    city: z.string().default("Cairo"),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms of service",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

interface LoginFormProps {
  callbackUrl?: string
  initialMode?: "login" | "register"
}

export function LoginForm({ callbackUrl, initialMode = "login" }: LoginFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: true,
    },
  })

  // Register Form
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    watch: watchRegister,
    formState: { errors: regErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as any,
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
      confirmPassword: "",
    },
  })

  const registerPassword = watchRegister("password") || ""
  const registerConfirmPassword = watchRegister("confirmPassword") || ""
  const passwordsMatch =
    registerPassword.length > 0 &&
    registerConfirmPassword.length > 0 &&
    registerPassword === registerConfirmPassword

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
          rememberMe: data.rememberMe,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setServerError(result.error || "Login failed. Please check your credentials.")
        return
      }

      const role = result.user?.role
      const targetUrl = callbackUrl || (role === "staff" || role === "super_admin" ? "/admin" : "/portal")
      router.push(targetUrl)
      router.refresh()
    } catch {
      setServerError("A network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const onRegisterSubmit = async (data: RegisterFormData) => {
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

      // Transition immediately: remove form and navigate to verification
      setRegisterSuccess(true)
      router.push("/portal/verification")
      router.refresh()
    } catch {
      setServerError("A network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (registerSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-2xl border border-secondary-200/80 bg-white/95 p-8 text-center shadow-premium-xl backdrop-blur-xl dark:border-secondary-800/80 dark:bg-secondary-900/95"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
          {t("portal.verification.title") || "Security Verification"}
        </h2>
        <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
          {t("auth.register.redirectingToVerification") || "Redirecting to channel verification..."}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full rounded-2xl border border-secondary-200/80 bg-white/95 p-6 sm:p-8 shadow-premium-xl backdrop-blur-xl dark:border-secondary-800/80 dark:bg-secondary-900/95 transition-all duration-300",
        mode === "register" ? "max-w-2xl" : "max-w-md"
      )}
    >
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center gap-3">
          <div className="relative h-[58px] w-[58px] shrink-0">
            <Image
              src={logoImg}
              alt="NileLink Logistics"
              fill
              sizes="60px"
              priority
              className="object-contain"
            />
          </div>
          <span className="flex flex-col text-left rtl:text-right leading-none">
            <span className="text-xl font-bold tracking-wide text-secondary-900 dark:text-white">
              Nile Link
            </span>
            <span className="my-0.5 border-t border-primary-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.38em] text-secondary-500 dark:text-secondary-400">
              Logistics
            </span>
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-white">
          {registerSuccess
            ? (t("auth.register.title") || "Register New Company Account")
            : mode === "login"
            ? (t("auth.login.title") || "Client & Staff Portal Login")
            : (t("auth.register.title") || "Register New Company Account")}
        </h1>
        <p className="mt-1.5 text-xs text-secondary-600 dark:text-secondary-400">
          {registerSuccess
            ? (t("auth.register.redirectingToVerification") || "Redirecting to channel verification...")
            : mode === "login"
            ? (t("auth.login.subtitle") || "Access shipping operations, document verification & legal registry")
            : (t("auth.register.subtitle") || "Create an enterprise account to upload documents and track freight")}
        </p>
      </div>

      {!registerSuccess && (
        <>
          {/* Mode Switcher Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-xl border border-secondary-200 bg-secondary-100/60 p-1 dark:border-secondary-800 dark:bg-secondary-800/60">
            <button
              type="button"
              onClick={() => {
                setMode("login")
                setServerError(null)
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all",
                mode === "login"
                  ? "bg-white text-primary-600 shadow-sm dark:bg-secondary-900 dark:text-white"
                  : "text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
              )}
            >
              <LogIn className="h-4 w-4" />
              <span>{t("auth.login.tab") || "Sign In"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register")
                setServerError(null)
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all",
                mode === "register"
                  ? "bg-white text-primary-600 shadow-sm dark:bg-secondary-900 dark:text-white"
                  : "text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
              )}
            >
              <UserPlus className="h-4 w-4" />
              <span>{t("auth.register.tab") || "Register Account"}</span>
            </button>
          </div>

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
        </>
      )}

      {/* Registration Success View */}
      {registerSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-8 text-center"
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
            {t("auth.register.successTitle") || "Company Registered Successfully!"}
          </h3>
          <p className="mt-1 text-xs text-secondary-500">
            {t("auth.register.redirectingToVerification") || "Redirecting to channel verification..."}
          </p>
        </motion.div>
      )}

      {!registerSuccess && (
        <AnimatePresence mode="wait">
          {mode === "login" ? (
            /* ================= LOGIN MODE ================= */
            <motion.div
              key="login-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-secondary-700 uppercase tracking-wider dark:text-secondary-300">
                    {t("auth.login.identifier") || "Email or Username"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                    <input
                      type="text"
                      autoComplete="username"
                      placeholder={t("auth.login.identifierPlaceholder") || "name@company.com"}
                      {...registerLogin("identifier")}
                      className={cn(
                        "w-full rounded-xl border bg-slate-100/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 pr-4 pl-10 py-2.5 text-xs font-medium transition-all rtl:pr-10 rtl:pl-4",
                        loginErrors.identifier
                          ? "border-red-500 focus:border-red-500 dark:border-red-500"
                          : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                      )}
                    />
                  </div>
                  {loginErrors.identifier && (
                    <p className="mt-1 text-xs text-red-500">{loginErrors.identifier.message}</p>
                  )}
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider dark:text-secondary-300">
                      {t("auth.login.password") || "Password"}
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {t("auth.login.forgotPassword") || "Forgot password?"}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={t("auth.login.passwordPlaceholder") || "••••••••"}
                      {...registerLogin("password")}
                      className={cn(
                        "w-full rounded-xl border bg-secondary-50/80 py-2.5 pr-10 pl-10 text-xs font-medium text-secondary-900 placeholder:text-secondary-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800/90 dark:text-white dark:placeholder:text-secondary-500 dark:focus:bg-secondary-800 rtl:pr-10 rtl:pl-10",
                        loginErrors.password
                          ? "border-red-500 focus:border-red-500 dark:border-red-500"
                          : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rtl:right-auto rtl:left-3"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="mt-1 text-xs text-red-500">{loginErrors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    {...registerLogin("rememberMe")}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500 dark:border-secondary-700"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-secondary-600 dark:text-secondary-400 rtl:mr-2 rtl:ml-0">
                    {t("auth.login.rememberMe") || "Remember this device"}
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-primary-600 py-3 font-bold text-white shadow-md transition-all hover:bg-primary-700"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>{t("auth.login.submit") || "Sign In to Portal"}</span>
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            /* ================= REGISTER MODE ================= */
            <motion.div
              key="register-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-5">
                {/* Company Legal Section */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-wider dark:text-primary-400">
                    <Building2 className="h-4 w-4" />
                    <span>{t("auth.register.companySection") || "Company Legal Information"}</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                        {t("auth.register.companyName") || "Legal Company Name"} *
                      </label>
                      <input
                        type="text"
                        placeholder={t("auth.register.companyNamePlaceholder") || "e.g. Nile Logistics International S.A.E."}
                        {...registerRegister("companyName")}
                        className={cn(
                          "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                          regErrors.companyName
                            ? "border-red-500 focus:border-red-500 dark:border-red-500"
                            : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                        )}
                      />
                      {regErrors.companyName && <p className="mt-1 text-xs text-red-500">{regErrors.companyName.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                        {t("auth.register.crNumber") || "Commercial Register (CR) No."} *
                      </label>
                      <div className="relative">
                        <FileText className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                        <input
                          type="text"
                          placeholder="CR-12345"
                          {...registerRegister("commercialRegisterNumber")}
                          className={cn(
                            "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 pr-3.5 pl-9 py-2.5 text-xs font-medium transition-all rtl:pr-9 rtl:pl-3.5",
                            regErrors.commercialRegisterNumber
                              ? "border-red-500 focus:border-red-500 dark:border-red-500"
                              : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                          )}
                        />
                      </div>
                      {regErrors.commercialRegisterNumber && <p className="mt-1 text-xs text-red-500">{regErrors.commercialRegisterNumber.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                        {t("auth.register.taxNumber") || "Tax Card Number"} *
                      </label>
                      <div className="relative">
                        <FileText className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                        <input
                          type="text"
                          placeholder="TAX-98765"
                          {...registerRegister("taxCardNumber")}
                          className={cn(
                            "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 pr-3.5 pl-9 py-2.5 text-xs font-medium transition-all rtl:pr-9 rtl:pl-3.5",
                            regErrors.taxCardNumber
                              ? "border-red-500 focus:border-red-500 dark:border-red-500"
                              : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                          )}
                        />
                      </div>
                      {regErrors.taxCardNumber && <p className="mt-1 text-xs text-red-500">{regErrors.taxCardNumber.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Administrator Section */}
                <div className="border-t border-secondary-200 pt-3.5 dark:border-secondary-800">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-bold text-primary-600 uppercase tracking-wider dark:text-primary-400">
                    <User className="h-4 w-4" />
                    <span>{t("auth.register.personalSection") || "Account Administrator"}</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                        {t("auth.register.firstName") || "First Name"} *
                      </label>
                      <input
                        type="text"
                        placeholder="Ahmed"
                        {...registerRegister("firstName")}
                        className={cn(
                          "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                          regErrors.firstName
                            ? "border-red-500 focus:border-red-500 dark:border-red-500"
                            : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                        )}
                      />
                      {regErrors.firstName && <p className="mt-1 text-xs text-red-500">{regErrors.firstName.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                        {t("auth.register.lastName") || "Last Name"} *
                      </label>
                      <input
                        type="text"
                        placeholder="Hassan"
                        {...registerRegister("lastName")}
                        className={cn(
                          "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                          regErrors.lastName
                            ? "border-red-500 focus:border-red-500 dark:border-red-500"
                            : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                        )}
                      />
                      {regErrors.lastName && <p className="mt-1 text-xs text-red-500">{regErrors.lastName.message}</p>}
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
                          {...registerRegister("email")}
                          className={cn(
                            "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 pr-3.5 pl-9 py-2.5 text-xs font-medium transition-all rtl:pr-9 rtl:pl-3.5",
                            regErrors.email
                              ? "border-red-500 focus:border-red-500 dark:border-red-500"
                              : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                          )}
                        />
                      </div>
                      {regErrors.email && <p className="mt-1 text-xs text-red-500">{regErrors.email.message}</p>}
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
                          {...registerRegister("phone")}
                          className={cn(
                            "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 pr-3.5 pl-9 py-2.5 text-xs font-medium transition-all rtl:pr-9 rtl:pl-3.5",
                            regErrors.phone
                              ? "border-red-500 focus:border-red-500 dark:border-red-500"
                              : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                          )}
                        />
                      </div>
                      {regErrors.phone && <p className="mt-1 text-xs text-red-500">{regErrors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                        {t("auth.register.password") || "Password"} *
                      </label>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                        <input
                          type={showRegPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...registerRegister("password")}
                          className={cn(
                            "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 pr-10 pl-9 py-2.5 text-xs font-medium transition-all rtl:pr-9 rtl:pl-10",
                            regErrors.password
                              ? "border-red-500 focus:border-red-500 dark:border-red-500"
                              : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 rtl:right-auto rtl:left-3"
                          aria-label="Toggle password visibility"
                        >
                          {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {regErrors.password && <p className="mt-1 text-xs text-red-500">{regErrors.password.message}</p>}
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                          {t("auth.register.confirmPassword") || "Confirm Password"} *
                        </label>
                        {registerConfirmPassword.length > 0 && (
                          <span
                            className={cn(
                              "text-[10px] font-bold",
                              passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                            )}
                          >
                            {passwordsMatch
                              ? (t("auth.register.passwordMatch") || "Passwords match ✓")
                              : (t("auth.register.passwordMismatch") || "Passwords do not match")}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3 rtl:left-auto" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t("auth.register.confirmPasswordPlaceholder") || "Re-enter password"}
                          {...registerRegister("confirmPassword")}
                          className={cn(
                            "w-full rounded-xl border bg-secondary-50/80 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 pr-16 pl-9 py-2.5 text-xs font-medium transition-all rtl:pr-9 rtl:pl-16",
                            regErrors.confirmPassword
                              ? "border-red-500 focus:border-red-500 dark:border-red-500"
                              : passwordsMatch
                                ? "border-emerald-500 focus:border-emerald-500 dark:border-emerald-500"
                                : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700 dark:focus:border-primary-400"
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
                            aria-label="Toggle confirm password visibility"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      {regErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">{regErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <PasswordRequirements password={registerPassword} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    {...registerRegister("terms")}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="ml-2 block text-xs text-secondary-600 dark:text-secondary-400 rtl:mr-2 rtl:ml-0">
                    {t("auth.register.terms") || "I agree to the Terms of Service & Egyptian Customs Compliance Policies"}
                  </label>
                </div>
                {regErrors.terms && <p className="text-xs text-red-500">{regErrors.terms.message}</p>}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-primary-600 py-3 font-bold text-white shadow-md transition-all hover:bg-primary-700"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>{t("auth.register.submit") || "Complete Company Registration"}</span>
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}
