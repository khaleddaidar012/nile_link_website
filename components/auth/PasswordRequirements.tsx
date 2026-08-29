"use client"

import { useMemo } from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, ShieldAlert, ShieldCheck } from "lucide-react"
import { evaluatePasswordStrength } from "@/lib/auth/password"
import { cn } from "@/lib/utils"

interface PasswordRequirementsProps {
  password?: string
  className?: string
}

export function PasswordRequirements({ password = "", className }: PasswordRequirementsProps) {
  const t = useTranslations()
  const locale = useLocale()
  const criteria = useMemo(() => evaluatePasswordStrength(password), [password])

  const requirements = [
    {
      id: "length",
      label: t("auth.passwordRules.min8") || "At least 8 characters",
      met: criteria.minLength,
    },
    {
      id: "upper",
      label: t("auth.passwordRules.uppercase") || "At least one uppercase letter (A-Z)",
      met: criteria.hasUpper,
    },
    {
      id: "lower",
      label: t("auth.passwordRules.lowercase") || "At least one lowercase letter (a-z)",
      met: criteria.hasLower,
    },
    {
      id: "number",
      label: t("auth.passwordRules.number") || "At least one number (0-9)",
      met: criteria.hasNumber,
    },
    {
      id: "special",
      label: t("auth.passwordRules.special") || "At least one special symbol (!@#$%^&*)",
      met: criteria.hasSpecial,
    },
  ]

  // Determine strength label & color
  const getStrengthInfo = () => {
    if (criteria.strengthScore === 0) {
      return {
        label: t("auth.passwordRules.empty") || "Empty",
        color: "bg-slate-300 dark:bg-slate-700",
        badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
      }
    }
    if (criteria.strengthScore < 50) {
      return {
        label: t("auth.passwordRules.weak") || "Weak",
        color: "bg-rose-500",
        badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
      }
    }
    if (criteria.strengthScore < 85) {
      return {
        label: t("auth.passwordRules.medium") || "Medium",
        color: "bg-amber-500",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
      }
    }
    return {
      label: t("auth.passwordRules.strong") || "Strong & Secure",
      color: "bg-emerald-500",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    }
  }

  const strength = getStrengthInfo()

  return (
    <div
      className={cn(
        "mt-2.5 rounded-xl border border-secondary-200/80 bg-secondary-50/70 p-3 text-xs backdrop-blur-sm dark:border-secondary-800 dark:bg-secondary-900/60 transition-all",
        className
      )}
    >
      {/* Strength Bar */}
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-secondary-700 dark:text-secondary-300 text-[11px] uppercase tracking-wider">
          {criteria.isValid ? (
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
          )}
          <span>{t("auth.passwordRules.securityTitle") || "Password Security"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md transition-colors",
              strength.badge
            )}
          >
            {strength.label}
          </span>
        </div>
      </div>

      {/* Visual meter */}
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary-200/80 dark:bg-secondary-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${criteria.strengthScore}%` }}
          transition={{ duration: 0.3 }}
          className={cn("h-full rounded-full transition-colors", strength.color)}
        />
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {requirements.map((req) => (
          <div
            key={req.id}
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-medium transition-colors",
              req.met
                ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                : "text-secondary-500 dark:text-secondary-400"
            )}
          >
            <AnimatePresence mode="wait">
              {req.met ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="cross"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-secondary-400 dark:text-secondary-600" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="leading-tight">{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
