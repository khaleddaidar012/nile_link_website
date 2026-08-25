"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Clock, FileText, CheckCircle2, AlertTriangle, Send, CreditCard } from "lucide-react"

interface ActivityItem {
  id: string
  title: string
  description: string
  timeAgo: string
  type: "upload" | "approve" | "warning" | "request" | "payment"
}

export function RecentActivityFeed() {
  const t = useTranslations()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch notifications/activities for client
    fetch("/api/portal/notifications?limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications && data.notifications.length > 0) {
          setActivities(
            data.notifications.map((n: { _id: string; title: string; message: string; createdAt: string; type: string }) => ({
              id: n._id,
              title: n.title,
              description: n.message,
              timeAgo: new Date(n.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }),
              type: n.type.includes("approve")
                ? "approve"
                : n.type.includes("expir")
                  ? "warning"
                  : "upload",
            }))
          )
        } else {
          setActivities([])
        }
      })
      .catch(() => setActivities([]))
      .finally(() => setLoading(false))
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "approve":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-indigo-500" />
      case "request":
        return <Send className="h-4 w-4 text-primary-500" />
      default:
        return <FileText className="h-4 w-4 text-primary-500" />
    }
  }

  return (
    <div className="rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-premium-sm dark:border-secondary-800 dark:bg-secondary-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-secondary-900 dark:text-white">
          {t("portal.dashboard.recentActivity") || "Recent Activity Timeline"}
        </h3>
        <Clock className="h-4 w-4 text-secondary-400" />
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-secondary-400">Loading activity...</div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-secondary-400">
          {t("portal.dashboard.noActivity") || "No recent activity recorded."}
        </div>
      ) : (
        <div className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-secondary-200 dark:before:bg-secondary-800 rtl:before:right-3.5 rtl:before:left-auto">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start gap-3 pl-8 rtl:pr-8 rtl:pl-0">
              <div className="absolute top-0.5 left-1.5 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-white ring-4 ring-white dark:bg-secondary-900 dark:ring-secondary-900 rtl:right-1.5 rtl:left-auto rtl:translate-x-1/2">
                {getIcon(act.type)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-secondary-900 dark:text-white">
                  {act.title}
                </p>
                <p className="mt-0.5 text-[11px] text-secondary-500 line-clamp-2">
                  {act.description}
                </p>
                <span className="mt-1 block text-[10px] text-secondary-400">
                  {act.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
