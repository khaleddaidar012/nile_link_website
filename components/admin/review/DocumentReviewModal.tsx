"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  ExternalLink,
  Download,
  Building2,
  User,
  Tag,
  Edit3,
  Maximize2,
  Clock,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { LiveDocumentViewerModal } from "@/components/shared/LiveDocumentViewerModal"

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
  startDate?: string
  expiryDate?: string
  createdAt: string
}

interface CategoryOption {
  key: string
  nameEn: string
  nameAr: string
  defaultValidityDays: number
}

interface DocumentReviewModalProps {
  document: ReviewDocumentItem
  onClose: () => void
  onSuccess?: () => void
}

export function DocumentReviewModal({ document, onClose, onSuccess }: DocumentReviewModalProps) {
  const t = useTranslations()
  const [status, setStatus] = useState<"approved" | "rejected" | "pending_review">("approved")
  const [editableTitle, setEditableTitle] = useState(document.title || document.fileName)
  const [editableCategory, setEditableCategory] = useState(document.category || "commercial_register")
  const [categories, setCategories] = useState<CategoryOption[]>([])
  
  const [startDate, setStartDate] = useState(
    document.startDate ? new Date(document.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  )
  const [expiryDate, setExpiryDate] = useState(
    document.expiryDate
      ? new Date(document.expiryDate).toISOString().split("T")[0]
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  )
  const [rejectionReason, setRejectionReason] = useState("illegible_copy")
  const [reviewNotes, setReviewNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Live Preview States
  const [previewLoading, setPreviewLoading] = useState(true)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [isEditingDates, setIsEditingDates] = useState(false)

  // MIME type & format detection
  const isImage =
    document.mimeType?.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(document.fileName) ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(document.fileUrl)

  const isPdf =
    document.mimeType === "application/pdf" ||
    /\.pdf$/i.test(document.fileName) ||
    /\.pdf$/i.test(document.fileUrl)

  useEffect(() => {
    // Fetch dynamic categories
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/settings/document-categories")
        if (res.ok) {
          const data = await res.json()
          if (data.categories?.length) {
            setCategories(data.categories)
          }
        }
      } catch {
        // Fallback to default
      }
    }
    loadCategories()
  }, [])

  const handleCategoryChange = (newCatKey: string) => {
    setEditableCategory(newCatKey)
    const matched = categories.find((c) => c.key === newCatKey)
    if (matched && matched.defaultValidityDays) {
      const start = new Date(startDate)
      const newExpiry = new Date(start.getTime() + matched.defaultValidityDays * 24 * 60 * 60 * 1000)
      setExpiryDate(newExpiry.toISOString().split("T")[0])
    }
  }

  // Calculate validity period in days
  const calculateDaysValidity = () => {
    try {
      const start = new Date(startDate).getTime()
      const end = new Date(expiryDate).getTime()
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      return diffDays > 0 ? diffDays : 0
    } catch {
      return 0
    }
  }

  const handleVerify = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/documents/${document.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          title: editableTitle.trim() || document.fileName,
          category: editableCategory,
          startDate: status === "approved" ? startDate : undefined,
          expiryDate: status === "approved" ? expiryDate : undefined,
          rejectionReason: status === "rejected" ? (rejectionReason?.trim() || "Illegible or Low Quality Copy") : undefined,
          reviewNotes: reviewNotes?.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        if (onSuccess) onSuccess()
        onClose()
      } else {
        setError(data.error || "Verification failed")
      }
    } catch {
      setError("Network error during verification")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-secondary-200 bg-white text-secondary-900 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900 dark:text-white"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-secondary-100 bg-secondary-50/90 px-6 py-3.5 dark:border-secondary-800 dark:bg-secondary-950/90">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-secondary-900 dark:text-white">
                  {t("admin.review.modalTitle") || "Review & Live Edit Document"}
                </h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {document.companyName} • {document.fileName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-700 dark:hover:bg-secondary-800 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Split Body */}
          <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-12">
            {/* Left Panel: Embedded Live Document Viewer */}
            <div className="flex flex-col border-b border-secondary-100 bg-secondary-50/40 p-4 sm:p-5 md:col-span-6 md:border-r md:border-b-0 dark:border-secondary-800 dark:bg-secondary-950/40">
              {/* Viewer Control Bar */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-secondary-600 uppercase tracking-wider dark:text-secondary-300">
                    {t("admin.review.filePreview") || "Live Document Inspection"}
                  </span>
                  <span className="rounded-md bg-secondary-200/70 px-1.5 py-0.5 text-[10px] font-bold text-secondary-700 uppercase dark:bg-secondary-800 dark:text-secondary-300">
                    {isPdf ? "PDF Document" : isImage ? "Image Certificate" : "File"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFullscreenOpen(true)}
                    className="flex items-center gap-1 rounded-lg border border-secondary-200 bg-white px-2 py-1 text-[11px] font-semibold text-secondary-700 shadow-sm hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                    title={t("documents.previewModal.openFullScreen") || "Fullscreen"}
                  >
                    <Maximize2 className="h-3 w-3 text-primary-500" />
                    <span>{t("documents.previewModal.openFullScreen") || "Fullscreen"}</span>
                  </button>

                  <a
                    href={document.fileUrl || `/api/portal/documents/${document.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-secondary-200 bg-white px-2 py-1 text-[11px] font-semibold text-secondary-700 shadow-sm hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                    download={document.fileName}
                    title={t("common.download") || "Download"}
                  >
                    <Download className="h-3 w-3 text-emerald-500" />
                    <span>{t("common.download") || "Download"}</span>
                  </a>
                </div>
              </div>

              {/* Embedded Live Viewer Container */}
              <div className="relative flex flex-1 min-h-[380px] max-h-[480px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-secondary-200/90 bg-slate-900/5 shadow-inner dark:border-secondary-800 dark:bg-slate-950/60">
                {previewLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-secondary-900/90 backdrop-blur-xs">
                    <Loader2 className="h-7 w-7 animate-spin text-primary-500" />
                    <span className="mt-2 text-xs font-semibold text-secondary-600 dark:text-secondary-300">
                      {t("documents.previewModal.loading") || "Rendering live preview..."}
                    </span>
                  </div>
                )}

                {isPdf ? (
                  <iframe
                    src={`${document.fileUrl}#toolbar=1&navpanes=0`}
                    title={document.fileName}
                    onLoad={() => setPreviewLoading(false)}
                    className="h-full w-full rounded-2xl border-0 bg-white dark:bg-secondary-900"
                  />
                ) : isImage ? (
                  <div className="flex h-full w-full items-center justify-center p-3">
                    <img
                      src={document.fileUrl}
                      alt={document.fileName}
                      onLoad={() => setPreviewLoading(false)}
                      onError={() => setPreviewLoading(false)}
                      className="max-h-full max-w-full rounded-xl object-contain shadow-md"
                    />
                  </div>
                ) : (
                  <iframe
                    src={document.fileUrl}
                    title={document.fileName}
                    onLoad={() => setPreviewLoading(false)}
                    className="h-full w-full rounded-2xl border-0 bg-white dark:bg-secondary-900"
                  />
                )}
              </div>

              {/* Company & Uploader Meta Card */}
              <div className="mt-3.5 space-y-1.5 rounded-xl border border-secondary-200 bg-white p-3 text-xs text-secondary-600 dark:border-secondary-800 dark:bg-secondary-900/60 dark:text-secondary-400">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                    <span className="font-semibold text-secondary-900 dark:text-secondary-300">CR Number:</span>{" "}
                    <span className="font-mono">{document.commercialRegisterNumber}</span>
                  </p>
                  <span className="text-[11px] text-secondary-400 font-mono">
                    {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <p className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span className="font-semibold text-secondary-900 dark:text-secondary-300">Uploaded By:</span>{" "}
                  {document.uploadedByName} ({document.uploadedByEmail})
                </p>
              </div>
            </div>

            {/* Right Panel: Live Editable Metadata, Dates & Verification Decision */}
            <div className="space-y-4 p-5 sm:p-6 md:col-span-6 bg-white dark:bg-secondary-900">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  {error}
                </div>
              )}

              {/* Title Input with Quick Edit Indicator */}
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="h-3.5 w-3.5 text-primary-500" />
                    <span>{t("admin.review.docTitle") || "Official Document Title"} *</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  placeholder="e.g. Commercial Register 2026"
                  className="w-full rounded-xl border border-secondary-200 bg-white px-3.5 py-2 text-xs font-semibold text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              {/* Category Selector */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-secondary-700 dark:text-secondary-300">
                  <Tag className="h-3.5 w-3.5 text-primary-500" />
                  <span>{t("admin.review.docCategory") || "Document Category & Type"} *</span>
                </label>
                <select
                  value={editableCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-white px-3.5 py-2 text-xs font-semibold text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.nameEn} ({c.nameAr})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="commercial_register">Commercial Registration (CR)</option>
                      <option value="tax_card">Tax Card Certificate</option>
                      <option value="license">Import / Export License</option>
                      <option value="customs_certificate">Customs Clearance Certificate</option>
                      <option value="contract">Logistics Contract</option>
                      <option value="other">General Certificate</option>
                    </>
                  )}
                </select>
              </div>

              {/* Decision Selector Buttons (Approve vs Reject) */}
              <div>
                <label className="mb-2 block text-xs font-bold text-secondary-700 uppercase tracking-wider dark:text-secondary-300">
                  {t("admin.review.decision") || "Verification Decision"} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("approved")
                      setIsEditingDates(true)
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all",
                      status === "approved"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-800/40 dark:text-secondary-400 dark:hover:bg-secondary-800"
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t("admin.review.approveBtn") || "Approve Document"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatus("rejected")
                      setIsEditingDates(false)
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all",
                      status === "rejected"
                        ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20 shadow-sm dark:bg-rose-950/40 dark:text-rose-300"
                        : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-800/40 dark:text-secondary-400 dark:hover:bg-secondary-800"
                    )}
                  >
                    <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <span>{t("admin.review.rejectBtn") || "Reject Document"}</span>
                  </button>
                </div>
              </div>

              {/* If Approved: Date Pickers with In-Modal Adjustments */}
              {status === "approved" && (
                <div className="space-y-3 rounded-xl border border-emerald-500/25 bg-emerald-50/50 p-3.5 dark:bg-emerald-950/15">
                  <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{t("admin.review.adjustDates") || "Validity & Expiry Schedule"}</span>
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                      {calculateDaysValidity()} Days Valid
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        {t("admin.review.startDate") || "Start Date"} *
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-xl border border-secondary-200 bg-white px-2.5 py-1.5 text-xs font-medium text-secondary-900 focus:border-emerald-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-950 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        {t("admin.review.expiryDate") || "Expiration Date"} *
                      </label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full rounded-xl border border-secondary-200 bg-white px-2.5 py-1.5 text-xs font-medium text-secondary-900 focus:border-emerald-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-950 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* If Rejected: Rejection Reason Selection */}
              {status === "rejected" && (
                <div className="space-y-3 rounded-xl border border-rose-500/25 bg-rose-50/50 p-3.5 dark:bg-rose-950/20">
                  <label className="block text-xs font-semibold text-rose-800 dark:text-rose-300">
                    {t("admin.review.rejectionReason") || "Select Rejection Reason"} *
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full rounded-xl border border-secondary-200 bg-white px-3 py-1.5 text-xs font-medium text-secondary-900 focus:border-rose-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-950 dark:text-white"
                  >
                    <option value="illegible_copy">{t("rejectionReasons.illegible_copy") || "Illegible or Low Quality Copy"}</option>
                    <option value="expired_date">{t("rejectionReasons.expired_date") || "Document Expired or Invalid Date"}</option>
                    <option value="missing_stamps">{t("rejectionReasons.missing_stamps") || "Missing Official Stamps or Signature"}</option>
                    <option value="mismatch_details">{t("rejectionReasons.mismatch_details") || "Incorrect Company Details / Mismatch"}</option>
                    <option value="wrong_category">{t("rejectionReasons.wrong_category") || "Wrong Document Category Uploaded"}</option>
                    <option value="other">{t("rejectionReasons.other") || "Other Reason"}</option>
                  </select>
                </div>
              )}

              {/* Reviewer Remarks */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-secondary-700 dark:text-secondary-300">
                  {t("admin.review.notes") || "Reviewer Notes & Feedback (Optional)"}
                </label>
                <textarea
                  rows={2}
                  placeholder="Add feedback for customer or internal audit notes..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full rounded-xl border border-secondary-200 bg-white p-2.5 text-xs text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-secondary-100 bg-secondary-50/80 px-6 py-3.5 dark:border-secondary-800 dark:bg-secondary-950">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFullscreenOpen(true)}
                className="rounded-xl border-secondary-200 bg-white text-xs font-semibold text-secondary-700 hover:bg-secondary-100 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200"
              >
                <Maximize2 className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5 text-primary-500" />
                <span>{t("documents.previewModal.openFullScreen") || "Inspect Fullscreen"}</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border-secondary-200 bg-white text-xs dark:border-secondary-700 dark:bg-secondary-800"
              >
                {t("common.cancel") || "Cancel"}
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
                    <span>{t("common.saving") || "Saving..."}</span>
                  </span>
                ) : (
                  <span>
                    {status === "approved"
                      ? (t("admin.review.approveSaveBtn") || "Confirm & Approve")
                      : (t("admin.review.rejectSaveBtn") || "Confirm & Reject")}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Overlay Viewer */}
      {isFullscreenOpen && (
        <LiveDocumentViewerModal
          isOpen={isFullscreenOpen}
          onClose={() => setIsFullscreenOpen(false)}
          fileUrl={document.fileUrl}
          fileName={document.fileName}
          title={editableTitle || document.title}
          mimeType={document.mimeType}
        />
      )}
    </>
  )
}
