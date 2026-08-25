"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Bell, Info, AlertTriangle, AlertCircle, RefreshCw } from "lucide-react"

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/notifications")
      const data = await res.json()
      if (data.notifications) {
        setNotifications(data.notifications)
      }
    } catch {
      // Error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [])

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Admin Notification Center"
        subtitle="Operational event feed, client document submissions, and expiration warnings"
      />

      <div className="space-y-6 p-6 sm:p-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">All Operational Alerts</h3>
            <button
              onClick={fetchNotifs}
              className="flex items-center gap-1 text-xs text-primary-400 hover:underline"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading alerts...</div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No operational alerts.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="flex items-start gap-3.5 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:border-slate-700"
                >
                  <div className="mt-0.5">
                    {n.severity === "critical" ? (
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                    ) : n.severity === "urgent" || n.severity === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Info className="h-4 w-4 text-primary-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{n.title}</h4>
                      <span className="text-[10px] text-slate-500">
                        {new Date(n.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{n.message}</p>
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
