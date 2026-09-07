"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { Send, Plus, Search, Clock, CheckCircle2, AlertCircle, RefreshCw, X, Ship, FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "@/navigation"
import { cn } from "@/lib/utils"

export default function PortalRequestsPage() {
  const t = useTranslations()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/portal/requests")
      const data = await res.json()
      if (data.requests) setRequests(data.requests)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])



  return (
    <div className="flex flex-col">
      <PortalHeader
        title={t("portal.sidebar.requests") || "Service Inquiries & Operations"}
        subtitle={t("portal.requests.subtitle") || "Track live shipments, customs clearances, and operations inquiries in real time"}
      />

      <div className="space-y-6 p-6 sm:p-8">
        {/* Action Header */}
        <div className="flex flex-col gap-3 rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-secondary-800 dark:bg-secondary-900">
          <div>
            <h2 className="text-base font-bold text-secondary-900 dark:text-white">{t("portal.requests.activeRequests")}</h2>
            <p className="text-xs text-secondary-500">{t("portal.requests.activeRequestsSub")}</p>
          </div>
          <Link
            href="/portal/requests/new"
            className="flex items-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 transition-colors"
          >
            <Plus className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
            <span>{t("portal.requests.newRequest")}</span>
          </Link>
        </div>

        {/* Requests Master Table */}
        <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs rtl:text-right">
              <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
                <tr>
                  <th className="px-5 py-3.5">{t("portal.requests.colTracking")}</th>
                  <th className="px-4 py-3.5">{t("portal.requests.colService")}</th>
                  <th className="px-4 py-3.5">{t("portal.requests.colSubject")}</th>
                  <th className="px-4 py-3.5">{t("portal.requests.colPriority")}</th>
                  <th className="px-4 py-3.5">{t("portal.requests.colStatus")}</th>
                  <th className="px-5 py-3.5 text-right rtl:text-left">{t("portal.requests.colTimeline")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondary-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                        <span>{t("portal.requests.loading")}</span>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-400 dark:bg-secondary-800 dark:text-secondary-500">
                        <Send className="h-7 w-7" />
                      </div>
                      <p className="mt-3 text-sm font-bold text-secondary-900 dark:text-white">{t("portal.requests.empty")}</p>
                      <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400 max-w-sm mx-auto">{t("portal.requests.emptySub")}</p>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="group hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-primary-600 dark:text-primary-400 text-sm">
                        <Link href={`/portal/requests/${req._id}`} className="hover:underline">
                          {req.trackingNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-4 capitalize font-medium text-secondary-700 dark:text-secondary-300">
                        {req.services && req.services.length > 0
                          ? req.services.map((s: any) => t(`portal.requests.new.${s.serviceKey}`) || s.serviceKey.replace(/_/g, " ")).join(" + ")
                          : (req.serviceType ? (t(`portal.requests.serviceType_${req.serviceType}`) || req.serviceType.replace(/_/g, " ")) : t("common.details"))}
                      </td>
                      <td className="px-4 py-4 font-bold text-secondary-900 dark:text-white">
                        {req.subject}
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase",
                          req.priority === "urgent" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" :
                          req.priority === "high" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300" :
                          "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                        )}>
                          {t(`portal.requests.priority_${req.priority}`) || req.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary-500/20 bg-primary-50 px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                          <Clock className="h-3 w-3" />
                          <span className="capitalize">{t(`portal.requests.status_${req.status}`) || req.status.replace("_", " ")}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right rtl:text-left">
                        <Link
                          href={`/portal/requests/${req._id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-secondary-200 bg-white px-3 py-1.5 text-xs font-semibold text-secondary-700 shadow-sm transition-colors hover:bg-secondary-100 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700"
                        >
                          <span>{t("portal.requests.viewMilestones") || "View Details"}</span>
                          <ChevronRight className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0 rtl:rotate-180" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
