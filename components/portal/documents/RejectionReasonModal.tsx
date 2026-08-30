"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/Button"

interface RejectionReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onRenewClick?: () => void
  docTitle: string
  rejectionReason?: string | null
  reviewNotes?: string | null
}

export function RejectionReasonModal({
  isOpen,
  onClose,
  onRenewClick,
  docTitle,
  rejectionReason,
  reviewNotes,
}: RejectionReasonModalProps) {
  const t = useTranslations()

  if (!isOpen) return null

  const getLocalizedRejectionReason = (reason?: string | null) => {
    if (!reason) return t("documents.rejectionModal.defaultReason") || "Unclear copy or expired validity"
    const standardKeys: Record<string, string> = {
      illegible_copy: t("rejectionReasons.illegible_copy") || "Illegible or Low Quality Copy",
      expired_date: t("rejectionReasons.expired_date") || "Document Expired or Invalid Date",
      missing_stamps: t("rejectionReasons.missing_stamps") || "Missing Official Stamps or Signature",
      mismatch_details: t("rejectionReasons.mismatch_details") || "Incorrect Company Details / Mismatch",
      wrong_category: t("rejectionReasons.wrong_category") || "Wrong Document Category Uploaded",
      other: t("rejectionReasons.other") || "Other Reason",
      "Illegible or Low Quality Copy": t("rejectionReasons.illegible_copy") || "Illegible or Low Quality Copy",
      "Document Expired or Invalid Date": t("rejectionReasons.expired_date") || "Document Expired or Invalid Date",
      "Missing Official Stamps or Signature": t("rejectionReasons.missing_stamps") || "Missing Official Stamps or Signature",
      "Incorrect Company Details / Mismatch": t("rejectionReasons.mismatch_details") || "Incorrect Company Details / Mismatch",
      "Wrong Document Category Uploaded": t("rejectionReasons.wrong_category") || "Wrong Document Category Uploaded",
      "Other": t("rejectionReasons.other") || "Other Reason",
    }
    return standardKeys[reason] || reason
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/30 bg-white p-6 shadow-2xl dark:border-rose-900/50 dark:bg-secondary-900"
        >
          <div className="flex items-start justify-between border-b border-rose-100 pb-4 dark:border-rose-950">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shadow-sm">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">
                  {t("documents.rejectionModal.title") || "Official Rejection Reason"}
                </h3>
                <p className="text-xs text-secondary-500 font-medium dir-ltr">{docTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="my-5 space-y-4">
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/40 dark:bg-rose-950/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                {t("documents.rejectionModal.reasonLabel") || "Official Rejection Reason:"}
              </span>
              <p className="mt-1 text-sm font-black text-rose-950 dark:text-rose-100">
                {getLocalizedRejectionReason(rejectionReason)}
              </p>
            </div>

            {reviewNotes && (
              <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4 dark:border-secondary-800 dark:bg-secondary-800/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                  {t("documents.rejectionModal.notesLabel") || "Review Team Notes:"}
                </span>
                <p className="mt-1 text-xs text-secondary-800 dark:text-secondary-200 leading-relaxed">
                  {reviewNotes}
                </p>
              </div>
            )}

            <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed">
              {t("documents.rejectionModal.notice") ||
                "Please re-upload a valid and clear copy of the document to complete verification."}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl text-xs">
              {t("common.close") || "Close"}
            </Button>
            {onRenewClick && (
              <Button
                onClick={() => {
                  onClose()
                  onRenewClick()
                }}
                className="rounded-xl bg-rose-600 font-bold text-white shadow hover:bg-rose-700 text-xs"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                <span>{t("documents.rejectionModal.reupload") || "Re-upload New Document"}</span>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
