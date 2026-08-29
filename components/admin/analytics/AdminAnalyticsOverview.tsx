"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import {
  Building2,
  FileCheck,
  Clock,
  AlertTriangle,
  Users,
  Bell,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Send,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"

export function AdminAnalyticsOverview() {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"

  const [data, setData] = useState<{
    metrics: {
      totalCustomers: number
      activeCustomers: number
      warningCustomers: number
      inactiveCustomers: number
      pendingReviewDocs: number
      expiringSoonDocs: number
      expiredDocs: number
      totalNotificationsSent: number
    }
    expiryHorizonChartData: Array<{ name: string; count: number; color: string }>
    urgentCount: number
  } | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/analytics/overview")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const m = data?.metrics || {
    totalCustomers: 0,
    activeCustomers: 0,
    warningCustomers: 0,
    inactiveCustomers: 0,
    pendingReviewDocs: 0,
    expiringSoonDocs: 0,
    expiredDocs: 0,
    totalNotificationsSent: 0,
  }

  return (
    <div className="space-y-6">
      {/* Urgent Alert Banner if pending or expiring files exist */}
      {(m.pendingReviewDocs > 0 || m.expiringSoonDocs > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/20 dark:from-amber-950/40 dark:via-orange-950/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-secondary-900 dark:text-white">
                {isAr
                  ? `تنبيه تشغيلي عاجل: ${m.pendingReviewDocs} مستند بانتظار المراجعة و ${m.expiringSoonDocs} مستند قارب على الانتهاء`
                  : `Action Required: ${m.pendingReviewDocs} files awaiting review and ${m.expiringSoonDocs} documents approaching expiry`}
              </h4>
              <p className="text-[11px] text-secondary-500">
                {isAr
                  ? "يُرجى مراجعة المعاملات لضمان عدم توقف عمليات الإفراج والتخليص الجمركي للعملاء"
                  : "Please verify pending documents and dispatch expiry notices to prevent port clearance hold-ups"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/documents/review">
              <Button size="sm" className="bg-amber-600 font-bold text-white hover:bg-amber-700 text-xs">
                <span>{isAr ? "مراجعة المستندات الآن" : "Review Queue"}</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Customers */}
        <div className="relative overflow-hidden rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500">
              {isAr ? "إجمالي الشركات المسجلة" : "Corporate Accounts"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-secondary-900 dark:text-white">
            {loading ? "..." : m.totalCustomers}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>
              {m.activeCustomers} {isAr ? "نشط وممتثل" : "active & compliant"}
            </span>
          </div>
        </div>

        {/* Pending Review Queue */}
        <div className="relative overflow-hidden rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500">
              {isAr ? "بانتظار المراجعة والاعتماد" : "Pending Review Queue"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-secondary-900 dark:text-white">
            {loading ? "..." : m.pendingReviewDocs}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-primary-600 dark:text-primary-400 font-semibold">
            <Activity className="h-3.5 w-3.5" />
            <span>{isAr ? "يتطلب إجراء الموظف" : "requires staff decision"}</span>
          </div>
        </div>

        {/* Expiring Danger Zone */}
        <div className="relative overflow-hidden rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500">
              {isAr ? "مستندات تنتهي قريباً (≤30 يوم)" : "Expiring Horizon (≤30d)"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {loading ? "..." : m.expiringSoonDocs}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>
              {m.expiredDocs} {isAr ? "منتهي الصلاحية" : "expired documents"}
            </span>
          </div>
        </div>

        {/* Notifications Sent */}
        <div className="relative overflow-hidden rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500">
              {isAr ? "الإشعارات المرسلة للشركات" : "Dispatched Alerts"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Bell className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-secondary-900 dark:text-white">
            {loading ? "..." : m.totalNotificationsSent}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            <Zap className="h-3.5 w-3.5" />
            <span>{isAr ? "تنبيهات آلية ورادارية" : "automated multi-tier alerts"}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-500">
          {isAr ? "روابط وإجراءات الوصول السريع" : "Operations Fast Actions"}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Link href="/admin/documents/review">
            <div className="flex flex-col items-center justify-center rounded-xl border border-secondary-200/70 bg-secondary-50/50 p-4 text-center transition-all hover:border-primary-500 hover:bg-primary-50/40 dark:border-secondary-800 dark:bg-secondary-800/40 dark:hover:border-primary-500">
              <FileCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="mt-2 text-xs font-bold text-secondary-900 dark:text-white">
                {isAr ? "مراجعة المستندات" : "Review Queue"}
              </span>
            </div>
          </Link>

          <Link href="/admin/customers">
            <div className="flex flex-col items-center justify-center rounded-xl border border-secondary-200/70 bg-secondary-50/50 p-4 text-center transition-all hover:border-primary-500 hover:bg-primary-50/40 dark:border-secondary-800 dark:bg-secondary-800/40 dark:hover:border-primary-500">
              <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="mt-2 text-xs font-bold text-secondary-900 dark:text-white">
                {isAr ? "دليل حسابات الشركات" : "Customer Accounts"}
              </span>
            </div>
          </Link>

          <Link href="/admin/notifications">
            <div className="flex flex-col items-center justify-center rounded-xl border border-secondary-200/70 bg-secondary-50/50 p-4 text-center transition-all hover:border-primary-500 hover:bg-primary-50/40 dark:border-secondary-800 dark:bg-secondary-800/40 dark:hover:border-primary-500">
              <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="mt-2 text-xs font-bold text-secondary-900 dark:text-white">
                {isAr ? "رادار تصعيد التنبيهات" : "Expiry Radar (30/20/10/5d)"}
              </span>
            </div>
          </Link>

          <Link href="/admin/staff">
            <div className="flex flex-col items-center justify-center rounded-xl border border-secondary-200/70 bg-secondary-50/50 p-4 text-center transition-all hover:border-primary-500 hover:bg-primary-50/40 dark:border-secondary-800 dark:bg-secondary-800/40 dark:hover:border-primary-500">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="mt-2 text-xs font-bold text-secondary-900 dark:text-white">
                {isAr ? "إدارة الموظفين والصلاحيات" : "Staff & RBAC"}
              </span>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="flex flex-col items-center justify-center rounded-xl border border-secondary-200/70 bg-secondary-50/50 p-4 text-center transition-all hover:border-primary-500 hover:bg-primary-50/40 dark:border-secondary-800 dark:bg-secondary-800/40 dark:hover:border-primary-500">
              <Sliders className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span className="mt-2 text-xs font-bold text-secondary-900 dark:text-white">
                {isAr ? "إعدادات النظام والتصنيفات" : "System Categories"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
