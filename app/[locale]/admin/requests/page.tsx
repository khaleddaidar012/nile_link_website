"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Search, Clock, RefreshCw, Layers, Edit } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { Link } from "@/navigation"

export default function AdminRequestsPage() {
  const t = useTranslations()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/requests")
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
      <AdminHeader
        title={t("admin.sidebar.requests") || "Client Service Requests"}
        subtitle={t("admin.requests.subtitle") || "Manage and process incoming service requests from clients"}
      />

      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-secondary-800 dark:bg-secondary-900">
          <div>
            <h2 className="text-base font-bold text-secondary-900 dark:text-white">
              {t("admin.requests.title") || "Master Requests Queue"}
            </h2>
            <p className="text-xs text-secondary-500">
              {t("admin.requests.desc") || "Review client requests, update statuses, and add timeline milestones"}
            </p>
          </div>
          <Button
            onClick={fetchRequests}
            variant="outline"
            className="rounded-xl font-semibold transition-colors"
          >
            <RefreshCw className={cn("mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5", loading && "animate-spin")} />
            <span>{t("admin.requests.refresh") || "Refresh Data"}</span>
          </Button>
        </div>

        {/* Requests Master Table */}
        <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs rtl:text-right">
              <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
                <tr>
                  <th className="px-5 py-3.5">{t("admin.requests.colCompany") || "Client / Company"}</th>
                  <th className="px-4 py-3.5">{t("admin.requests.colTracking") || "Tracking & Subject"}</th>
                  <th className="px-4 py-3.5">{t("admin.requests.colService") || "Service Type"}</th>
                  <th className="px-4 py-3.5">{t("admin.requests.colPriority") || "Priority"}</th>
                  <th className="px-4 py-3.5">{t("admin.requests.colStatus") || "Status"}</th>
                  <th className="px-5 py-3.5 text-right rtl:text-left">{t("admin.requests.colActions") || "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondary-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                        <span>{t("admin.requests.loading") || "Loading requests..."}</span>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-400 dark:bg-secondary-800 dark:text-secondary-500">
                        <Layers className="h-7 w-7" />
                      </div>
                      <p className="mt-3 text-sm font-bold text-secondary-900 dark:text-white">
                        {t("admin.requests.empty") || "No requests found"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="group hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <span className="block font-bold text-secondary-900 dark:text-white text-sm">
                          {req.customerId?.companyName || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="block font-mono font-bold text-primary-600 dark:text-primary-400 text-xs mb-0.5">
                          {req.trackingNumber}
                        </span>
                        <span className="block font-medium text-secondary-700 dark:text-secondary-300">
                          {req.subject}
                        </span>
                      </td>
                      <td className="px-4 py-4 capitalize font-medium text-secondary-700 dark:text-secondary-300">
                        {t(`portal.requests.serviceType_${req.serviceType}`) || req.serviceType.replace("_", " ")}
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
                        <Link href={`/admin/requests/${req._id}`}>
                          <Button
                            size="sm"
                            className="rounded-xl text-xs font-semibold bg-primary-600 text-white hover:bg-primary-700"
                          >
                            <Edit className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                            <span>{t("admin.requests.viewDetails") || "View Details"}</span>
                          </Button>
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
