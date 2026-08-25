"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Send, X, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface ManualWarningModalProps {
  documentId: string
  documentTitle: string
  companyName: string
  contactEmail: string
  contactPhone: string
  onClose: () => void
  onSuccess?: () => void
}

export function ManualWarningModal({
  documentId,
  documentTitle,
  companyName,
  contactEmail,
  contactPhone,
  onClose,
  onSuccess,
}: ManualWarningModalProps) {
  const t = useTranslations()
  const [channel, setChannel] = useState<"email" | "whatsapp" | "multi">("multi")
  const [customMessage, setCustomMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSend = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/documents/${documentId}/send-warning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          customMessage: customMessage || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMsg(data.message || "Warning dispatched successfully!")
        setTimeout(() => {
          if (onSuccess) onSuccess()
          onClose()
        }, 1500)
      } else {
        alert(data.error || "Failed to send warning")
      }
    } catch {
      alert("Network error sending warning")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold">Send Expiry Warning</h3>
            <p className="text-xs text-slate-400">
              {companyName} • {documentTitle}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
            <h4 className="mt-3 text-base font-bold text-white">Dispatched!</h4>
            <p className="mt-1 text-xs text-slate-400">{successMsg}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Channel Selection */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Dispatch Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel("email")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all",
                    channel === "email"
                      ? "border-primary-500 bg-primary-950/40 text-primary-300"
                      : "border-slate-800 bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                  )}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Only</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("whatsapp")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all",
                    channel === "whatsapp"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                      : "border-slate-800 bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("multi")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all",
                    channel === "multi"
                      ? "border-indigo-500 bg-indigo-950/40 text-indigo-300 ring-2 ring-indigo-500/20"
                      : "border-slate-800 bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                  )}
                >
                  <Send className="h-4 w-4" />
                  <span>Both Channels</span>
                </button>
              </div>
            </div>

            {/* Recipient Details Preview */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
              <p>
                <span className="font-semibold text-slate-300">Email:</span> {contactEmail}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-slate-300">WhatsApp Phone:</span> {contactPhone}
              </p>
            </div>

            {/* Optional Custom Note */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                Custom Message / Instructions (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Leave blank to send standard automated warning template..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSubmitting}
                className="bg-primary-600 font-semibold text-white hover:bg-primary-700"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Dispatching...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Send className="h-4 w-4" />
                    <span>Send Warning Now</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
