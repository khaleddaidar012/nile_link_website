"use client"

import { useTranslations } from "next-intl"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"

interface UrgentExpiryTickerProps {
  urgentCount: number
}

export function UrgentExpiryTicker({ urgentCount }: UrgentExpiryTickerProps) {
  const t = useTranslations()

  if (urgentCount <= 0) return null

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4 text-amber-200 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-sm font-bold">
            ⚠️ Urgent Expiry Alert: {urgentCount} documents will expire within the next 10 days
          </h2>
          <p className="text-xs text-amber-300/80">
            Automated alerts are queued. You can also send immediate manual warnings via Email and WhatsApp.
          </p>
        </div>
      </div>
      <Link href="/admin/customers">
        <Button size="sm" className="shrink-0 bg-amber-600 font-semibold text-white hover:bg-amber-700">
          <span>{t("admin.dashboard.reviewCta") || "Inspect Clients"}</span>
          <ArrowRight className="ml-1.5 h-4 w-4 rtl:mr-1.5 rtl:ml-0 rtl:rotate-180" />
        </Button>
      </Link>
    </div>
  )
}
