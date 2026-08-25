"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import {
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  ExternalLink,
  Download,
  AlertTriangle,
  Building2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export interface ReviewDocumentItem {
  id: string
  title: string
  category: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  companyName: string
  commercialRegisterNumber: string
  uploadedByName: string
  uploadedByEmail: string
  createdAt: string
}

interface DocumentReviewModalProps {
  document: ReviewDocumentItem
  onClose: () => void
  onSuccess?: () => void
}

export function DocumentReviewModal({ document, onClose, onSuccess }: DocumentReviewModalProps) {
  const t = useTranslations()
  const [status, setStatus] = useState<"approved" | "rejected" | "pending_review">("approved")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  )
  const [rejectionReason, setRejectionReason] = useState("Illegible or Low Quality Copy")
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVerify = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/documents/${document.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          startDate: status === "approved" ? startDate : undefined,
          expiryDate: status === "approved" ? expiryDate : undefined,
          rejectionReason: status === "rejected" ? rejectionReason : undefined,
          reviewNotes: reviewNotes || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        if (onSuccess) onSuccess()
        onClose()
      } else {
        alert(data.error || "Verification failed")
      }
    } catch {
      alert("Network error during verification")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-white shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Review & Verify Document</h3>
              <p className="text-xs text-slate-400">
                {document.companyName} • {document.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Split Body */}
        <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2">
          {/* Left Panel: File Viewer */}
          <div className="flex flex-col border-b border-slate-800 bg-slate-950 p-6 md:border-r md:border-b-0">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Document File Preview
              </span>
              <a
                href={`/api/portal/documents/${document.id}/download`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-primary-400 hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 text-center shadow-inner">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-950/80 border border-primary-800/50 text-primary-400 shadow-md">
                <FileText className="h-10 w-10" />
              </div>
              <h4 className="mt-4 font-bold text-white text-sm">{document.fileName}</h4>
              <p className="mt-1 text-xs text-slate-400">
                {(document.fileSize / (1024 * 1024)).toFixed(2)} MB • {document.mimeType}
              </p>
              <div className="mt-6">
                <a
                  href={`/api/portal/documents/${document.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="sm" variant="outline" className="rounded-xl border-slate-700 bg-slate-800 text-xs font-semibold hover:bg-slate-700">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                    <span>Open High-Resolution File</span>
                  </Button>
                </a>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary-400" />
                <span className="font-semibold text-slate-300">CR Number:</span>{" "}
                {document.commercialRegisterNumber}
              </p>
              <p className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-indigo-400" />
                <span className="font-semibold text-slate-300">Uploaded By:</span>{" "}
                {document.uploadedByName} ({document.uploadedByEmail})
              </p>
            </div>
          </div>

          {/* Right Panel: Verification Form */}
          <div className="space-y-4 p-6 bg-slate-900">
            {/* Status Selection */}
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Verification Decision *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("approved")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-bold transition-all",
                    status === "approved"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30 shadow-md"
                      : "border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Approve Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("rejected")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs font-bold transition-all",
                    status === "rejected"
                      ? "border-rose-500 bg-rose-950/40 text-rose-300 ring-2 ring-rose-500/30 shadow-md"
                      : "border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span>Reject Document</span>
                </button>
              </div>
            </div>

            {/* If Approved: Date Pickers */}
            {status === "approved" && (
              <div className="space-y-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-emerald-300">
                    Validity Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-emerald-300">
                    Expiration Date *
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* If Rejected: Preset Reasons */}
            {status === "rejected" && (
              <div className="space-y-3 rounded-xl border border-rose-500/20 bg-rose-950/20 p-4">
                <label className="block text-xs font-semibold text-rose-300">
                  Select Rejection Reason *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-medium text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="Illegible or Low Quality Copy">Illegible or Low Quality Copy</option>
                  <option value="Document Expired or Invalid Date">Document Expired or Invalid Date</option>
                  <option value="Missing Official Stamps or Signature">Missing Official Stamps or Signature</option>
                  <option value="Incorrect Company Details / Mismatch">Incorrect Company Details / Mismatch</option>
                  <option value="Wrong Document Category Uploaded">Wrong Document Category Uploaded</option>
                  <option value="Other">Other Reason (Specify below)</option>
                </select>
              </div>
            )}

            {/* Reviewer Internal Remarks */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Inspector Notes & Remarks (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Add feedback for customer or internal audit notes..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl border-slate-700 text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isSubmitting}
            className={cn(
              "rounded-xl font-bold text-white shadow-md text-xs px-4 py-2",
              status === "approved"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Applying Decision...</span>
              </span>
            ) : (
              <span>Save & Complete Verification</span>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
