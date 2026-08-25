"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { Bell, Check, Clock, AlertTriangle, AlertCircle, Info, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "@/navigation"
import { usePortal } from "@/components/portal/PortalContext"

export default function PortalNotificationsPage() {
  const t = useTranslations()
  const { refreshData } = usePortal()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/portal/notifications?limit=50")
      const data = await res.json()
      if (data.notifications) setNotifications(data.notifications)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [])

  const markAllRead = async () => {
    await fetch("/api/portal/notifications/mark-read", { method: "POST" })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    refreshData()
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-rose-500" />
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return <Info className="h-4 w-4 text-primary-500" />
    }
  }

  return (
    <div className="flex flex-col">
      <PortalHeader
        title={t("portal.sidebar.notifications") || "Notification Center"}
        subtitle="Stay updated on document reviews, approvals, expirations & operations"
      />

      <div className="space-y-6 p-6 sm:p-8">
        <div className="rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
          <div className="mb-4 flex items-center justify-between border-b border-secondary-100 pb-3 dark:border-secondary-800">
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white">All Notifications</h3>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={markAllRead} className="text-xs">
                <Check className="mr-1 h-3 w-3 rtl:mr-0 rtl:ml-1" />
                <span>Mark All Read</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-xs text-secondary-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-secondary-400">
                <Bell className="mx-auto h-8 w-8 text-secondary-300 dark:text-secondary-700" />
                <p className="mt-2 text-sm font-semibold text-secondary-700 dark:text-secondary-300">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start gap-3.5 rounded-xl border p-4 transition-colors ${
                    !n.isRead
                      ? "border-primary-200 bg-primary-50/40 dark:border-primary-900/40 dark:bg-primary-950/20"
                      : "border-secondary-200/60 bg-white dark:border-secondary-800 dark:bg-secondary-900"
                  }`}
                >
                  <div className="mt-0.5">{getSeverityIcon(n.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-secondary-900 dark:text-white">{n.title}</h4>
                      <span className="text-[10px] text-secondary-400">
                        {new Date(n.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">{n.message}</p>
                    {n.actionUrl && (
                      <Link
                        href={n.actionUrl}
                        className="mt-2 inline-block text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
                      >
                        View Related Item →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
