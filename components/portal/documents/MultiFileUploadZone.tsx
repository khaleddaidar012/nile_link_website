"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCw,
  X,
  Loader2,
  FileCheck,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export type DocumentCategory =
  | "commercial_register"
  | "tax_card"
  | "license"
  | "customs_certificate"
  | "contract"
  | "other"

interface StagedFile {
  id: string
  file: File
  title: string
  category: DocumentCategory
  progress: number
  status: "staged" | "uploading" | "success" | "error"
  errorMessage?: string
}

interface MultiFileUploadZoneProps {
  currentCount: number
  maxAllowed?: number
  onUploadComplete?: () => void
}

export function MultiFileUploadZone({
  currentCount,
  maxAllowed = 20,
  onUploadComplete,
}: MultiFileUploadZoneProps) {
  const t = useTranslations()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  const availableSlots = Math.max(0, maxAllowed - currentCount - stagedFiles.length)

  const autoDetectCategory = (fileName: string): DocumentCategory => {
    const lower = fileName.toLowerCase()
    if (lower.includes("tax") || lower.includes("daraeb") || lower.includes("ضريب")) return "tax_card"
    if (lower.includes("cr") || lower.includes("register") || lower.includes("segel") || lower.includes("سجل")) return "commercial_register"
    if (lower.includes("licen") || lower.includes("rokhasa") || lower.includes("رخص")) return "license"
    if (lower.includes("custom") || lower.includes("gomrok") || lower.includes("جمارك")) return "customs_certificate"
    if (lower.includes("contract") || lower.includes("aqd") || lower.includes("عقد")) return "contract"
    return "other"
  }

  const handleFilesAdded = (files: FileList | File[]) => {
    const newStaged: StagedFile[] = []
    const limit = Math.min(files.length, availableSlots)

    for (let i = 0; i < limit; i++) {
      const file = files[i]
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds maximum allowed size of 10MB.`)
        continue
      }

      newStaged.push({
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        title: file.name.replace(/\.[^/.]+$/, ""),
        category: autoDetectCategory(file.name),
        progress: 0,
        status: "staged",
      })
    }

    setStagedFiles((prev) => [...prev, ...newStaged])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFilesAdded(e.dataTransfer.files)
    }
  }

  const removeFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const updateCategory = (id: string, category: DocumentCategory) => {
    setStagedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, category } : f))
    )
  }

  const updateTitle = (id: string, title: string) => {
    setStagedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, title } : f))
    )
  }

  const uploadSingleFile = async (staged: StagedFile): Promise<boolean> => {
    setStagedFiles((prev) =>
      prev.map((f) => (f.id === staged.id ? { ...f, status: "uploading", progress: 20 } : f))
    )

    const formData = new FormData()
    formData.append("files", staged.file)
    formData.append("categories", staged.category)
    formData.append("titles", staged.title)

    try {
      const progressInterval = setInterval(() => {
        setStagedFiles((prev) =>
          prev.map((f) =>
            f.id === staged.id && f.progress < 90
              ? { ...f, progress: f.progress + 15 }
              : f
          )
        )
      }, 150)

      const res = await fetch("/api/portal/documents/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const errorData = await res.json()
        setStagedFiles((prev) =>
          prev.map((f) =>
            f.id === staged.id
              ? {
                  ...f,
                  status: "error",
                  progress: 100,
                  errorMessage: errorData.error || "Upload failed",
                }
              : f
          )
        )
        return false
      }

      setStagedFiles((prev) =>
        prev.map((f) =>
          f.id === staged.id ? { ...f, status: "success", progress: 100 } : f
        )
      )
      return true
    } catch {
      setStagedFiles((prev) =>
        prev.map((f) =>
          f.id === staged.id
            ? { ...f, status: "error", progress: 100, errorMessage: "Network error" }
            : f
        )
      )
      return false
    }
  }

  const handleUploadAll = async () => {
    if (stagedFiles.length === 0 || isUploading) return
    setIsUploading(true)

    const pendingFiles = stagedFiles.filter(
      (f) => f.status === "staged" || f.status === "error"
    )

    let completed = 0
    for (const staged of pendingFiles) {
      await uploadSingleFile(staged)
      completed += 1
      setOverallProgress(Math.round((completed / pendingFiles.length) * 100))
    }

    setIsUploading(false)
    if (onUploadComplete) {
      onUploadComplete()
    }
  }

  return (
    <div className="space-y-6">
      {/* Quota Indicator Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-secondary-800 dark:bg-secondary-900">
        <div>
          <span className="text-xs font-bold text-secondary-500 uppercase tracking-wider dark:text-secondary-400">
            {t("documents.upload.quotaUsed") || "Document Quota"}
          </span>
          <p className="mt-0.5 text-base font-bold text-secondary-900 dark:text-white">
            {currentCount + stagedFiles.length} / {maxAllowed} Documents Registered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-48 overflow-hidden rounded-full bg-secondary-100 dark:bg-secondary-800">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                currentCount + stagedFiles.length >= maxAllowed
                  ? "bg-rose-500"
                  : currentCount + stagedFiles.length > 15
                    ? "bg-amber-500"
                    : "bg-gradient-to-r from-primary-600 to-primary-400"
              )}
              style={{
                width: `${Math.min(100, ((currentCount + stagedFiles.length) / maxAllowed) * 100)}%`,
              }}
            />
          </div>
          <span className="text-xs font-bold text-secondary-600 dark:text-secondary-300">
            {availableSlots} slots remaining
          </span>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      {availableSlots > 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200",
            isDragging
              ? "border-primary-500 bg-primary-50/50 scale-[0.99] dark:bg-primary-950/20 ring-4 ring-primary-500/10"
              : "border-secondary-300 hover:border-primary-500 hover:bg-secondary-50/50 dark:border-secondary-700 dark:hover:bg-secondary-800/40"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={(e) => {
              if (e.target.files) handleFilesAdded(e.target.files)
            }}
            className="hidden"
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-transform group-hover:scale-110 dark:bg-primary-950/60 dark:text-primary-400 shadow-sm">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-base font-bold text-secondary-900 dark:text-white">
            {t("documents.upload.dropzone") || "Drag & drop files here, or click to browse"}
          </h3>
          <p className="mt-1.5 text-xs text-secondary-500 dark:text-secondary-400 max-w-sm">
            Supports PDF, PNG, JPG, WEBP up to 10MB each. You can upload up to <span className="font-bold text-primary-600 dark:text-primary-400">{availableSlots} more files</span> in this batch.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-red-950/30 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <span>
            {t("documents.upload.quotaLimit") ||
              "Document quota limit of 20 reached. Please contact your account representative to increase storage."}
          </span>
        </div>
      )}

      {/* Aggregate Progress Bar */}
      {isUploading && (
        <div className="rounded-2xl border border-primary-500/30 bg-primary-50/60 p-4 dark:bg-primary-950/30">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-primary-900 dark:text-primary-200">
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary-600" />
              <span>Uploading document batch...</span>
            </span>
            <span>{overallProgress}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary-200/50 dark:bg-primary-900/50">
            <div
              className="h-full bg-primary-600 transition-all duration-300 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Staged Files List */}
      <AnimatePresence>
        {stagedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-secondary-700 uppercase tracking-wider dark:text-secondary-300">
                {t("documents.upload.selectedFiles") || "Staged Files"} ({stagedFiles.length})
              </h4>
              <Button
                size="sm"
                onClick={handleUploadAll}
                disabled={isUploading}
                className="bg-primary-600 font-semibold text-white shadow hover:bg-primary-700"
              >
                {isUploading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>{t("documents.upload.uploadAll") || "Start Uploading Files"}</span>
                  </span>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              {stagedFiles.map((staged) => (
                <motion.div
                  key={staged.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col gap-3 rounded-xl border border-secondary-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-secondary-800 dark:bg-secondary-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        value={staged.title}
                        onChange={(e) => updateTitle(staged.id, e.target.value)}
                        disabled={isUploading || staged.status === "success"}
                        className="w-full truncate rounded-lg border border-transparent bg-transparent text-sm font-bold text-secondary-900 hover:border-secondary-300 focus:border-primary-500 focus:bg-white focus:outline-none dark:text-white dark:hover:border-secondary-700 dark:focus:bg-secondary-800"
                      />
                      <p className="text-[11px] text-secondary-500">
                        {staged.file.name} • {(staged.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Category Selector */}
                    <select
                      value={staged.category}
                      onChange={(e) =>
                        updateCategory(staged.id, e.target.value as DocumentCategory)
                      }
                      disabled={isUploading || staged.status === "success"}
                      className="rounded-xl border border-secondary-200 bg-secondary-50/50 px-3 py-2 text-xs font-semibold text-secondary-700 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                    >
                      <option value="commercial_register">Commercial Register</option>
                      <option value="tax_card">Tax Card</option>
                      <option value="license">Import/Export License</option>
                      <option value="customs_certificate">Customs Certificate</option>
                      <option value="contract">Contract / Agreement</option>
                      <option value="other">Other Document</option>
                    </select>

                    {/* Progress / Status Indicator */}
                    <div className="flex items-center gap-2">
                      {staged.status === "uploading" && (
                        <div className="flex items-center gap-2 text-xs font-bold text-primary-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{staged.progress}%</span>
                        </div>
                      )}
                      {staged.status === "success" && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Uploaded</span>
                        </span>
                      )}
                      {staged.status === "error" && (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                            <XCircle className="h-4 w-4" />
                            <span>{staged.errorMessage || "Failed"}</span>
                          </span>
                          <button
                            onClick={() => uploadSingleFile(staged)}
                            className="rounded-lg p-1.5 text-secondary-500 hover:bg-secondary-100 hover:text-primary-600"
                            title="Retry"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      {staged.status === "staged" && !isUploading && (
                        <button
                          onClick={() => removeFile(staged.id)}
                          className="rounded-lg p-1.5 text-secondary-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
