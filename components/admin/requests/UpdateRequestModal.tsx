"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface UpdateRequestModalProps {
  request: any
  onClose: () => void
  onSuccess: () => void
}

export function UpdateRequestModal({ request, onClose, onSuccess }: UpdateRequestModalProps) {
  const t = useTranslations()
  const [status, setStatus] = useState(request.status)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/requests/${request._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success(t("admin.requests.updateSuccess") || "Request updated successfully")
      onSuccess()
    } catch (error) {
      toast.error(t("admin.requests.updateError") || "Failed to update request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900">
        <div className="flex items-center justify-between border-b border-secondary-100 pb-3 dark:border-secondary-800">
          <h3 className="text-base font-bold text-secondary-900 dark:text-white">
            {t("admin.requests.updateTitle") || "Update Service Request"}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-secondary-50 p-4 dark:bg-secondary-800/50">
          <div className="flex justify-between">
            <span className="text-xs font-bold text-secondary-500">{t("admin.requests.reqId") || "Request ID"}</span>
            <span className="text-xs font-bold font-mono text-primary-600 dark:text-primary-400">{request.trackingNumber}</span>
          </div>
          <h4 className="mt-2 text-sm font-bold text-secondary-900 dark:text-white">{request.subject}</h4>
          {request.customerId && (
            <p className="mt-1 text-xs text-secondary-600 dark:text-secondary-400">{request.customerId.companyName}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
              {t("admin.requests.newStatus") || "New Status"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "under_review", label: t("admin.requests.status_under_review") || "Under Review" },
                { id: "in_progress", label: t("admin.requests.status_in_progress") || "In Progress" },
                { id: "waiting_customer", label: t("admin.requests.status_waiting_customer") || "Waiting for Customer" },
                { id: "completed", label: t("admin.requests.status_completed") || "Completed" },
                { id: "cancelled", label: t("admin.requests.status_cancelled") || "Cancelled" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  className={cn(
                    "rounded-xl border p-3 text-sm font-semibold transition-all",
                    status === s.id
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                      : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-400 dark:hover:bg-secondary-700/50"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
              {t("admin.requests.timelineComment") || "Timeline Comment (Visible to Client)"}
            </label>
            <textarea
              rows={3}
              required
              placeholder={t("admin.requests.commentPlaceholder") || "Explain this status update..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] text-secondary-500">
              {t("admin.requests.commentHelp") || "This message will be instantly added to the client's tracking milestones."}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
              {t("admin.requests.cancel") || "Cancel"}
            </Button>
            <Button type="submit" disabled={isSubmitting || status === request.status} className="rounded-xl bg-primary-600 font-bold text-white shadow hover:bg-primary-700 text-xs">
              {isSubmitting ? t("admin.requests.saving") || "Saving..." : t("admin.requests.saveChanges") || "Update Status"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
