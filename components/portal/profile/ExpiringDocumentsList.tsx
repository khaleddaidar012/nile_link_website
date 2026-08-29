"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import {
  Clock,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  UploadCloud,
  FileText,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export interface ExpiringDocumentItem {
  id: string
  title: string
  category: string
  fileName: string
  fileUrl: string
  status: string
  startDate?: string | null
  expiryDate?: string | null
  warningEscalationTier?: string
}

interface ExpiringDocumentsListProps {
  documents: ExpiringDocumentItem[]
  loading?: boolean
}

export function ExpiringDocumentsList({ documents, loading }: ExpiringDocumentsListProps) {
  const t = useTranslations()
  const locale = useLocale()

  // Calculate days remaining and sort strictly by ASCENDING order (closest expiry first)
  const calculateDaysRemaining = (expiryDateStr?: string | null) => {
    if (!expiryDateStr) return 9999
    const expiry = new Date(expiryDateStr).getTime()
    const now = new Date().getTime()
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  }

  const sortedDocuments = [...documents].sort((a, b) => {
    const daysA = calculateDaysRemaining(a.expiryDate)
    const daysB = calculateDaysRemaining(b.expiryDate)
    return daysA - daysB // Ascending: 1 day left before 2 days left!
  })

  const formatExpiryCountdown = (days: number) => {
    if (days < 0) {
      return locale === "ar" ? "منتهي الصلاحية" : "Expired"
    }
    if (days === 0) {
      return locale === "ar" ? "ينتهي اليوم" : "Expires Today"
    }
    if (days === 1) {
      return locale === "ar" ? "ينتهي خلال يوم واحد" : "1 Day Remaining"
    }
    if (days === 2) {
      return locale === "ar" ? "ينتهي خلال يومين" : "2 Days Remaining"
    }
    if (days >= 3 && days <= 10) {
      return locale === "ar" ? `ينتهي خلال ${days} أيام` : `${days} Days Remaining`
    }
    return locale === "ar" ? `ينتهي خلال ${days} يوم` : `${days} Days Remaining`
  }

  const getUrgencyClasses = (days: number) => {
    if (days < 0) {
      return {
        cardBorder: "border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/20",
        badge: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
        icon: AlertOctagon,
        iconColor: "text-rose-600 dark:text-rose-400",
      }
    }
    if (days <= 3) {
      return {
        cardBorder: "border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/15",
        badge: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse font-bold",
        icon: AlertTriangle,
        iconColor: "text-rose-600 dark:text-rose-400",
      }
    }
    if (days <= 10) {
      return {
        cardBorder: "border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/15",
        badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 font-semibold",
        icon: Clock,
        iconColor: "text-amber-600 dark:text-amber-400",
      }
    }
    return {
      cardBorder: "border-secondary-200/80 bg-white dark:border-secondary-800 dark:bg-secondary-900",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      icon: ShieldCheck,
      iconColor: "text-emerald-600 dark:text-emerald-400",
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-secondary-200 bg-white p-8 text-center dark:border-secondary-800 dark:bg-secondary-900">
        <Clock className="mx-auto h-6 w-6 animate-spin text-primary-500" />
        <p className="mt-2 text-xs font-semibold text-secondary-500">
          Loading document compliance status...
        </p>
      </div>
    )
  }

  if (sortedDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center dark:border-emerald-500/20 dark:bg-emerald-950/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-bold text-emerald-950 dark:text-emerald-200">
          {locale === "ar" ? "كافة المستندات سارية ومحدثة" : "All Documents Valid & Compliant"}
        </h3>
        <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80 max-w-sm">
          {locale === "ar"
            ? "لا توجد مستندات قاربت على الانتهاء حالياً. سجلك التجاري وتراخيصك متوافقة بالكامل."
            : "No documents are currently expiring soon. Your commercial registry and certifications are up to date."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-secondary-900 dark:text-white">
            {locale === "ar" ? "مستندات قاربت على الانتهاء" : "Expiring Soon Documents"}
          </h3>
          <p className="text-xs text-secondary-500 dark:text-secondary-400">
            {locale === "ar"
              ? "مرتبة حسب الأقرب انتهاءً (الأولوية العاجلة بالأعلى)"
              : "Sorted in strict ascending order of urgency (closest expiry first)"}
          </p>
        </div>
        <Link href="/portal/documents">
          <Button size="sm" variant="outline" className="rounded-xl text-xs">
            <UploadCloud className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
            <span>{locale === "ar" ? "إدارة المستندات" : "Manage Registry"}</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sortedDocuments.map((doc, idx) => {
          const days = calculateDaysRemaining(doc.expiryDate)
          const style = getUrgencyClasses(days)
          const IconComponent = style.icon

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition-all sm:flex-row sm:items-center sm:justify-between",
                style.cardBorder
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-100 dark:bg-secondary-800 shadow-sm",
                    style.iconColor
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-secondary-900 dark:text-white line-clamp-1">
                      {doc.title}
                    </h4>
                    <span className="rounded-md bg-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-700 uppercase dark:bg-secondary-800 dark:text-secondary-300">
                      {doc.category.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {doc.expiryDate
                          ? new Date(doc.expiryDate).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[160px]">{doc.fileName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-sm",
                    style.badge
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatExpiryCountdown(days)}</span>
                </span>

                <Link href="/portal/documents">
                  <Button
                    size="sm"
                    className="rounded-xl bg-primary-600 text-xs font-bold text-white shadow hover:bg-primary-700"
                  >
                    <UploadCloud className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                    <span>{locale === "ar" ? "تجديد المستند" : "Renew File"}</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
