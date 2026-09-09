"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ArrowLeft, Clock, FileText, RefreshCw, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { Link } from "@/navigation"
import { toast } from "sonner"
import { RequestQRCode } from "@/components/admin/requests/RequestQRCode"

export default function AdminRequestDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const id = params.id as string

  const [request, setRequest] = useState<any>(null)
  const [suggestedPrices, setSuggestedPrices] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [complianceType, setComplianceType] = useState<"ACID" | "UCR" | "">("")
  const [complianceNumber, setComplianceNumber] = useState("")
  const [savingCompliance, setSavingCompliance] = useState(false)
  const [confirmingOrder, setConfirmingOrder] = useState(false)

  const fetchRequestAndPrices = async () => {
    setLoading(true)
    try {
      // 1. Fetch Request
      const res = await fetch(`/api/admin/requests/${id}`)
      const data = await res.json()
      if (data.request) {
        setRequest(data.request)
        if (data.request.operationType === "export") setComplianceType("UCR")
        else if (data.request.operationType === "import" || data.request.operationType === "transit") setComplianceType("ACID")
      }

      // 2. Fetch Suggested Prices from PricingEngine
      const priceRes = await fetch(`/api/admin/requests/${id}/price`)
      const priceData = await priceRes.json()
      if (priceData.success) {
        setSuggestedPrices(priceData.data)
      }

      // 3. Fetch Documents
      const docsRes = await fetch(`/api/admin/requests/${id}/documents`)
      const docsData = await docsRes.json()
      if (docsData.success) {
        setDocuments(docsData.documents)
      }
    } catch (err) {
      toast.error("Failed to fetch request details or prices.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchRequestAndPrices()
  }, [id])

  const handleSaveCompliance = async () => {
    if (!complianceNumber.trim()) {
      toast.error("Please enter a valid number")
      return
    }
    setSavingCompliance(true)
    try {
      const res = await fetch(`/api/admin/requests/${id}/compliance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complianceType, complianceNumber })
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success(`${complianceType} saved successfully`)
      fetchRequestAndPrices()
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setSavingCompliance(false)
    }
  }

  const handleConfirmOrder = async () => {
    setConfirmingOrder(true)
    try {
      const res = await fetch(`/api/admin/requests/${id}/confirm-order`, {
        method: "POST",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to confirm order")
      }
      toast.success("Order confirmed and processing started")
      fetchRequestAndPrices()
    } catch (err: any) {
      toast.error(err.message || "An error occurred")
    } finally {
      setConfirmingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center text-secondary-500">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-500 mb-4" />
        <p>{t("admin.requests.detail.loading")}</p>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-rose-600">{t("admin.requests.detail.notFound")}</h2>
        <Link href="/admin/requests" className="mt-4 inline-block text-primary-600 hover:underline">
          {t("admin.requests.detail.returnToQueue")}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-12">
      <AdminHeader
        title={`Request: ${request.trackingNumber}`}
        subtitle={request.subject}
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Actions & Meta */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/requests">
            <Button variant="outline" className="rounded-xl text-xs">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5 rtl:rotate-180" />
              {t("admin.requests.detail.backToQueue")}
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-bold uppercase",
                request.priority === "urgent"
                  ? "bg-rose-100 text-rose-700"
                  : request.priority === "high"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-secondary-100 text-secondary-700"
              )}
            >
              {request.priority}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-500/20 bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
              <Clock className="h-3.5 w-3.5" />
              <span className="capitalize">{request.status.replace("_", " ")}</span>
            </span>
            <div className="bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-lg p-0.5 shadow-sm">
              <RequestQRCode requestId={request._id} trackingNumber={request.trackingNumber} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
              <h3 className="text-sm font-bold text-secondary-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-500" />
                {t("admin.requests.detail.generalInfo")}
              </h3>
              <p className="text-sm text-secondary-700 dark:text-secondary-300">
                <span className="font-bold">{t("admin.requests.detail.description")} </span>
                {request.description}
              </p>
            </div>

            {/* Nested Services and Pricing Engine */}
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white mt-8 mb-4">
              {t("admin.requests.detail.servicesTitle")}
            </h3>
            
            {request.services?.map((service: any) => {
              const priceMatch = suggestedPrices.find((p) => p.serviceId === service._id)

              return (
                <div
                  key={service._id}
                  className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900 mb-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold capitalize text-lg text-primary-700">
                      {service.serviceKey
                        ? (t(`portal.requests.new.${service.serviceKey}`) !== `portal.requests.new.${service.serviceKey}`
                            ? t(`portal.requests.new.${service.serviceKey}`)
                            : service.serviceKey.replace(/_/g, " "))
                        : t("admin.requests.detail.serviceLabel")}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-1 bg-secondary-100 rounded-lg uppercase">
                      {service.status ? (t(`portal.requests.status_${service.status}`) || service.status) : "—"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-secondary-50 p-4 rounded-xl dark:bg-secondary-800/50 mb-4">
                    {service.details?.origin && (
                      <div>
                        <span className="block text-[10px] font-bold text-secondary-500 uppercase tracking-wider mb-1">
                          {t("admin.requests.detail.origin")}
                        </span>
                        <span className="font-semibold text-secondary-900 dark:text-white">
                          {service.details.origin}
                        </span>
                      </div>
                    )}
                    {service.details?.destination && (
                      <div>
                        <span className="block text-[10px] font-bold text-secondary-500 uppercase tracking-wider mb-1">
                          {t("admin.requests.detail.destination")}
                        </span>
                        <span className="font-semibold text-secondary-900 dark:text-white">
                          {service.details.destination}
                        </span>
                      </div>
                    )}
                    {service.details?.weight && (
                      <div>
                        <span className="block text-[10px] font-bold text-secondary-500 uppercase tracking-wider mb-1">
                          {t("admin.requests.detail.weight")}
                        </span>
                        <span className="font-semibold text-secondary-900 dark:text-white">
                          {service.details.weight} kg
                        </span>
                      </div>
                    )}
                    {service.details?.volume && (
                      <div>
                        <span className="block text-[10px] font-bold text-secondary-500 uppercase tracking-wider mb-1">
                          {t("admin.requests.detail.volume")}
                        </span>
                        <span className="font-semibold text-secondary-900 dark:text-white">
                          {service.details.volume} CBM
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Engine Suggestion */}
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                        <DollarSign size={16} /> {t("admin.requests.detail.suggestedPrice")}
                      </h5>
                      <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 capitalize">
                        {t("admin.requests.detail.matchedRule")} {priceMatch?.pricingType?.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="text-right">
                      {priceMatch && priceMatch.suggestedPrice !== null ? (
                        <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                          {priceMatch.suggestedPrice} {priceMatch.currency}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-amber-600">
                          {t("admin.requests.detail.manualPricing")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Attached Documents */}
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-500" />
              Attached Documents
            </h3>
            <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
              {documents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-secondary-200 dark:border-secondary-800">
                        <th className="pb-3 font-semibold text-secondary-500 uppercase tracking-wider">Document Title</th>
                        <th className="pb-3 font-semibold text-secondary-500 uppercase tracking-wider">Category</th>
                        <th className="pb-3 font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                        <th className="pb-3 text-right font-semibold text-secondary-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                      {documents.map((doc: any) => (
                        <tr key={doc.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                          <td className="py-4 font-medium">{doc.title || doc.fileName}</td>
                          <td className="py-4 capitalize">{doc.category.replace(/_/g, " ")}</td>
                          <td className="py-4">
                            <span className={cn(
                              "px-2.5 py-1 text-xs font-semibold rounded-full",
                              doc.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                              doc.status === "rejected" ? "bg-rose-100 text-rose-700" :
                              "bg-amber-100 text-amber-700"
                            )}>
                              {doc.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            {doc.status === "pending_review" ? (
                              <Link href="/admin/documents/review">
                                <Button size="sm" variant="outline">Review</Button>
                              </Link>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => window.open(doc.fileUrl)}>View</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-secondary-500">
                  <p>No documents attached to this request.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Customs Compliance Input */}
            {complianceType && (
              <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
                <h3 className="text-sm font-bold text-secondary-900 dark:text-white mb-4">
                  Customs Compliance ({complianceType})
                </h3>
                {request.complianceNumber ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      {complianceType} Number Issued
                    </p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{request.complianceNumber}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-secondary-500">
                      You must issue and provide the {complianceType} number before you can generate a quotation for this request.
                    </p>
                    <input
                      type="text"
                      className="w-full rounded-lg border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:border-secondary-700 dark:bg-secondary-900"
                      placeholder={`Enter ${complianceType} number`}
                      value={complianceNumber}
                      onChange={(e) => setComplianceNumber(e.target.value)}
                    />
                    <Button 
                      onClick={handleSaveCompliance} 
                      disabled={savingCompliance || !complianceNumber.trim()}
                      className="w-full"
                    >
                      {savingCompliance ? "Saving..." : `Save ${complianceType}`}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Client Info */}
            <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
              <h3 className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-4">
                {t("admin.requests.detail.clientInfo")}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="block text-[10px] text-secondary-400">{t("admin.requests.detail.companyName")}</span>
                  <span className="font-semibold text-sm text-secondary-900 dark:text-white">
                    {request.customerId?.companyName || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-secondary-400">{t("admin.requests.detail.email")}</span>
                  <a
                    href={request.customerId?.contactEmail ? `mailto:${request.customerId?.contactEmail}` : "#"}
                    className="font-medium text-sm text-primary-600 hover:underline"
                  >
                    {request.customerId?.contactEmail || "N/A"}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Block based on Status */}
            {request.status === "quote_accepted" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/10 text-center">
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                  {t("admin.requests.detail.orderReadyTitle")}
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-4">
                  {t("admin.requests.detail.orderReadyDesc")}
                </p>
                <Button 
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={handleConfirmOrder}
                  disabled={confirmingOrder}
                >
                  {confirmingOrder ? t("admin.requests.detail.confirmingBtn") : t("admin.requests.detail.confirmOrderBtn")}
                </Button>
              </div>
            ) : request.status === "processing" ? (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/10 text-center">
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {t("admin.requests.detail.orderProcessingTitle")}
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {t("admin.requests.detail.orderProcessingDesc")}
                </p>
              </div>
            ) : request.status === "quote_provided" ? (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-900/10 text-center">
                <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                  {t("admin.requests.detail.quoteProvidedTitle")}
                </h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-4">
                  {t("admin.requests.detail.quoteProvidedDesc")}
                </p>
                <Link href={`/admin/requests/${id}/quote`}>
                  <Button variant="outline" className="w-full text-indigo-700 border-indigo-300 hover:bg-indigo-100 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30">
                    {t("admin.requests.detail.viewUpdateQuote")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-primary-200 bg-primary-50 p-6 shadow-sm dark:border-primary-900/50 dark:bg-primary-900/10 text-center">
                <h3 className="text-sm font-bold text-primary-900 dark:text-primary-100 mb-2">
                  {t("admin.requests.detail.readyToQuote")}
                </h3>
                <p className="text-xs text-primary-700 dark:text-primary-300 mb-4">
                  {t("admin.requests.detail.readyToQuoteDesc")}
                </p>
                {complianceType && !request.complianceNumber ? (
                  <div className="p-3 bg-amber-100/50 border border-amber-200 text-amber-800 text-xs rounded-lg text-left">
                    <span className="font-bold block mb-1">Quotation Blocked</span>
                    Please provide the {complianceType} number above before generating a quote.
                  </div>
                ) : (
                  <Link href={`/admin/requests/${id}/quote`}>
                    <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
                      {t("admin.requests.detail.generateQuote")}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
