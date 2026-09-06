"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
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
import { DocumentReviewModal, ReviewDocumentItem } from "@/components/admin/review/DocumentReviewModal"

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

import { AdminHeader } from "@/components/admin/AdminHeader"

export default function CustomerDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const unwrappedParams = use(params)
  const customerId = unwrappedParams.id
  const t = useTranslations()
  const locale = useLocale()
  const isEn = locale === "en"
  const router = useRouter()

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

  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedTab, setSelectedTab] = useState<"documents" | "profile" | "governance">("documents")
  const [newStatus, setNewStatus] = useState<"active" | "warning" | "inactive">("active")
  const [statusReason, setStatusReason] = useState("")
  const [previewDoc, setPreviewDoc] = useState<CustomerDocumentItem | null>(null)
  const [reviewDocTarget, setReviewDocTarget] = useState<ReviewDocumentItem | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchCustomerDetail = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/customers/${id}`)
      if (res.ok) {
        const json = await res.json()
        
        // Sort documents by newest first
        if (json.documents) {
          json.documents.sort((a: CustomerDocumentItem, b: CustomerDocumentItem) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })
        }
        
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
    if (customerId) {
      fetchCustomerDetail(customerId)
    }
  }, [customerId, refreshTrigger, fetchCustomerDetail])

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

  const handleReviewDocClick = (doc: CustomerDocumentItem) => {
    if (!data) return
    setReviewDocTarget({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      companyName: data.customer.companyName,
      commercialRegisterNumber: data.customer.commercialRegisterNumber,
      uploadedByName: "Customer User",
      uploadedByEmail: data.customer.contactEmail,
      createdAt: doc.createdAt,
    })
  }

  const handleReviewSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col h-full bg-secondary-50/30 dark:bg-secondary-950">
      <AdminHeader 
        title={t("admin.customers.detailTitle") || (isEn ? "Customer Compliance Details" : "تفاصيل التزام العميل")}
        subtitle={data?.customer.companyName || ""}
      />
      
      {/* Header & Breadcrumb */}
      <div className="border-b border-secondary-200 bg-white px-6 py-4 dark:border-secondary-800 dark:bg-secondary-900">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/${locale}/admin/customers`)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary-200 bg-white text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 transition-colors dark:border-secondary-700 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-secondary-300 dark:hover:text-white"
          >
            {isEn ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-secondary-500 dark:text-secondary-400">
              <span className="cursor-pointer hover:text-primary-600 transition-colors" onClick={() => router.push(`/${locale}/admin/customers`)}>
                {t("admin.customers.pageTitle") || "Customers"}
              </span>
              <span>/</span>
              <span className="text-secondary-900 dark:text-white">
                {data?.customer.companyName || (t("common.loading") || "Loading...")}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-secondary-900 dark:text-white">
              {t("admin.customers.detailTitle") || (isEn ? "Customer Compliance Details" : "تفاصيل التزام العميل")}
            </h1>
          </div>
        </div>
      </div>

      {loading || !data ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-secondary-500">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="text-sm font-semibold">{t("common.loading") || "Loading customer details..."}</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            
            {/* Customer Summary Card */}
            <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                      {data.customer.companyName}
                    </h2>
                    <p className="mt-1 text-sm text-secondary-500">
                      CR: {data.customer.commercialRegisterNumber} • Tax ID: {data.customer.taxCardNumber}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      {data.customer.accountStatus === "active" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                          <ShieldCheck className="h-4 w-4" />
                          <span>{isEn ? "Active & Compliant" : "نشط ومعتمد"}</span>
                        </span>
                      )}
                      {data.customer.accountStatus === "warning" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{isEn ? "Warning (Action Needed)" : "تحذير - مطلوب إجراء"}</span>
                        </span>
                      )}
                      {data.customer.accountStatus === "inactive" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                          <XCircle className="h-4 w-4" />
                          <span>{isEn ? "Restricted" : "حساب مقيد"}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-50 px-5 py-3 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-[10px] font-bold text-emerald-600/80 uppercase dark:text-emerald-400/80">{isEn ? "Approved" : "معتمد"}</span>
                    <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{data.complianceStats.approvedDocs}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-xl bg-amber-50 px-5 py-3 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                    <span className="text-[10px] font-bold text-amber-600/80 uppercase dark:text-amber-400/80">{isEn ? "Expiring" : "ينتهي قريباً"}</span>
                    <span className="text-xl font-bold text-amber-700 dark:text-amber-400">{data.complianceStats.expiringDocs}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-xl bg-primary-50 px-5 py-3 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50">
                    <span className="text-[10px] font-bold text-primary-600/80 uppercase dark:text-primary-400/80">{isEn ? "Pending" : "قيد المراجعة"}</span>
                    <span className="text-xl font-bold text-primary-700 dark:text-primary-400">{data.complianceStats.pendingDocs}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-secondary-200 dark:border-secondary-800 pb-1">
              <button
                onClick={() => setSelectedTab("documents")}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                  selectedTab === "documents"
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400"
                    : "text-secondary-500 hover:text-secondary-900 hover:bg-secondary-50 dark:hover:bg-secondary-800 dark:hover:text-white"
                }`}
              >
                {t("admin.customers.tabDocs") || (isEn ? "Documents Registry" : "سجل المستندات")} ({data.documents.length})
              </button>
              <button
                onClick={() => setSelectedTab("governance")}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                  selectedTab === "governance"
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400"
                    : "text-secondary-500 hover:text-secondary-900 hover:bg-secondary-50 dark:hover:bg-secondary-800 dark:hover:text-white"
                }`}
              >
                {t("admin.customers.tabGovernance") || (isEn ? "Account Governance" : "إدارة الحساب")}
              </button>
              <button
                onClick={() => setSelectedTab("profile")}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                  selectedTab === "profile"
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400"
                    : "text-secondary-500 hover:text-secondary-900 hover:bg-secondary-50 dark:hover:bg-secondary-800 dark:hover:text-white"
                }`}
              >
                {t("admin.customers.tabProfile") || (isEn ? "Company Contacts" : "جهات الاتصال")}
              </button>
            </div>

            {/* Tab Content */}
            <div className="pt-2">
              {selectedTab === "documents" && (
                <div className="space-y-4">
                  {data.documents.length === 0 ? (
                    <div className="py-20 text-center text-secondary-400 rounded-2xl border-2 border-dashed border-secondary-200 bg-secondary-50/50 dark:border-secondary-800 dark:bg-secondary-900/30">
                      <FileText className="mx-auto h-12 w-12 text-secondary-300" />
                      <p className="mt-3 text-sm font-bold text-secondary-700 dark:text-secondary-300">
                        {t("admin.customers.noDocs") || (isEn ? "No documents uploaded yet" : "لم يتم رفع أي مستندات بعد")}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col gap-4 rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900/60"
                        >
                          {/* Top Row: Info and Status */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-secondary-900 dark:text-white">
                                  {doc.title}
                                </p>
                                <p className="mt-0.5 text-xs text-secondary-500">
                                  {doc.category.replace("_", " ")} • {doc.fileName}
                                </p>
                              </div>
                            </div>
                            
                            <ExpiryStatusBadge status={doc.status} expiryDate={doc.expiryDate} />
                          </div>

                          {/* Middle Row: Dates Grid */}
                          <div className="grid grid-cols-2 gap-4 rounded-xl bg-secondary-50 p-3 dark:bg-secondary-800/40 border border-secondary-100 dark:border-secondary-800">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-secondary-400" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-secondary-500">
                                  {isEn ? "Issue Date" : "تاريخ الإصدار"}
                                </span>
                                <p suppressHydrationWarning className="text-xs font-semibold text-secondary-900 dark:text-secondary-100">
                                  {doc.startDate ? new Date(doc.startDate).toLocaleDateString(locale) : (isEn ? "Not Provided" : "غير محدد")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-secondary-400" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase text-secondary-500">
                                  {isEn ? "Expiry Date" : "تاريخ الانتهاء"}
                                </span>
                                <p suppressHydrationWarning className="text-xs font-semibold text-secondary-900 dark:text-secondary-100">
                                  {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString(locale) : (isEn ? "Not Provided" : "غير محدد")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Actions */}
                          <div className="flex items-center justify-end gap-2 pt-1 border-t border-secondary-100 dark:border-secondary-800/50 pt-3 mt-1">
                            <button
                              type="button"
                              onClick={() => setPreviewDoc(doc)}
                              className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-950/60 dark:text-primary-400 dark:hover:bg-primary-900/80"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>{isEn ? "Preview" : "معاينة"}</span>
                            </button>

                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 rounded-lg border border-secondary-200 bg-white px-3 py-1.5 text-xs font-bold text-secondary-600 transition-colors hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-800/80"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>{isEn ? "Open" : "فتح الملف"}</span>
                              </a>
                            )}

                            <Button
                              size="sm"
                              onClick={() => handleReviewDocClick(doc)}
                              className="ml-2 h-7 rounded-lg text-xs rtl:mr-2 rtl:ml-0"
                            >
                              <FileCheck className="mr-1 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1" />
                              <span>{t("admin.customers.reviewAction") || (isEn ? "Review" : "مراجعة")}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedTab === "governance" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
                    <h4 className="text-base font-bold text-secondary-900 dark:text-white">
                      {t("admin.customers.statusControlTitle") || (isEn ? "Account Status & Operational Access" : "حالة الحساب وصلاحيات العمليات")}
                    </h4>
                    <p className="mt-1 text-sm text-secondary-500">
                      {t("admin.customers.statusControlSub") ||
                        (isEn ? "Change customer legal standing to restrict port operations or reactivate services" : "قم بتغيير الحالة القانونية للعميل لتقييد عمليات الشحن أو إعادة تفعيلها")}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus("active")}
                        disabled={updatingStatus}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 text-sm font-bold transition-all ${
                          data.customer.accountStatus === "active"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm"
                            : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                        }`}
                      >
                        <CheckCircle2 className={`h-5 w-5 ${data.customer.accountStatus === "active" ? "text-emerald-600" : ""}`} />
                        <span>{isEn ? "Active (Compliant)" : "نشط (معتمد)"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus("warning")}
                        disabled={updatingStatus}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 text-sm font-bold transition-all ${
                          data.customer.accountStatus === "warning"
                            ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 ring-2 ring-amber-500/20 shadow-sm"
                            : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                        }`}
                      >
                        <AlertTriangle className={`h-5 w-5 ${data.customer.accountStatus === "warning" ? "text-amber-600" : ""}`} />
                        <span>{isEn ? "Warning (Action Needed)" : "تحذير (مطلوب إجراء)"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus("inactive")}
                        disabled={updatingStatus}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 text-sm font-bold transition-all ${
                          data.customer.accountStatus === "inactive"
                            ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 ring-2 ring-rose-500/20 shadow-sm"
                            : "border-secondary-200 bg-white text-secondary-600 hover:bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
                        }`}
                      >
                        <Ban className={`h-5 w-5 ${data.customer.accountStatus === "inactive" ? "text-rose-600" : ""}`} />
                        <span>{isEn ? "Restricted" : "حساب مقيد"}</span>
                      </button>
                    </div>

                    <div className="mt-6">
                      <label className="text-sm font-bold text-secondary-700 dark:text-secondary-300">
                        {t("admin.customers.reasonLabel") || (isEn ? "Reason / Customer Notification Note" : "السبب / ملاحظة إشعار العميل")}
                      </label>
                      <input
                        type="text"
                        value={statusReason}
                        onChange={(e) => setStatusReason(e.target.value)}
                        placeholder={isEn ? "e.g. All documents verified and compliant." : "مثال: تم مراجعة جميع المستندات واعتمادها"}
                        className="mt-2 w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-sm text-secondary-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === "profile" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
                    <h4 className="text-base font-bold text-secondary-900 dark:text-white mb-6">
                      {t("admin.customers.contactDetails") || (isEn ? "Company Location & Contacts" : "موقع الشركة وجهات الاتصال")}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-100 dark:border-secondary-800">
                        <Mail className="h-6 w-6 text-primary-500 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-secondary-500 uppercase">{isEn ? "Primary Email" : "البريد الإلكتروني الأساسي"}</span>
                          <p className="mt-1 text-sm font-semibold text-secondary-900 dark:text-white">{data.customer.contactEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-100 dark:border-secondary-800">
                        <Phone className="h-6 w-6 text-primary-500 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-secondary-500 uppercase">{isEn ? "Contact Phone" : "رقم الهاتف"}</span>
                          <p className="mt-1 text-sm font-semibold text-secondary-900 dark:text-white" dir="ltr">{data.customer.contactPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-100 dark:border-secondary-800 sm:col-span-2">
                        <MapPin className="h-6 w-6 text-primary-500 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-secondary-500 uppercase">{isEn ? "Address & Location" : "العنوان والموقع"}</span>
                          <p className="mt-1 text-sm font-semibold text-secondary-900 dark:text-white">
                            {data.customer.address || "N/A"}, {data.customer.city || "N/A"} - {data.customer.country || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h5 className="text-sm font-bold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t("admin.customers.teamMembers") || (isEn ? "Team Members" : "أعضاء فريق العمل")}
                      </h5>
                      <div className="space-y-3">
                        {data.users.length === 0 ? (
                          <p className="text-sm text-secondary-500 bg-secondary-50 p-4 rounded-xl dark:bg-secondary-800/40">No team members registered yet.</p>
                        ) : (
                          data.users.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between rounded-xl border border-secondary-100 p-4 dark:border-secondary-800"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 font-bold text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300">
                                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-secondary-900 dark:text-white">
                                    {user.name || "Unnamed User"}
                                  </p>
                                  <p className="text-xs text-secondary-500">{user.email}</p>
                                </div>
                              </div>
                              <span className="rounded-lg bg-secondary-100 px-3 py-1.5 text-xs font-bold text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300">
                                {user.role}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LiveDocumentViewerModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl || ""}
        fileName={previewDoc?.fileName || ""}
        mimeType={previewDoc?.mimeType || ""}
      />

      {reviewDocTarget && (
        <DocumentReviewModal
          document={reviewDocTarget}
          onClose={() => setReviewDocTarget(null)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  )
}
