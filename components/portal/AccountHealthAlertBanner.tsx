"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ArrowRight,
  UploadCloud,
  RefreshCw,
  PhoneCall,
  Mail,
  ShieldAlert,
  FileCheck,
  X,
} from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

export function AccountHealthAlertBanner() {
  const t = useTranslations()
  const { user, customer, documentStats, loading } = usePortal()
  const [isDismissed, setIsDismissed] = useState(false)

  if (loading || !customer || !user) {
    return (
      <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60"></div>
    )
  }

  const isChannelsUnverified = !user?.emailVerified
  const hasNoDocsUploaded = !documentStats || documentStats.totalDocs === 0

  // 1. UNVERIFIED ACCOUNT STATE (Mandatory Business Email Verification)
  if (isChannelsUnverified) {
    return (
      <div className="space-y-4">
        {/* Amber Channel Verification Warning Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent p-5 text-amber-950 shadow-md backdrop-blur-md dark:border-amber-500/40 dark:bg-slate-900/90 dark:text-amber-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 shadow-inner ring-4 ring-amber-500/10 dark:bg-amber-950/60 dark:text-amber-400">
                <AlertTriangle className="h-6 w-6 animate-pulse text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-amber-950 dark:text-amber-200">
                    {t("portal.healthBanners.unverifiedTitle") || "لم يتم توثيق بريد العمل"}
                  </h2>
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    {t("portal.verification.unverified") || "إجباري"}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-amber-900/90 dark:text-amber-300/90 max-w-2xl leading-relaxed">
                  {t("portal.healthBanners.unverifiedDesc") ||
                    "يرجى توثيق بريد العمل الإلكتروني عبر رمز التفعيل (OTP) لاستكمال إعداد الحساب واستلام إشعارات الشحن والجمارك."}
                </p>
              </div>
            </div>

            <Link href="/portal/verification">
              <Button
                size="sm"
                className="shrink-0 rounded-xl bg-amber-600 font-bold text-white shadow-md transition-all hover:bg-amber-700 hover:shadow-amber-500/25"
              >
                <ShieldAlert className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
                <span>{t("portal.healthBanners.verifyChannelsBtn") || "توثيق القنوات الآن"}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick-Action Document Compliance Card */}
        <div className="relative overflow-hidden rounded-2xl border border-primary-500/30 bg-white/90 p-5 shadow-md backdrop-blur-xl dark:border-primary-500/20 dark:bg-slate-900/90">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 shadow-sm">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {t("portal.healthBanners.quickActionTitle") ||
                    "مطلوب رفع مستندات توثيق الحساب"}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  {t("portal.healthBanners.quickActionDesc") ||
                    "يرجى رفع المستندات الرسمية للشركة (السجل التجاري، البطاقة الضريبية) لبدء اعتماد الحساب والتخفيض الجمركي."}
                </p>
              </div>
            </div>

            <Link href="/portal/documents">
              <Button
                size="sm"
                className="shrink-0 rounded-xl bg-primary-600 font-black text-white shadow-md shadow-primary-500/20 transition-all hover:bg-primary-700 hover:shadow-primary-500/30"
              >
                <UploadCloud className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
                <span>{t("portal.healthBanners.uploadDocsBtn") || "رفع المستندات الآن"}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 2. BRAND NEW ACCOUNT (0 Documents Uploaded Yet)
  if (hasNoDocsUploaded) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-primary-500/30 bg-white/90 p-5 shadow-md backdrop-blur-xl dark:border-primary-500/20 dark:bg-slate-900/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 shadow-sm">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {t("portal.healthBanners.newAccountUploadTitle") ||
                  "مطلوب رفع مستندات توثيق الحساب"}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {t("portal.healthBanners.newAccountUploadDesc") ||
                  "يرجى رفع المستندات الرسمية للشركة (السجل التجاري، البطاقة الضريبية، رخصة الاستيراد/التصدير) لبدء التوثيق الجمركي."}
              </p>
            </div>
          </div>

          <Link href="/portal/documents">
            <Button
              size="sm"
              className="shrink-0 rounded-xl bg-primary-600 font-black text-white shadow-md shadow-primary-500/20 transition-all hover:bg-primary-700 hover:shadow-primary-500/30"
            >
              <UploadCloud className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
              <span>{t("portal.healthBanners.uploadDocsBtn") || "رفع المستندات الآن"}</span>
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // 3. ACTIVE & FULLY COMPLIANT STATE
  if (customer.accountStatus === "active" && documentStats.expiringDocs === 0 && documentStats.expiredDocs === 0) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-5 text-emerald-950 shadow-sm dark:text-emerald-200">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              {t("portal.healthBanners.allValid") || "جميع مستندات الشركة معتمدة وسارية المفعول"}
            </h2>
            <p className="mt-0.5 text-xs text-emerald-700/90 dark:text-emerald-400/90">
              {t("portal.healthBanners.allValidSub") || "حساب شركتكم متوافق بالكامل مع متطلبات التخليص الجمركي البحري."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 4. WARNING STATE (Document Expirations Soon)
  if (documentStats.expiringDocs > 0) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-5 text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:text-amber-200">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-sm">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
              {t("portal.healthBanners.warning") || "تنبيه: لديك مستندات قريبة من الانتهاء — يرجى التجديد قريباً"}
            </h2>
            <p className="mt-0.5 text-xs text-amber-800/90 dark:text-amber-300/90 max-w-xl">
              {customer.statusReason ||
                "لديك مستندات قانونية تنتهي خلال 10 أيام. يرجى رفع الملفات المجددة لتجنب توقف المعاملات الجمركية."}
            </p>
          </div>
        </div>
        <Link href="/portal/documents">
          <Button size="sm" className="shrink-0 rounded-xl bg-amber-600 font-semibold text-white shadow hover:bg-amber-700">
            <UploadCloud className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
            <span>{t("portal.healthBanners.uploadBtn") || "تجديد المستندات"}</span>
          </Button>
        </Link>
      </div>
    )
  }

  // 5. CRITICAL RESTRICTED STATE (Expired Documents)
  if (isDismissed) return null;

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent p-5 pr-8 text-rose-950 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:text-rose-200">
      <button 
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 hover:text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        title="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-sm">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-rose-950 dark:text-rose-200">
            {t("portal.healthBanners.critical") || "تنبيه حرج: مستندات رسمية منتهية الصلاحية"}
          </h2>
          <p className="mt-0.5 text-xs text-rose-800/90 dark:text-rose-300/90 max-w-xl">
            {customer.statusReason ||
              "انتهت صلاحية واحد أو أكثر من مستندات الشركة. يرجى رفع المستندات السارية فوراً لرفع التقييد."}
          </p>
        </div>
      </div>
      <Link href="/portal/documents" className="rtl:ml-10 ltr:mr-10 mt-2 sm:mt-0">
        <Button size="sm" className="shrink-0 rounded-xl bg-rose-600 font-semibold text-white shadow hover:bg-rose-700">
          <RefreshCw className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
          <span>{t("portal.healthBanners.renewBtn") || "تجديد المستند المنتهي"}</span>
        </Button>
      </Link>
    </div>
  )
}
