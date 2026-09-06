"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { UploadCloud, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"
import { MultiFileUploadZone } from "@/components/portal/documents/MultiFileUploadZone"
import { DocumentTable } from "@/components/portal/documents/DocumentTable"
import { usePortal } from "@/components/portal/PortalContext"

export default function RequestDetailsAndDocumentsPage() {
  const params = useParams()
  const t = useTranslations()
  const [request, setRequest] = useState<any>(null)
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
      // Since we don't have a GET /api/portal/requests/[id] yet, let's fetch all and filter
      const res = await fetch("/api/portal/requests")
      const data = await res.json()
      if (data.requests) {
        const req = data.requests.find((r: any) => r._id === params.id)
        setRequest(req)
      }
    } catch (err) {
      toast.error("Failed to load request")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadDone = () => {
    refreshData()
    toast.success("Documents uploaded successfully")
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

        {/* Timeline & Quote */}
        {request.timeline && request.timeline.length > 0 && (
          <div className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">{t("portal.requests.modalMilestonesTitle") || "Request Timeline & Status"}</h2>
            
            {request.details?.quote && (
              <div className="mb-6 rounded-xl border border-primary-100 bg-primary-50 p-4 dark:border-primary-900/30 dark:bg-primary-900/10">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Official Schedule & Quote
                </h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-secondary-500">Departure Date</div>
                  <div className="font-bold text-secondary-900 dark:text-white">{request.details.quote.departureDate}</div>
                  
                  <div className="text-secondary-500">Arrival Date</div>
                  <div className="font-bold text-secondary-900 dark:text-white">{request.details.quote.arrivalDate}</div>
                  
                  <div className="text-secondary-500">Transit Time</div>
                  <div className="font-bold text-secondary-900 dark:text-white">{request.details.quote.transitTime || "-"}</div>
                  
                  <div className="text-secondary-500">Price</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">{request.details.quote.price} {request.details.quote.currency}</div>
                </div>
                {request.details.quote.notes && (
                  <p className="mt-3 text-sm text-secondary-600 dark:text-secondary-400 border-t border-primary-200/50 dark:border-primary-800/50 pt-3">
                    <span className="font-bold mr-1">Notes:</span>
                    {request.details.quote.notes}
                  </p>
                )}
              </div>
            )}

            <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-secondary-200 dark:before:bg-secondary-800">
              {request.timeline.map((item: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 ring-4 ring-white dark:ring-secondary-900"></div>
                  <p className="text-sm font-bold text-secondary-900 dark:text-white">
                    {item.status ? (t(`portal.requests.milestone_${item.status}_title`) !== `portal.requests.milestone_${item.status}_title` ? t(`portal.requests.milestone_${item.status}_title`) : item.title) : item.title}
                  </p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {item.status ? (t(`portal.requests.milestone_${item.status}_comment`) !== `portal.requests.milestone_${item.status}_comment` ? t(`portal.requests.milestone_${item.status}_comment`) : item.comment) : item.comment}
                  </p>
                  <span suppressHydrationWarning className="text-[11px] text-secondary-400 mt-2 block">{new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Documents Upload */}
        <div className="bg-white dark:bg-secondary-900 rounded-xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <UploadCloud className="text-primary-600" />
            {t("portal.requests.details.upload_required") || "Upload Required Documents"}
          </h2>
          <p className="text-sm text-secondary-500 mb-6">
            {t("portal.requests.details.upload_desc") || "Please upload the necessary documents for your selected services (e.g., Commercial Invoice, Packing List, Bill of Lading, ACID)."}
          </p>
          
          <div className="mb-8">
            <MultiFileUploadZone
              currentCount={0}
              maxAllowed={10}
              onUploadComplete={handleUploadDone}
              // Ideally we pass an entityId here so documents are linked to this request
              entityType="request"
              entityId={request._id}
            />
          </div>

          <h3 className="text-lg font-bold mb-4">{t("portal.requests.details.uploaded_docs") || "Uploaded Documents for this Request"}</h3>
          {/* We reuse the DocumentTable but filter by entityId in a real implementation */}
          <DocumentTable />
        </div>

        <div className="flex justify-center mt-8">
          <a
            href="/portal/requests"
            className="rounded-xl bg-primary-600 px-8 py-3 font-bold text-white shadow hover:bg-primary-700 transition-colors"
          >
            {t("portal.requests.details.finish_return") || "Finish & Return to Requests"}
          </a>
        </div>
      </div>
    </div>
  )
}
