"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  FileCheck,
  Search,
  Building2,
  Calendar,
  Eye,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { DocumentReviewModal, ReviewDocumentItem } from "@/components/admin/review/DocumentReviewModal"

export default function AdminReviewQueuePage() {
  const t = useTranslations()
  const [documents, setDocuments] = useState<ReviewDocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeModalDoc, setActiveModalDoc] = useState<ReviewDocumentItem | null>(null)

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/documents/review")
      const data = await res.json()
      if (data.documents) {
        setDocuments(data.documents)
      }
    } catch {
      // Fetch error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  return (
    <div className="flex flex-col">
      <AdminHeader
        title={t("admin.sidebar.reviewQueue") || "Document Review Queue"}
        subtitle={
          t("admin.review.pageSubtitle") ||
          "Inspect uploaded customer certificates, edit metadata live, and approve or reject submissions"
        }
      />

      <div className="space-y-6 p-6 sm:p-8">
        <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
          <div className="flex items-center justify-between border-b border-secondary-100 p-4 dark:border-secondary-800">
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white">
              {t("admin.review.queueHeading") || "Pending Document Review Queue"} ({documents.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchQueue}
              className="border-secondary-200 bg-white hover:bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-900"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs rtl:text-right">
              <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
                <tr>
                  <th className="px-5 py-3.5">{t("admin.customerTable.client") || "Company Name"}</th>
                  <th className="px-4 py-3.5">{t("admin.review.colDocTitle") || "Document Title"}</th>
                  <th className="px-4 py-3.5">{t("admin.settings.colType") || "Category"}</th>
                  <th className="px-4 py-3.5">{t("admin.review.colUploadedBy") || "Uploaded By"}</th>
                  <th className="px-4 py-3.5">{t("admin.review.colUploadDate") || "Upload Date"}</th>
                  <th className="px-5 py-3.5 text-right rtl:text-left">{t("common.actions") || "Inspection"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-secondary-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                        <span>{t("common.loading") || "Loading verification queue..."}</span>
                      </div>
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <p className="mt-3 text-sm font-bold text-secondary-900 dark:text-white">
                        {t("admin.review.queueClear") || "Review Queue is Clear! 🎉"}
                      </p>
                      <p className="mt-1 text-xs text-secondary-500">
                        {t("admin.review.queueClearSub") || "All uploaded customer documents have been reviewed."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="transition-colors hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40"
                    >
                      <td className="px-5 py-4 font-semibold text-secondary-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <span>{doc.companyName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-secondary-900 dark:text-white">{doc.title}</td>
                      <td className="px-4 py-4 capitalize text-secondary-600 dark:text-secondary-300">
                        <span className="rounded-md bg-secondary-100 px-2 py-0.5 text-[11px] font-semibold text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200">
                          {doc.category.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-secondary-600 dark:text-secondary-400">
                        {doc.uploadedByName} ({doc.uploadedByEmail})
                      </td>
                      <td className="px-4 py-4 text-secondary-500 text-[11px]">
                        {new Date(doc.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-4 text-right rtl:text-left">
                        <Button
                          size="sm"
                          onClick={() => setActiveModalDoc(doc)}
                          className="bg-primary-600 font-bold text-white shadow-sm hover:bg-primary-700"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                          <span>{t("admin.review.reviewBtnAction") || "Review & Edit"}</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {activeModalDoc && (
        <DocumentReviewModal
          document={activeModalDoc}
          onClose={() => setActiveModalDoc(null)}
          onSuccess={fetchQueue}
        />
      )}
    </div>
  )
}
