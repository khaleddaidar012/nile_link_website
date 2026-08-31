"use client"

import { useTranslations } from "next-intl"
import { UploadCloud, ArrowRight } from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { usePortal } from "./PortalContext"

export function QuickUploadWidget() {
  const t = useTranslations()
  const { loading } = usePortal()

  if (loading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60"></div>
    )
  }

  return (
    <div className="rounded-2xl border border-secondary-200/80 bg-gradient-to-br from-primary-900/90 to-secondary-900 p-6 text-white shadow-premium-md dark:border-secondary-800">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
        <UploadCloud className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold">
        {t("portal.dashboard.quickUpload") || "Quick Document Upload"}
      </h3>
      <p className="mt-1 text-xs text-white/70">
        {t("portal.dashboard.quickUploadDesc") || "Upload your Commercial Register, Tax Card, or licenses in seconds."}
      </p>
      <div className="mt-5">
        <Link href="/portal/documents">
          <Button size="sm" className="w-full rounded-xl bg-white text-secondary-900 shadow hover:bg-white/90 font-semibold">
            <span>{t("portal.dashboard.manageUploadBtn") || "Manage & Upload Documents"}</span>
            <ArrowRight className="ml-1.5 h-4 w-4 rtl:mr-1.5 rtl:ml-0 rtl:rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
