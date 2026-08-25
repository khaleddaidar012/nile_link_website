"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, Clock, AlertTriangle, AlertCircle, Info } from "lucide-react"
import { Link } from "@/navigation"
import { usePortal } from "./PortalContext"
import { cn } from "@/lib/utils"

interface NotificationItem {
  _id: string
  title: string
  message: string
  severity: "normal" | "warning" | "urgent" | "critical"
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export function NotificationBellPopover() {
  const t = useTranslations()
  const { unreadCount, refreshData } = usePortal()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetch("/api/portal/notifications?limit=5")
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) {
            setNotifications(data.notifications)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen])

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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-secondary-200/80 bg-white p-2.5 text-secondary-600 transition-colors hover:bg-secondary-50 hover:text-secondary-900 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-secondary-200 bg-white p-4 shadow-premium-xl dark:border-secondary-700 dark:bg-secondary-900 rtl:right-auto rtl:left-0"
          >
            <div className="flex items-center justify-between border-b border-secondary-100 pb-3 dark:border-secondary-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-secondary-900 dark:text-white">
                  {t("portal.header.notifications") || "Notifications"}
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-primary-600 hover:underline dark:text-primary-400"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{t("portal.header.markAllRead") || "Mark read"}</span>
                </button>
              )}
            </div>

            <div className="my-2 max-h-72 space-y-2 overflow-y-auto">
              {loading ? (
                <div className="py-6 text-center text-xs text-secondary-400">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-secondary-400">
                  {t("portal.header.noNotifications") || "No unread notifications"}
                </div>
              ) : (
                notifications.map((item) => (
                  <Link
                    key={item._id}
                    href={item.actionUrl || "/portal/notifications"}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex gap-3 rounded-xl p-2.5 text-xs transition-colors hover:bg-secondary-50 dark:hover:bg-secondary-800",
                      !item.isRead ? "bg-primary-50/60 dark:bg-primary-950/20" : ""
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{getSeverityIcon(item.severity)}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-secondary-900 dark:text-white">{item.title}</p>
                      <p className="mt-0.5 text-secondary-600 line-clamp-2 dark:text-secondary-400">
                        {item.message}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="border-t border-secondary-100 pt-2 text-center dark:border-secondary-800">
              <Link
                href="/portal/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                {t("portal.header.viewAll") || "View all notifications"} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
