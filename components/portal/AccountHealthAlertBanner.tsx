"use client"

import { useTranslations } from "next-intl"
import { ShieldCheck, AlertTriangle, XCircle, ArrowRight, UploadCloud, RefreshCw } from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

export function AccountHealthAlertBanner() {
  const t = useTranslations()
  const { customer, documentStats } = usePortal()

  if (!customer) return null

  if (customer.accountStatus === "active" && (!documentStats || documentStats.expiringDocs === 0)) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-5 text-emerald-950 shadow-sm dark:text-emerald-200">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              {t("portal.healthBanners.allValid") || "All Company Documents Verified & Up to Date"}
            </h2>
            <p className="mt-0.5 text-xs text-emerald-700/90 dark:text-emerald-400/90">
              Your account is in full compliance with Egyptian maritime customs & cargo regulations.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (customer.accountStatus === "warning" || (documentStats && documentStats.expiringDocs > 0)) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-5 text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:text-amber-200">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-sm">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
              {t("portal.healthBanners.warning") || "Document Expiry Notice — Renewal Required Soon"}
            </h2>
            <p className="mt-0.5 text-xs text-amber-800/90 dark:text-amber-300/90 max-w-xl">
              {customer.statusReason ||
                "You have legal documents expiring within the next 10 days. Upload renewed certificates to avoid clearance holds."}
            </p>
          </div>
        </div>
        <Link href="/portal/documents">
          <Button size="sm" className="shrink-0 rounded-xl bg-amber-600 font-semibold text-white shadow hover:bg-amber-700">
            <UploadCloud className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
            <span>{t("portal.healthBanners.uploadBtn") || "Upload Renewal Files"}</span>
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent p-5 text-rose-950 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:text-rose-200">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-sm">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-rose-950 dark:text-rose-200">
            {t("portal.healthBanners.critical") || "Account Restricted — Expired Legal Documents"}
          </h2>
          <p className="mt-0.5 text-xs text-rose-800/90 dark:text-rose-300/90 max-w-xl">
            {customer.statusReason ||
              "One or more mandatory documents have expired. Please upload valid certificates immediately to lift restrictions."}
          </p>
        </div>
      </div>
      <Link href="/portal/documents">
        <Button size="sm" className="shrink-0 rounded-xl bg-rose-600 font-semibold text-white shadow hover:bg-rose-700">
          <RefreshCw className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
          <span>{t("portal.healthBanners.renewBtn") || "Renew Expired Document"}</span>
        </Button>
      </Link>
    </div>
  )
}
