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
        subtitle="Inspect uploaded customer certificates, set validity dates, and approve or reject submissions"
      />

      <div className="space-y-6 p-6 sm:p-8">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
          <div className="border-b border-slate-800 p-4">
            <h3 className="text-sm font-bold text-white">
              Pending Document Review ({documents.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs rtl:text-right">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Company Name</th>
                  <th className="px-4 py-3.5">Document Title</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Uploaded By</th>
                  <th className="px-4 py-3.5">Upload Date</th>
                  <th className="px-5 py-3.5 text-right rtl:text-left">Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-white">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                        <span>Loading verification queue...</span>
                      </div>
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <FileCheck className="mx-auto h-8 w-8 text-emerald-500" />
                      <p className="mt-2 text-sm font-semibold text-slate-200">
                        Review Queue is Clear! 🎉
                      </p>
                      <p className="text-xs text-slate-500">
                        All uploaded customer documents have been reviewed.
                      </p>
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id} className="transition-colors hover:bg-slate-800/40">
                      <td className="px-5 py-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary-400" />
                          <span>{doc.companyName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium">{doc.title}</td>
                      <td className="px-4 py-4 capitalize text-slate-300">
                        {doc.category.replace("_", " ")}
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {doc.uploadedByName} ({doc.uploadedByEmail})
                      </td>
                      <td className="px-4 py-4 text-slate-400">
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
                          className="bg-primary-600 font-semibold text-white hover:bg-primary-700"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                          <span>Review & Verify</span>
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
