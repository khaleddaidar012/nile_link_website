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

export default function AdminRequestDetailPage() {
  const t = useTranslations()
  const params = useParams()
  const id = params.id as string

  const [request, setRequest] = useState<any>(null)
  const [suggestedPrices, setSuggestedPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequestAndPrices = async () => {
    setLoading(true)
    try {
      // 1. Fetch Request
      const res = await fetch(`/api/admin/requests/${id}`)
      const data = await res.json()
      if (data.request) {
        setRequest(data.request)
      }

      // 2. Fetch Suggested Prices from PricingEngine
      const priceRes = await fetch(`/api/admin/requests/${id}/price`)
      const priceData = await priceRes.json()
      if (priceData.success) {
        setSuggestedPrices(priceData.data)
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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

            {/* Task 05 Placeholder for Quote Gen */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50 p-6 shadow-sm dark:border-primary-900/50 dark:bg-primary-900/10 text-center">
              <h3 className="text-sm font-bold text-primary-900 dark:text-primary-100 mb-2">
                {t("admin.requests.detail.readyToQuote")}
              </h3>
              <p className="text-xs text-primary-700 dark:text-primary-300 mb-4">
                {t("admin.requests.detail.readyToQuoteDesc")}
              </p>
              <Link href={`/admin/requests/${id}/quote`}>
                <Button className="w-full bg-primary-600 text-white hover:bg-primary-700">
                  {t("admin.requests.detail.generateQuote")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
