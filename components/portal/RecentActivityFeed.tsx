"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Clock, FileText, CheckCircle2, AlertTriangle, Send, CreditCard, ShieldCheck } from "lucide-react"

interface ActivityItem {
  id: string
  title: string
  description: string
  timeAgo: string
  type: "upload" | "approve" | "warning" | "request" | "payment" | "verify"
  rawType?: string
}

export function RecentActivityFeed() {
  const t = useTranslations()
  const locale = useLocale()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/notifications?limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications && data.notifications.length > 0) {
          setActivities(
            data.notifications.map((n: { _id: string; title: string; message: string; createdAt: string; type: string }) => {
              const typeLower = (n.type || "").toLowerCase()
              let actType: ActivityItem["type"] = "upload"

              if (typeLower.includes("approve")) actType = "approve"
              else if (typeLower.includes("expir") || typeLower.includes("warn")) actType = "warning"
              else if (typeLower.includes("verif") || typeLower.includes("channel")) actType = "verify"
              else if (typeLower.includes("pay") || typeLower.includes("inv")) actType = "payment"
              else if (typeLower.includes("req")) actType = "request"

              const date = new Date(n.createdAt)
              const formattedDate = date.toLocaleDateString(locale === "ar" ? "ar-EG" : locale, {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })

              return {
                id: n._id,
                title: n.title,
                description: n.message,
                timeAgo: formattedDate,
                type: actType,
                rawType: n.type,
              }
            })
          )
        } else {
          // Provide default sample activities if no notifications exist yet
          const now = new Date()
          const sampleDate = now.toLocaleDateString(locale === "ar" ? "ar-EG" : locale, {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })

          setActivities([
            {
              id: "act-1",
              title: t("portal.dashboard.activity.accountCreatedTitle") || "Corporate Account Registered",
              description: t("portal.dashboard.activity.accountCreatedDesc") || "Account created and ready for compliance verification",
              timeAgo: sampleDate,
              type: "verify",
            },
            {
              id: "act-2",
              title: t("portal.dashboard.activity.uploadGuideTitle") || "Document Upload Guidelines",
              description: t("portal.dashboard.activity.uploadGuideDesc") || "Please upload your Commercial Register and Tax Card for clearance approval",
              timeAgo: sampleDate,
              type: "upload",
            },
          ])
        }
      })
      .catch(() => setActivities([]))
      .finally(() => setLoading(false))
  }, [t, locale])

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
      case "verify":
        return <ShieldCheck className="h-4 w-4 text-cyan-500" />
      default:
        return <FileText className="h-4 w-4 text-primary-500" />
    }
  }

  const getLocalizedTitle = (act: ActivityItem) => {
    if (act.type === "approve") return t("portal.dashboard.activity.approveTitle") || act.title
    if (act.type === "warning") return t("portal.dashboard.activity.warningTitle") || act.title
    if (act.type === "verify") return t("portal.dashboard.activity.verifyTitle") || act.title
    if (act.type === "upload") return t("portal.dashboard.activity.uploadTitle") || act.title
    return act.title
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
        <div className="py-8 text-center text-xs text-secondary-400">
          {t("common.loading") || "Loading activity..."}
        </div>
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
                  {getLocalizedTitle(act)}
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
