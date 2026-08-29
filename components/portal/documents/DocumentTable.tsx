"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  FileText,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Filter,
} from "lucide-react"
import { ExpiryStatusBadge } from "@/components/shared/ExpiryStatusBadge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

import { LiveDocumentViewerModal } from "@/components/shared/LiveDocumentViewerModal"
import { RejectionReasonModal } from "./RejectionReasonModal"

export interface CustomerDocumentItem {
  id: string
  title: string
  category: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: "pending_review" | "approved" | "expiring_soon" | "expired" | "rejected"
  startDate?: string | null
  expiryDate?: string | null
  rejectionReason?: string | null
  reviewNotes?: string | null
  warningEscalationTier?: string
  createdAt: string
}

interface DocumentTableProps {
  onRenewClick?: (doc: CustomerDocumentItem) => void
  onPreviewClick?: (doc: CustomerDocumentItem) => void
}

export function DocumentTable({ onRenewClick, onPreviewClick }: DocumentTableProps) {
  const t = useTranslations()
  const [documents, setDocuments] = useState<CustomerDocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Modal States
  const [previewDoc, setPreviewDoc] = useState<CustomerDocumentItem | null>(null)
  const [rejectionTarget, setRejectionTarget] = useState<CustomerDocumentItem | null>(null)

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (selectedCategory !== "all") params.set("category", selectedCategory)
      if (selectedStatus !== "all") params.set("status", selectedStatus)

      const res = await fetch(`/api/portal/documents?${params.toString()}`)
      const data = await res.json()
      if (data.documents) {
        setDocuments(data.documents)
      }
    } catch {
      // Handle fetch error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [search, selectedCategory, selectedStatus])

  const categories = [
    { id: "all", label: t("documents.allCategories") || "All Categories" },
    { id: "commercial_register", label: t("documents.categories.commercial_register") || "Commercial Register" },
    { id: "tax_card", label: t("documents.categories.tax_card") || "Tax Card" },
    { id: "license", label: t("documents.categories.license") || "Import/Export License" },
    { id: "customs_certificate", label: t("documents.categories.customs_certificate") || "Customs Certificate" },
    { id: "contract", label: t("documents.categories.contract") || "Contracts & Agreements" },
    { id: "other", label: t("documents.categories.other") || "Other Document" },
  ]

  const statuses = [
    { id: "all", label: t("documents.allStatuses") || "All Statuses" },
    { id: "approved", label: t("documents.statuses.approved") || "Approved / Active" },
    { id: "expiring_soon", label: t("documents.statuses.expiring_soon") || "Expiring Soon" },
    { id: "pending_review", label: t("documents.statuses.pending_review") || "Pending Review" },
    { id: "expired", label: t("documents.statuses.expired") || "Expired" },
    { id: "rejected", label: t("documents.statuses.rejected") || "Rejected" },
  ]

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "commercial_register":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900"
      case "tax_card":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-900"
      case "license":
        return "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-900"
      case "customs_certificate":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900"
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            placeholder={t("documents.searchPlaceholder") || "Search documents by name or file..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-secondary-200 bg-white py-2.5 pr-4 pl-10 text-xs font-medium transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-800 dark:bg-secondary-900 dark:text-white rtl:pr-10 rtl:pl-4 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-secondary-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-secondary-700 shadow-sm transition-colors hover:border-secondary-300 focus:border-primary-500 focus:outline-none dark:border-secondary-800 dark:bg-secondary-900 dark:text-secondary-300"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-secondary-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-secondary-700 shadow-sm transition-colors hover:border-secondary-300 focus:border-primary-500 focus:outline-none dark:border-secondary-800 dark:bg-secondary-900 dark:text-secondary-300"
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Canvas */}
      <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs rtl:text-right">
            <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
              <tr>
                <th className="px-5 py-3.5">{t("documents.table.colName") || "Document Name"}</th>
                <th className="px-4 py-3.5">{t("documents.table.colCategory") || "Category"}</th>
                <th className="px-4 py-3.5">{t("documents.table.colStartDate") || "Validity Start"}</th>
                <th className="px-4 py-3.5">{t("documents.table.colExpiryDate") || "Expiry Date"}</th>
                <th className="px-4 py-3.5">{t("documents.table.colStatus") || "Status"}</th>
                <th className="px-5 py-3.5 text-right rtl:text-left">{t("documents.table.colActions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                      <span>{t("documents.loading") || "Loading documents registry..."}</span>
                    </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-400 dark:bg-secondary-800 dark:text-secondary-500">
                      <FileText className="h-7 w-7" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-secondary-900 dark:text-white">
                      {t("documents.noDocsFound") || "No documents registered yet"}
                    </p>
                    <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400 max-w-sm mx-auto">
                      {t("documents.noDocsSub") || "Upload your corporate legal files (Commercial Register, Tax Card, Licenses) to manage compliance."}
                    </p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="group transition-colors hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-transform group-hover:scale-105 dark:bg-primary-950/50 dark:text-primary-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-secondary-900 dark:text-white">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-secondary-500">
                            {doc.fileName} • {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          {doc.rejectionReason && (
                            <button
                              type="button"
                              onClick={() => setRejectionTarget(doc)}
                              className="mt-1 flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
                            >
                              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600 animate-pulse" />
                              <span>سبب الرفض: {doc.rejectionReason} (انقر للتفاصيل)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold capitalize", getCategoryBadgeClass(doc.category))}>
                        {t(`documents.categories.${doc.category}`) || doc.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-secondary-600 dark:text-secondary-300">
                      {formatDate(doc.startDate)}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs font-semibold text-secondary-700 dark:text-secondary-200">
                      {formatDate(doc.expiryDate)}
                    </td>
                    <td className="px-4 py-4">
                      <ExpiryStatusBadge
                        status={doc.status}
                        expiryDate={doc.expiryDate}
                      />
                    </td>
                    <td className="px-5 py-4 text-right rtl:text-left">
                      <div className="flex items-center justify-end gap-1.5 rtl:justify-start">
                        {/* Live Preview Eye Button (No Download Required) */}
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-50 text-primary-600 shadow-sm transition-all hover:bg-primary-600 hover:text-white dark:border-primary-500/20 dark:bg-primary-950/60 dark:text-primary-400"
                          title="Preview Live Document"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Download File Link */}
                        <a
                          href={`/api/portal/documents/${doc.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-secondary-200 bg-white text-secondary-600 shadow-sm transition-all hover:bg-secondary-50 hover:text-secondary-900 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-white"
                          title="Download Document"
                        >
                          <Download className="h-4 w-4" />
                        </a>

                        {(doc.status === "expiring_soon" ||
                          doc.status === "expired" ||
                          doc.status === "rejected") && (
                          <Button
                            size="sm"
                            onClick={() => onRenewClick && onRenewClick(doc)}
                            className="rounded-xl bg-primary-600 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-primary-700"
                          >
                            <RefreshCw className="mr-1 h-3 w-3 rtl:mr-0 rtl:ml-1" />
                            <span>Renew</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Document Viewer Modal */}
      {previewDoc && (
        <LiveDocumentViewerModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          fileUrl={previewDoc.fileUrl || `/api/portal/documents/${previewDoc.id}/download`}
          fileName={previewDoc.fileName}
          title={previewDoc.title}
          mimeType={previewDoc.mimeType}
        />
      )}

      {/* Rejection Reason Popup Modal */}
      {rejectionTarget && (
        <RejectionReasonModal
          isOpen={!!rejectionTarget}
          onClose={() => setRejectionTarget(null)}
          onRenewClick={() => onRenewClick && onRenewClick(rejectionTarget)}
          docTitle={rejectionTarget.title}
          rejectionReason={rejectionTarget.rejectionReason}
          reviewNotes={rejectionTarget.reviewNotes}
        />
      )}
    </div>
  )
}
