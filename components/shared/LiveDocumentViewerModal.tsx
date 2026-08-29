"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Download, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface LiveDocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  fileUrl: string
  fileName: string
  title?: string
  mimeType?: string
}

export function LiveDocumentViewerModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  title,
  mimeType,
}: LiveDocumentViewerModalProps) {
  const [loading, setLoading] = React.useState(true)

  if (!isOpen) return null

  const isImage =
    mimeType?.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileName) ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileUrl)

  const isPdf =
    mimeType === "application/pdf" ||
    /\.pdf$/i.test(fileName) ||
    /\.pdf$/i.test(fileUrl)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-secondary-800 bg-secondary-900 text-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-secondary-800 bg-secondary-950 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600/20 text-primary-400 border border-primary-500/30">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{title || fileName}</h3>
                <p className="text-xs text-secondary-400 font-mono">{fileName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={fileUrl} target="_blank" rel="noreferrer">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-secondary-700 bg-secondary-800 text-xs font-semibold hover:bg-secondary-700"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                  <span>Open Full Screen</span>
                </Button>
              </a>
              <a href={fileUrl} download={fileName}>
                <Button
                  size="sm"
                  className="rounded-xl bg-primary-600 text-xs font-bold text-white shadow hover:bg-primary-700"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                  <span>Download</span>
                </Button>
              </a>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-secondary-400 hover:bg-secondary-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Document Content Canvas */}
          <div className="relative flex flex-1 items-center justify-center overflow-auto bg-black/60 p-4">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary-950/80">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                  <span className="text-xs font-bold text-secondary-400">Loading live document preview...</span>
                </div>
              </div>
            )}

            {isImage ? (
              // Image Viewer
              <img
                src={fileUrl}
                alt={fileName}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
                className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
              />
            ) : isPdf ? (
              // PDF Viewer iFrame
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=0`}
                title={fileName}
                onLoad={() => setLoading(false)}
                className="h-full w-full rounded-xl border border-secondary-800 bg-white"
              />
            ) : (
              // Fallback preview
              <iframe
                src={fileUrl}
                title={fileName}
                onLoad={() => setLoading(false)}
                className="h-full w-full rounded-xl border border-secondary-800 bg-white"
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
