"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Building2,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  Calendar,
  ExternalLink,
  Eye,
  Users,
  CheckCircle2,
  Ban,
  Loader2,
  Mail,
  Phone,
  MapPin,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ExpiryStatusBadge } from "@/components/shared/ExpiryStatusBadge"
import { LiveDocumentViewerModal } from "@/components/shared/LiveDocumentViewerModal"

export interface CustomerDetailData {
  id: string
  companyName: string
  commercialRegisterNumber: string
  taxCardNumber: string
  industry?: string
  country?: string
  city?: string
  address?: string
  contactEmail: string
  contactPhone: string
  accountStatus: "active" | "warning" | "inactive"
  statusReason?: string
  maxAllowedDocuments: number
  createdAt: string
}

export interface CustomerDocumentItem {
  id: string
  title: string
  category: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: "pending_review" | "approved" | "expiring_soon" | "expired" | "rejected"
  startDate?: string
  expiryDate?: string
  rejectionReason?: string
  reviewNotes?: string
  createdAt: string
}

interface CustomerDetailDrawerProps {
  customerId: string | null
  isOpen: boolean
  onClose: () => void
  onStatusChanged?: () => void
  onReviewDocClick?: (doc: CustomerDocumentItem, customerName: string, crNumber: string) => void
}

export function CustomerDetailDrawer({
  customerId,
  isOpen,
  onClose,
  onStatusChanged,
  onReviewDocClick,
}: CustomerDetailDrawerProps) {
  const t = useTranslations()
  const [data, setData] = useState<{
    customer: CustomerDetailData
    users: any[]
    complianceStats: {
      totalDocs: number
      approvedDocs: number
      expiringDocs: number
      expiredDocs: number
      pendingDocs: number
      rejectedDocs: number
      maxAllowed: number
    }
    documents: CustomerDocumentItem[]
  } | null>(null)

  const [loading, setLoading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedTab, setSelectedTab] = useState<"documents" | "profile" | "governance">("documents")
  const [newStatus, setNewStatus] = useState<"active" | "warning" | "inactive">("active")
  const [statusReason, setStatusReason] = useState("")
  const [previewDoc, setPreviewDoc] = useState<CustomerDocumentItem | null>(null)

  const fetchCustomerDetail = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/customers/${id}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
        setNewStatus(json.customer.accountStatus)
        setStatusReason(json.customer.statusReason || "")
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (customerId && isOpen) {
      fetchCustomerDetail(customerId)
    }
  }, [customerId, isOpen, fetchCustomerDetail])

  const handleUpdateStatus = async (statusToSet: "active" | "warning" | "inactive") => {
    if (!customerId) return
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountStatus: statusToSet,
          statusReason:
            statusReason ||
            (statusToSet === "active"
              ? "All documents approved & compliant"
              : statusToSet === "warning"
              ? "Action required on compliance documents"
              : "Account restricted by administrator"),
        }),
      })

      if (res.ok) {
        await fetchCustomerDetail(customerId)
        if (onStatusChanged) onStatusChanged()
      } else {
        const errData = await res.json()
        alert(errData.error || "Status update failed")
      }
    } catch {
      alert("Network error updating status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl dark:bg-secondary-900 border-l border-secondary-200 dark:border-secondary-800 rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r"
        >
          {loading || !data ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center gap-2 text-secondary-500">
                <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                <span className="text-xs font-semibold">{t("common.loading") || "Loading customer details..."}</span>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="border-b border-secondary-100 p-6 dark:border-secondary-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-secondary-900 dark:text-white">
                        {data.customer.companyName}
                      </h2>
                      <p className="text-xs text-secondary-500">
                        CR: {data.customer.commercialRegisterNumber} • Tax ID: {data.customer.taxCardNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-xl p-2 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-700 dark:hover:bg-secondary-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Status & KPI Pills */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="rounded-xl border border-secondary-200/80 bg-secondary-50/50 p-2.5 text-center dark:border-secondary-800 dark:bg-secondary-800/40">
                    <span className="text-[10px] font-bold text-secondary-400 uppercase">Status</span>
                    <div className="mt-1 flex items-center justify-center">
                      {data.customer.accountStatus === "active" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </span>
                      )}
                      {data.customer.accountStatus === "warning" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Warning</span>
                        </span>
                      )}
                      {data.customer.accountStatus === "inactive" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Restricted</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-secondary-200/80 bg-secondary-50/50 p-2.5 text-center dark:border-secondary-800 dark:bg-secondary-800/40">
                    <span className="text-[10px] font-bold text-secondary-400 uppercase">Approved</span>
                    <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {data.complianceStats.approvedDocs}
                    </p>
                  </div>

                  <div className="rounded-xl border border-secondary-200/80 bg-secondary-50/50 p-2.5 text-center dark:border-secondary-800 dark:bg-secondary-800/40">
                    <span className="text-[10px] font-bold text-secondary-400 uppercase">Expiring</span>
                    <p className="mt-1 text-sm font-bold text-amber-600 dark:text-amber-400">
                      {data.complianceStats.expiringDocs}
                    </p>
                  </div>

                  <div className="rounded-xl border border-secondary-200/80 bg-secondary-50/50 p-2.5 text-center dark:border-secondary-800 dark:bg-secondary-800/40">
                    <span className="text-[10px] font-bold text-secondary-400 uppercase">Pending</span>
                    <p className="mt-1 text-sm font-bold text-primary-600 dark:text-primary-400">
                      {data.complianceStats.pendingDocs}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex gap-2 border-b border-secondary-100 dark:border-secondary-800 pb-1">
                  <button
                    onClick={() => setSelectedTab("documents")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      selectedTab === "documents"
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400"
                        : "text-secondary-500 hover:text-secondary-900 dark:hover:text-white"
                    }`}
                  >
                    {t("admin.customers.tabDocs") || "Documents Registry"} ({data.documents.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab("governance")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      selectedTab === "governance"
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400"
                        : "text-secondary-500 hover:text-secondary-900 dark:hover:text-white"
                    }`}
                  >
                    {t("admin.customers.tabGovernance") || "Account Governance"}
                  </button>
                  <button
                    onClick={() => setSelectedTab("profile")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      selectedTab === "profile"
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400"
                        : "text-secondary-500 hover:text-secondary-900 dark:hover:text-white"
                    }`}
                  >
                    {t("admin.customers.tabProfile") || "Company Contacts"}
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedTab === "documents" && (
                  <div className="space-y-3">
                    {data.documents.length === 0 ? (
                      <div className="py-12 text-center text-secondary-400">
                        <FileText className="mx-auto h-8 w-8 text-secondary-300" />
                        <p className="mt-2 text-xs font-bold text-secondary-700 dark:text-secondary-300">
                          {t("admin.customers.noDocs") || "No documents uploaded yet"}
                        </p>
                      </div>
                    ) : (
                      data.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col gap-3 rounded-xl border border-secondary-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-secondary-800 dark:bg-secondary-900/60"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-secondary-900 dark:text-white">
                                {doc.title}
                              </p>
                              <p className="text-[11px] text-secondary-500">
                                {doc.category.replace("_", " ")} • {doc.fileName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <ExpiryStatusBadge
                              status={doc.status}
                              expiryDate={doc.expiryDate}
                            />

                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/60"
                              title="Preview Live Document"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-700 dark:hover:bg-secondary-800"
                                title="Open File"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}

                            {onReviewDocClick && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  onReviewDocClick(
                                    doc,
                                    data.customer.companyName,
                                    data.customer.commercialRegisterNumber
                                  )
                                }
                                className="rounded-lg text-xs"
                              >
                                <FileCheck className="mr-1 h-3 w-3 rtl:mr-0 rtl:ml-1" />
                                <span>{t("admin.customers.reviewAction") || "Review"}</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {selectedTab === "governance" && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-secondary-200 bg-secondary-50/60 p-4 dark:border-secondary-800 dark:bg-secondary-800/40">
                      <h4 className="text-xs font-bold text-secondary-900 dark:text-white">
                        {t("admin.customers.statusControlTitle") || "Account Status & Operational Access"}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-secondary-500">
                        {t("admin.customers.statusControlSub") ||
                          "Change customer legal standing to restrict port operations or reactivate services"}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus("active")}
                          disabled={updatingStatus}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                            data.customer.accountStatus === "active"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                              : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Active (Compliant)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus("warning")}
                          disabled={updatingStatus}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                            data.customer.accountStatus === "warning"
                              ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 ring-2 ring-amber-500/20"
                              : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                          }`}
                        >
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          <span>Warning (Action Needed)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus("inactive")}
                          disabled={updatingStatus}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                            data.customer.accountStatus === "inactive"
                              ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 ring-2 ring-rose-500/20"
                              : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                          }`}
                        >
                          <Ban className="h-3.5 w-3.5 text-rose-600" />
                          <span>Restricted</span>
                        </button>
                      </div>

                      <div className="mt-3">
                        <label className="text-[11px] font-bold text-secondary-700 dark:text-secondary-300">
                          {t("admin.customers.reasonLabel") || "Reason / Customer Notification Note"}
                        </label>
                        <input
                          type="text"
                          value={statusReason}
                          onChange={(e) => setStatusReason(e.target.value)}
                          placeholder="e.g. All documents verified and compliant."
                          className="mt-1 w-full rounded-xl border border-secondary-200 bg-white px-3 py-2 text-xs text-secondary-900 focus:border-primary-500 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === "profile" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-secondary-200 bg-white p-4 dark:border-secondary-800 dark:bg-secondary-900">
                      <h4 className="text-xs font-bold text-secondary-900 dark:text-white">
                        {t("admin.customers.contactDetails") || "Company Location & Contacts"}
                      </h4>
                      <div className="mt-3 space-y-2 text-xs text-secondary-600 dark:text-secondary-300">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-secondary-400" />
                          <span>{data.customer.contactEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-secondary-400" />
                          <span>{data.customer.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-secondary-400" />
                          <span>
                            {data.customer.city || "Cairo"}, {data.customer.country || "Egypt"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-secondary-200 bg-white p-4 dark:border-secondary-800 dark:bg-secondary-900">
                      <h4 className="text-xs font-bold text-secondary-900 dark:text-white">
                        {t("admin.customers.portalUsers") || "Authorized Portal Users"}
                      </h4>
                      <div className="mt-3 space-y-2">
                        {data.users.map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center justify-between rounded-lg bg-secondary-50 p-2.5 dark:bg-secondary-800/60 text-xs"
                          >
                            <div>
                              <p className="font-bold text-secondary-900 dark:text-white">{u.name}</p>
                              <p className="text-[11px] text-secondary-500">{u.email}</p>
                            </div>
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {u.role.replace("_", " ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {previewDoc && (
        <LiveDocumentViewerModal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          fileUrl={previewDoc.fileUrl}
          fileName={previewDoc.fileName}
          title={previewDoc.title}
          mimeType={previewDoc.mimeType}
        />
      )}
    </AnimatePresence>
  )
}
