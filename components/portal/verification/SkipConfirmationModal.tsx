"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ShieldAlert, ArrowRight, CheckCircle, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/Button"

interface SkipConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmSkip: () => void
  isSubmitting?: boolean
}

export function SkipConfirmationModal({
  isOpen,
  onClose,
  onConfirmSkip,
  isSubmitting = false,
}: SkipConfirmationModalProps) {
  const t = useTranslations()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/30 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl dark:border-amber-500/30 dark:bg-slate-900/95 sm:p-8"
        >
          {/* Ambient Glow Background Accent */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />

          {/* Close button top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 rtl:right-auto rtl:left-4 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Warning Icon Badge */}
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100/90 text-amber-600 shadow-inner ring-8 ring-amber-500/10 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-500/10">
              <ShieldAlert className="h-10 w-10 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {t("portal.verification.skipModal.title") || "تأكيد تخطي التوثيق"}
            </h3>

            {/* Core Requirement Notice Prompt (Arabic & English) */}
            <div className="my-3 rounded-2xl border border-amber-300/60 bg-amber-50/90 p-4 text-sm font-semibold leading-relaxed text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="font-bold">
                {t("portal.verification.skipModal.message") ||
                  "للتمتع بكامل خدمات المنصة وتفادي تقييد الحساب، يُرجى توثيق WhatsApp والبريد الإلكتروني للعمل"}
              </p>
            </div>

            <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
              {t("portal.verification.skipModal.subtext") ||
                "يمكنك استكمال التوثيق في أي وقت من لوحة التحكم أو ملف الشركة، لكن بعض العمليات الجمركية وعروض الأسعار قد تتطلب حساباً موثقاً مسبقاً."}
            </p>

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              {/* Primary Action: Verify Now (توثيق الآن) */}
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-500/35"
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{t("portal.verification.skipModal.verifyNowBtn") || "توثيق الآن"}</span>
                </span>
              </Button>

              {/* Secondary Action: Skip Now (تخطي الآن) */}
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={onConfirmSkip}
                className="rounded-2xl border-slate-300 bg-white/80 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{t("portal.verification.skipModal.skipBtn") || "تخطي الآن"}</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
