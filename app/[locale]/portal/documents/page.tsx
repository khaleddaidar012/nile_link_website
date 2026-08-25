"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { UploadCloud, FileText, CheckCircle2 } from "lucide-react"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { MultiFileUploadZone } from "@/components/portal/documents/MultiFileUploadZone"
import { DocumentTable, CustomerDocumentItem } from "@/components/portal/documents/DocumentTable"
import { usePortal } from "@/components/portal/PortalContext"
import { Button } from "@/components/ui/Button"

export default function PortalDocumentsPage() {
  const t = useTranslations()
  const { documentStats, refreshData } = usePortal()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [tableKey, setTableKey] = useState(0)

  const handleUploadDone = () => {
    refreshData()
    setTableKey((k) => k + 1)
  }

  const handleRenew = (doc: CustomerDocumentItem) => {
    setShowUploadModal(true)
  }

  return (
    <div className="flex flex-col">
      <PortalHeader
        title={t("documents.table.title") || "Corporate Documents Registry"}
        subtitle="Upload and manage up to 20 business certificates, licenses & agreements"
      />

      <div className="space-y-6 p-6 sm:p-8">
        {/* Top Action Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-secondary-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-secondary-800 dark:bg-secondary-900">
          <div>
            <h2 className="text-base font-bold text-secondary-900 dark:text-white">
              {t("documents.table.title") || "Company Documents"}
            </h2>
            <p className="text-xs text-secondary-500">
              {documentStats?.totalDocs || 0} of {documentStats?.maxAllowed || 20} documents registered
            </p>
          </div>
          <Button
            onClick={() => setShowUploadModal(!showUploadModal)}
            className="bg-primary-600 font-semibold text-white shadow hover:bg-primary-700"
          >
            <UploadCloud className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
            <span>{showUploadModal ? "Hide Upload Area" : (t("documents.upload.title") || "Upload New Documents")}</span>
          </Button>
        </div>

        {/* Expandable Multi-File Upload Area */}
        {showUploadModal && (
          <div className="rounded-2xl border border-primary-500/30 bg-white p-6 shadow-premium-md dark:border-primary-900/50 dark:bg-secondary-900">
            <h3 className="mb-4 text-sm font-bold text-secondary-900 dark:text-white">
              {t("documents.upload.title") || "Upload Corporate Documents (Up to 20 Files)"}
            </h3>
            <MultiFileUploadZone
              currentCount={documentStats?.totalDocs || 0}
              maxAllowed={documentStats?.maxAllowed || 20}
              onUploadComplete={handleUploadDone}
            />
          </div>
        )}

        {/* Master Documents Data Table */}
        <DocumentTable key={tableKey} onRenewClick={handleRenew} />
      </div>
    </div>
  )
}
