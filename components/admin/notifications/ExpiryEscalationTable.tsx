"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Clock,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Send,
  RefreshCw,
  Play,
  Building2,
  FileText,
  Calendar,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ManualWarningModal } from "@/components/admin/documents/ManualWarningModal"

export interface EscalatingDocItem {
  id: string
  title: string
  category: string
  fileName: string
  fileUrl: string
  expiryDate: string
  daysLeft: number
  tier: "30d" | "20d" | "10d" | "5d" | "expired"
  customerId: string
  companyName: string
  contactEmail: string
  contactPhone: string
  lastNotificationSentAt?: string
}

export function ExpiryEscalationTable() {
  const t = useTranslations()
  const [documents, setDocuments] = useState<EscalatingDocItem[]>([])
  const [loading, setLoading] = useState(true)
  const [runningCron, setRunningCron] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<EscalatingDocItem | null>(null)
  const [tierFilter, setTierFilter] = useState("all")

  const fetchEscalatingDocs = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/documents/expiring")
      if (res.ok) {
        const data = await res.json()
        setDocuments(data.documents || [])
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEscalatingDocs()
  }, [])

  const handleRunCron = async () => {
    setRunningCron(true)
    try {
      const res = await fetch("/api/cron/check-expiries", { method: "POST" })
      if (res.ok) {
        await fetchEscalatingDocs()
      }
    } catch {
      // Ignore
    } finally {
      setRunningCron(false)
    }
  }

  const filteredDocs = documents.filter((d) => {
    if (tierFilter === "all") return true
    return d.tier === tierFilter
  })

  const renderTierPill = (tier: string, daysLeft: number) => {
    if (daysLeft <= 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
          <AlertOctagon className="h-3 w-3" />
          <span>Expired ({Math.abs(daysLeft)}d ago)</span>
        </span>
      )
    }
    if (daysLeft <= 5) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-600/40 bg-rose-600/20 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300 animate-pulse">
          <AlertOctagon className="h-3 w-3" />
          <span>Final Alert ({daysLeft}d left)</span>
        </span>
      )
    }
    if (daysLeft <= 10) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-600/30 bg-amber-600/15 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-3 w-3" />
          <span>Critical ({daysLeft}d left)</span>
        </span>
      )
    }
    if (daysLeft <= 20) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600 dark:text-orange-400">
          <Clock className="h-3 w-3" />
          <span>Urgent ({daysLeft}d left)</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-bold text-yellow-700 dark:text-yellow-400">
        <Clock className="h-3 w-3" />
        <span>Advisory ({daysLeft}d left)</span>
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Action & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-xl border border-secondary-200 bg-white px-3.5 py-2 text-xs font-semibold text-secondary-700 shadow-sm focus:border-primary-500 focus:outline-none dark:border-secondary-800 dark:bg-secondary-900 dark:text-secondary-300"
          >
            <option value="all">{t("admin.notifications.allTiers") || "All Escalation Tiers (≤30 Days)"}</option>
            <option value="5d">{t("admin.notifications.tier5") || "≤ 5 Days (Final Freeze Warning)"}</option>
            <option value="10d">{t("admin.notifications.tier10") || "≤ 10 Days (Critical Escalation)"}</option>
            <option value="20d">{t("admin.notifications.tier20") || "≤ 20 Days (Urgent Reminder)"}</option>
            <option value="30d">{t("admin.notifications.tier30") || "≤ 30 Days (Advisory Notice)"}</option>
            <option value="expired">{t("admin.notifications.tierExpired") || "Expired Documents"}</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchEscalatingDocs}
            className="border-secondary-200 bg-white hover:bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-900"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Button
          onClick={handleRunCron}
          disabled={runningCron}
          className="bg-primary-600 font-bold text-white shadow-md hover:bg-primary-700"
        >
          <Play className={`mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5 ${runningCron ? "animate-spin" : ""}`} />
          <span>{t("admin.notifications.runCron") || "Execute Automated 30/20/10/5-Day Radar Check"}</span>
        </Button>
      </div>

      {/* Radar Table */}
      <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs rtl:text-right">
            <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
              <tr>
                <th className="px-5 py-3.5">{t("admin.notifications.colCompany") || "Client Company"}</th>
                <th className="px-4 py-3.5">{t("admin.notifications.colDoc") || "Document Name"}</th>
                <th className="px-4 py-3.5">{t("admin.notifications.colExpiry") || "Expiry Date"}</th>
                <th className="px-4 py-3.5">{t("admin.notifications.colEscalation") || "Escalation Tier"}</th>
                <th className="px-4 py-3.5">{t("admin.notifications.colLastAlert") || "Last Alert Sent"}</th>
                <th className="px-5 py-3.5 text-right rtl:text-left">{t("common.actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                      <span>{t("common.loading") || "Scanning expiring legal files..."}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-secondary-400">
                    <ShieldCheck className="mx-auto h-8 w-8 text-emerald-500" />
                    <p className="mt-2 text-sm font-bold text-secondary-900 dark:text-white">
                      {t("admin.notifications.noExpiring") || "All compliance files are currently valid and healthy."}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {t("admin.notifications.noExpiringSub") || "No documents requiring 30, 20, 10, or 5-day warning escalation."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="transition-colors hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-secondary-900 dark:text-white">
                            {doc.companyName}
                          </p>
                          <p className="text-[11px] text-secondary-500">{doc.contactEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-secondary-400" />
                        <div>
                          <p className="font-bold text-secondary-900 dark:text-white">{doc.title}</p>
                          <p className="text-[11px] text-secondary-500">{doc.fileName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-secondary-700 dark:text-secondary-300">
                        <Calendar className="h-3.5 w-3.5 text-secondary-400" />
                        <span>{new Date(doc.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">{renderTierPill(doc.tier, doc.daysLeft)}</td>

                    <td className="px-4 py-4 text-secondary-500 text-[11px]">
                      {doc.lastNotificationSentAt
                        ? new Date(doc.lastNotificationSentAt).toLocaleString()
                        : t("admin.notifications.notSentYet") || "Automated schedule active"}
                    </td>

                    <td className="px-5 py-4 text-right rtl:text-left">
                      <div className="flex items-center justify-end gap-2 rtl:justify-start">
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-700 dark:hover:bg-secondary-800"
                            title="Inspect File"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}

                        <Button
                          size="sm"
                          onClick={() => setSelectedDoc(doc)}
                          className="rounded-xl bg-amber-600 text-xs font-semibold text-white shadow-sm hover:bg-amber-700"
                        >
                          <Send className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                          <span>{t("admin.notifications.alertButton") || "Send Alert"}</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Alert Modal */}
      {selectedDoc && (
        <ManualWarningModal
          documentId={selectedDoc.id}
          documentTitle={selectedDoc.title}
          companyName={selectedDoc.companyName}
          contactEmail={selectedDoc.contactEmail}
          contactPhone={selectedDoc.contactPhone}
          onClose={() => setSelectedDoc(null)}
          onSuccess={fetchEscalatingDocs}
        />
      )}
    </div>
  )
}
