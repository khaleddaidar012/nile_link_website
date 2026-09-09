"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { UploadCloud, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { MultiFileUploadZone } from "@/components/portal/documents/MultiFileUploadZone"
import { DocumentTable } from "@/components/portal/documents/DocumentTable"
import { usePortal } from "@/components/portal/PortalContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

export default function RequestDetailsAndDocumentsPage() {
  const params = useParams()
  const t = useTranslations()
  const [request, setRequest] = useState<any>(null)
  const [quote, setQuote] = useState<any>(null)
  const [quoteItems, setQuoteItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { refreshData } = usePortal()

  useEffect(() => {
    if (params.id) {
      fetchRequestDetails()
    }
  }, [params.id])

  const fetchRequestDetails = async () => {
    try {
      setLoading(true)
      // Fetch request list and find ours
      const res = await fetch("/api/portal/requests")
      const data = await res.json()
      if (data.requests) {
        const req = data.requests.find((r: any) => r._id === params.id)
        setRequest(req)
      }

      // Fetch quote details
      const quoteRes = await fetch(`/api/portal/requests/${params.id}/quotes`)
      const quoteData = await quoteRes.json()
      if (quoteData.success && quoteData.quote) {
        setQuote(quoteData.quote)
        setQuoteItems(quoteData.items || [])
      }
    } catch (err) {
      toast.error("Failed to load request")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadDone = () => {
    refreshData()
    fetchRequestDetails()
    toast.success("Documents uploaded successfully")
  }

  const handleQuoteAction = async (action: "accept" | "reject") => {
    if (!quote) return
    try {
      setLoading(true)
      const res = await fetch(`/api/portal/quotes/${quote._id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error("Failed to update quote")
      toast.success(action === "accept" ? "Quote accepted" : "Quote rejected")
      fetchRequestDetails()
      refreshData()
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestCompliance = async (type: "ACID" | "UCR") => {
    try {
      setLoading(true)
      const res = await fetch(`/api/portal/requests/${request._id}/request-compliance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complianceType: type }),
      })
      if (!res.ok) throw new Error("Failed to request compliance")
      toast.success(type + " requested successfully")
      fetchRequestDetails()
      refreshData()
    } catch (err) {
      toast.error("An error occurred while requesting " + type)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">{t("portal.requests.details.loading_details") || "Loading request details..."}</div>
  }

  if (!request) {
    return <div className="p-8 text-center text-red-500">{t("portal.requests.details.not_found") || "Request not found."}</div>
  }

  return (
    <div className="flex flex-col pb-20">
      <PortalHeader
        title={t("portal.requests.details.request_tracking", { trackingNumber: request.trackingNumber }) || `Request: ${request.trackingNumber}`}
        subtitle={request.subject}
      />

      <div className="p-6 sm:p-8 max-w-6xl space-y-8">



        {/* Action Required: Upload Documents */}
        {request.status === "document_required" && (
          <div className="bg-white dark:bg-secondary-900 rounded-xl border-2 border-rose-500 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <AlertCircle className="w-32 h-32 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <UploadCloud className="text-rose-600" />
              {t("portal.requests.details.action_required") || "Action Required: Upload Documents"}
            </h2>
            <p className="text-sm text-secondary-500 mb-6 max-w-3xl relative z-10">
              {t("portal.requests.details.upload_docs_desc", { type: request.operationType === "export" ? "UCR" : "ACID" }) || `Your request requires additional documentation (e.g. UCR, ACID) to proceed. Please upload them below.`}
            </p>
            <div className="relative z-10">
              <MultiFileUploadZone
                currentCount={0}
                maxAllowed={5}
                onUploadComplete={handleUploadDone}
                entityId={request._id}
              />
            </div>
          </div>
        )}

        {/* Quotation & Offer */}
        {quote && (
          <div className="bg-white dark:bg-secondary-900 rounded-xl border-2 border-primary-500 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="text-primary-600 h-6 w-6" />
                {t("portal.requests.details.official_quotation") || "Official Quotation & Offer"}
              </h2>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                quote.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                quote.status === "rejected" ? "bg-rose-100 text-rose-700" :
                "bg-amber-100 text-amber-700"
              )}>
                {quote.status}
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {quoteItems.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                  <div>
                    <p className="font-bold capitalize">{t(`portal.requests.new.${item.serviceKey}`) === `portal.requests.new.${item.serviceKey}` ? item.serviceKey.replace(/_/g, " ") : t(`portal.requests.new.${item.serviceKey}`)}</p>
                    {item.note && <p className="text-sm text-secondary-500 mt-1">{item.note}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{item.finalPrice} {quote.currency}</p>
                    {item.additionalCharges > 0 && <p className="text-xs text-secondary-500">Includes {item.additionalCharges} {quote.currency} surcharges</p>}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center p-4 border-t-2 border-primary-100 dark:border-primary-900 mt-4">
                <span className="text-lg font-bold">{t("portal.requests.details.total_final_price") || "Total Final Price"}</span>
                <span className="text-2xl font-black text-primary-600 dark:text-primary-400">{quote.totalAmount} {quote.currency}</span>
              </div>
            </div>

            {request.status === "quote_provided" && (
              <div className="flex gap-4">
                <Button className="flex-1" size="lg" onClick={() => handleQuoteAction("accept")}>
                  {t("portal.requests.details.accept_quotation") || "Accept Quotation"}
                </Button>
                <Button variant="outline" className="flex-1" size="lg" onClick={() => handleQuoteAction("reject")}>
                  {t("portal.requests.details.reject_quotation") || "Reject Quotation"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Services Summary */}
        <div className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">{t("portal.requests.details.requested_services") || "Requested Services"}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {request.services?.map((service: any) => (
              <div key={service._id} className="p-4 rounded-lg border border-primary-100 bg-primary-50/50 dark:border-secondary-700 dark:bg-secondary-800/50">
                <h3 className="font-bold text-lg capitalize mb-2">
                  {t(`portal.requests.new.${service.serviceKey}`) === `portal.requests.new.${service.serviceKey}` ? service.serviceKey.replace(/_/g, " ") : t(`portal.requests.new.${service.serviceKey}`)}
                </h3>
                <div className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                  <p><span className="font-semibold">{t("portal.requests.details.status")}</span> {t(`portal.requests.status_${service.status}`) || service.status}</p>
                  {service.details?.origin && <p><span className="font-semibold">{t("portal.requests.details.origin")}:</span> {service.details.origin}</p>}
                  {service.details?.destination && <p><span className="font-semibold">{t("portal.requests.details.destination")}:</span> {service.details.destination}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {request.timeline && request.timeline.length > 0 && (
          <div className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">{t("portal.requests.modalMilestonesTitle") || "Request Timeline & Status"}</h2>
            
            <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-secondary-200 dark:before:bg-secondary-800">
              {request.timeline.map((item: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 ring-4 ring-white dark:ring-secondary-900"></div>
                  <p className="text-sm font-bold text-secondary-900 dark:text-white">
                    {item.status ? (t(`portal.requests.milestone_${item.status}_title`, { type: request.operationType === "export" ? "UCR" : "ACID" }) !== `portal.requests.milestone_${item.status}_title` ? t(`portal.requests.milestone_${item.status}_title`, { type: request.operationType === "export" ? "UCR" : "ACID" }) : item.title) : item.title}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {item.status ? (t(`portal.requests.milestone_${item.status}_comment`, { type: request.operationType === "export" ? "UCR" : "ACID" }) !== `portal.requests.milestone_${item.status}_comment` ? t(`portal.requests.milestone_${item.status}_comment`, { type: request.operationType === "export" ? "UCR" : "ACID" }) : item.comment) : item.comment}
                  </p>
                  <span suppressHydrationWarning className="text-[11px] text-secondary-400 mt-2 block">{new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center mt-8 space-y-4">
          <a
            href="/portal/requests"
            className="rounded-xl bg-primary-600 px-8 py-3 font-bold text-white shadow hover:bg-primary-700 transition-colors"
          >
            {t("portal.requests.details.finish_return") || "Finish & Return to Requests"}
          </a>
          
          {request.complianceNumber && (
            <div className="w-full p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-center mt-4">
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                {t("portal.requests.details.compliance_issued", { type: request.complianceType }) || `تم إصدار رقم الـ ${request.complianceType} بنجاح:`}
              </p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 tracking-widest">{request.complianceNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
