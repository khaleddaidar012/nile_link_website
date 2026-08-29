"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Search,
  Building2,
  FileText,
  Clock,
  AlertOctagon,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Send,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { CustomerDetailDrawer, CustomerDocumentItem } from "./CustomerDetailDrawer"
import { DocumentReviewModal, ReviewDocumentItem } from "@/components/admin/review/DocumentReviewModal"
import { ManualWarningModal } from "@/components/admin/documents/ManualWarningModal"

export interface CustomerAdminItem {
  id: string
  companyName: string
  commercialRegisterNumber: string
  taxCardNumber: string
  contactEmail: string
  contactPhone: string
  accountStatus: "active" | "warning" | "inactive"
  statusReason?: string
  totalDocs: number
  expiringCount: number
  expiredCount: number
  pendingCount: number
  maxAllowed: number
  createdAt: string
}

export function CustomerOverviewTable() {
  const t = useTranslations()
  const [customers, setCustomers] = useState<CustomerAdminItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [reviewDocTarget, setReviewDocTarget] = useState<ReviewDocumentItem | null>(null)
  const [warningModalTarget, setWarningModalTarget] = useState<CustomerAdminItem | null>(null)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)

      const res = await fetch(`/api/admin/customers?${params.toString()}`)
      const data = await res.json()
      if (data.customers) {
        setCustomers(data.customers)
      }
    } catch {
      // Error fetching
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [search, statusFilter])

  const handleRowClick = (customer: CustomerAdminItem) => {
    setSelectedCustomerId(customer.id)
    setIsDrawerOpen(true)
  }

  const handleReviewFromDrawer = (
    doc: CustomerDocumentItem,
    companyName: string,
    crNumber: string
  ) => {
    setReviewDocTarget({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      companyName,
      commercialRegisterNumber: crNumber,
      uploadedByName: "Customer User",
      uploadedByEmail: "client@nilelink.com",
      createdAt: doc.createdAt,
    })
  }

  const renderStatusBadge = (status: string, reason?: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{t("admin.customers.statusActive") || "Active"}</span>
        </span>
      )
    }
    if (status === "warning") {
      return (
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 animate-pulse"
          title={reason}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{t("admin.customers.statusWarning") || "Warning"}</span>
        </span>
      )
    }
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400"
        title={reason}
      >
        <XCircle className="h-3.5 w-3.5" />
        <span>{t("admin.customers.statusInactive") || "Restricted"}</span>
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            placeholder={t("admin.customers.searchPlaceholder") || "Search by company name, CR number, or email..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-secondary-200 bg-white py-2.5 pr-4 pl-10 text-xs font-medium text-secondary-900 placeholder-secondary-400 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-800 dark:bg-secondary-900 dark:text-white rtl:pr-10 rtl:pl-4"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-secondary-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-secondary-700 shadow-sm focus:border-primary-500 focus:outline-none dark:border-secondary-800 dark:bg-secondary-900 dark:text-secondary-300"
          >
            <option value="all">{t("admin.customers.filterAll") || "All Account Statuses"}</option>
            <option value="active">{t("admin.customers.filterActive") || "Active & Compliant"}</option>
            <option value="warning">{t("admin.customers.filterWarning") || "Warning / Action Required"}</option>
            <option value="inactive">{t("admin.customers.filterInactive") || "Inactive / Restricted"}</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchCustomers}
            className="border-secondary-200 bg-white hover:bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-900"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Table Canvas */}
      <div className="overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs rtl:text-right">
            <thead className="border-b border-secondary-100 bg-secondary-50/75 text-[11px] font-bold text-secondary-600 uppercase tracking-wider dark:border-secondary-800 dark:bg-secondary-800/50 dark:text-secondary-400">
              <tr>
                <th className="px-5 py-3.5">{t("admin.customerTable.client") || "Client / Company"}</th>
                <th className="px-4 py-3.5">{t("admin.customerTable.totalDocs") || "Documents"}</th>
                <th className="px-4 py-3.5">{t("admin.customerTable.expiring") || "Expiring (≤10d)"}</th>
                <th className="px-4 py-3.5">{t("admin.customerTable.expired") || "Expired"}</th>
                <th className="px-4 py-3.5">{t("admin.customerTable.status") || "Account Status"}</th>
                <th className="px-5 py-3.5 text-right rtl:text-left">{t("admin.customerTable.actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary-500" />
                      <span>{t("common.loading") || "Loading customer overview..."}</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-secondary-400">
                    <Building2 className="mx-auto h-8 w-8 text-secondary-300 dark:text-secondary-600" />
                    <p className="mt-2 text-sm font-bold text-secondary-700 dark:text-secondary-300">
                      {t("admin.customers.noCustomers") || "No customers found"}
                    </p>
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => handleRowClick(cust)}
                    className="group cursor-pointer transition-colors hover:bg-secondary-50/60 dark:hover:bg-secondary-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 transition-transform group-hover:scale-105">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-secondary-900 dark:text-white text-sm">
                            {cust.companyName}
                          </p>
                          <p className="text-[11px] text-secondary-500">
                            CR: {cust.commercialRegisterNumber} • {cust.contactEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-secondary-900 dark:text-white">
                          {cust.totalDocs}
                        </span>
                        <span className="text-secondary-400 text-xs">/ {cust.maxAllowed}</span>
                        {cust.pendingCount > 0 && (
                          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            +{cust.pendingCount} pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {cust.expiringCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Clock className="h-3 w-3" />
                          <span>{cust.expiringCount} files</span>
                        </span>
                      ) : (
                        <span className="text-secondary-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {cust.expiredCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                          <AlertOctagon className="h-3 w-3" />
                          <span>{cust.expiredCount} expired</span>
                        </span>
                      ) : (
                        <span className="text-secondary-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">{renderStatusBadge(cust.accountStatus, cust.statusReason)}</td>
                    <td className="px-5 py-4 text-right rtl:text-left" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2 rtl:justify-start">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRowClick(cust)}
                          className="rounded-xl border-secondary-200 bg-white font-semibold text-secondary-700 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                        >
                          <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                          <span>{t("admin.customerTable.inspect") || "Inspect"}</span>
                        </Button>

                        {(cust.expiringCount > 0 || cust.expiredCount > 0) && (
                          <Button
                            size="sm"
                            onClick={() => setWarningModalTarget(cust)}
                            className="rounded-xl bg-amber-600 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
                          >
                            <Send className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5" />
                            <span>{t("admin.customerTable.sendWarning") || "Alert"}</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Inspection Drawer */}
      <CustomerDetailDrawer
        customerId={selectedCustomerId}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedCustomerId(null)
        }}
        onStatusChanged={fetchCustomers}
        onReviewDocClick={handleReviewFromDrawer}
      />

      {/* Review Modal if triggered from drawer */}
      {reviewDocTarget && (
        <DocumentReviewModal
          document={reviewDocTarget}
          onClose={() => setReviewDocTarget(null)}
          onSuccess={() => {
            setReviewDocTarget(null)
            fetchCustomers()
          }}
        />
      )}

      {/* Manual Warning Modal */}
      {warningModalTarget && (
        <ManualWarningModal
          documentId={warningModalTarget.id}
          documentTitle="Legal Compliance Verification"
          companyName={warningModalTarget.companyName}
          contactEmail={warningModalTarget.contactEmail}
          contactPhone={warningModalTarget.contactPhone}
          onClose={() => setWarningModalTarget(null)}
          onSuccess={fetchCustomers}
        />
      )}
    </div>
  )
}
