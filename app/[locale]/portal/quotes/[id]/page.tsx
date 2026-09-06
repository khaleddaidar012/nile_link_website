"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { CheckCircle2, XCircle, ArrowLeft, Loader2, DollarSign, CalendarClock, FileCheck, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { Link } from "@/navigation"

export default function PortalQuotePage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const id = params.id as string

  const [quote, setQuote] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (id) fetchQuote()
  }, [id])

  const fetchQuote = async () => {
    try {
      const res = await fetch(`/api/portal/quotes/${id}`)
      const data = await res.json()
      if (data.success) {
        setQuote(data.quote)
        setItems(data.items)
      } else {
        toast.error(t("portal_quotes.detail.notFound") || "Quote not found")
      }
    } catch {
      toast.error(t("portal_quotes.detail.fetchError") || "Network error fetching quote")
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: "accept" | "reject") => {
    const confirmMsg = action === "accept"
      ? (t("portal_quotes.detail.confirmAccept") || "Are you sure you want to accept this quote?")
      : (t("portal_quotes.detail.confirmReject") || "Are you sure you want to reject this quote?")

    if (!confirm(confirmMsg)) return

    setIsProcessing(true)
    try {
      const res = await fetch(`/api/portal/quotes/${id}/${action}`, { method: "POST" })
      const data = await res.json()

      if (data.success) {
        const msg = action === "accept"
          ? (t("portal_quotes.detail.acceptedSuccess") || "Quote accepted! Our team will be in touch.")
          : (t("portal_quotes.detail.rejectedSuccess") || "Quote rejected.")
        toast.success(msg)
        router.push("/portal/quotes")
      } else {
        toast.error(data.error || t("portal_quotes.detail.actionError") || "Action failed")
      }
    } catch {
      toast.error(t("portal_quotes.detail.fetchError") || "Network error")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-4" />
        <p className="text-sm text-secondary-500">{t("common.loading")}</p>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-semibold">{t("portal_quotes.detail.notFound") || "Quote could not be loaded."}</p>
        <Link href="/portal/quotes" className="mt-4 inline-block text-primary-600 hover:underline text-sm">
          {t("portal_quotes.detail.backToQuotes") || "← Back to Quotes"}
        </Link>
      </div>
    )
  }

  const isActionable = quote.status === "sent"
  const isExpired = quote.validUntil && new Date(quote.validUntil) < new Date()

  return (
    <div className="flex flex-col pb-20">
      <PortalHeader
        title={`${t("portal_quotes.detail.quoteLabel") || "Quote"}: ${quote.quoteNumber}`}
        subtitle={t("portal_quotes.detail.subtitle") || "Review the pricing details for your requested services."}
      />

      <div className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
        <Link href="/portal/quotes">
          <Button variant="outline" className="rounded-xl text-xs mb-2">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 rtl:mr-0 rtl:ml-1.5 rtl:rotate-180" />
            {t("portal_quotes.detail.backToQuotes") || "Back to Quotes"}
          </Button>
        </Link>

        {/* Status Banner */}
        {isActionable && !isExpired && (
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {t("portal_quotes.detail.actionBanner") || "This quote is awaiting your response. Please review the pricing and accept or reject it."}
            </p>
          </div>
        )}

        {/* Quote Header Card */}
        <div className="bg-white dark:bg-secondary-900 rounded-2xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">{t("portal.quotes.detail.totalAmount") || "Total Amount"}</p>
              <h2 className="text-3xl font-bold text-primary-600">
                {quote.totalAmount?.toLocaleString()} <span className="text-xl text-secondary-500">{quote.currency}</span>
              </h2>
              <p suppressHydrationWarning className="text-xs text-secondary-500 mt-2 flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {t("portal_quotes.detail.validUntil") || "Valid Until"}: {new Date(quote.validUntil).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                {isExpired && <span className="ml-2 text-red-500 font-semibold">({t("portal.quotes.status.expired") || "Expired"})</span>}
              </p>
            </div>
            <span className={`self-start md:self-auto px-4 py-1.5 rounded-full text-sm font-bold uppercase ${
              quote.status === "sent"     ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
              quote.status === "accepted" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
            }`}>
              {t(`portal_quotes.status.${quote.status}`) || quote.status}
            </span>
          </div>
        </div>

        {/* Quote Items Breakdown */}
        <div className="bg-white dark:bg-secondary-900 rounded-2xl border border-gray-200 dark:border-secondary-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary-500" />
            {t("portal_quotes.detail.breakdown") || "Service Breakdown"}
          </h3>

          <div className="space-y-3">
            {items.map((item) => {
              const translatedKey = t(`portal.requests.new.${item.serviceKey}`)
              const label = translatedKey !== `portal.requests.new.${item.serviceKey}`
                ? translatedKey
                : item.serviceKey?.replace(/_/g, " ") ?? item.serviceKey

              return (
                <div key={item._id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-xl bg-gray-50 dark:bg-secondary-800/50 dark:border-secondary-700 gap-2">
                  <div>
                    <h4 className="font-bold capitalize text-secondary-900 dark:text-white text-sm">{label}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-secondary-500">
                      {item.basePrice !== item.finalPrice && (
                        <span className="line-through">{item.basePrice} {quote.currency}</span>
                      )}
                      {item.additionalCharges > 0 && (
                        <span className="text-amber-600">+{item.additionalCharges} {t("portal_quotes.detail.surcharge") || "surcharge"}</span>
                      )}
                      {item.discount > 0 && (
                        <span className="text-emerald-600">-{item.discount} {t("portal_quotes.detail.discount") || "discount"}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary-600 shrink-0">
                    {item.finalPrice?.toLocaleString()} <span className="text-sm font-medium text-secondary-500">{quote.currency}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-secondary-700 flex justify-between items-center">
            <span className="text-sm font-bold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
              {t("portal_quotes.detail.totalAmount") || "Total Amount"}
            </span>
            <span className="text-2xl font-bold text-primary-600">
              {quote.totalAmount?.toLocaleString()} {quote.currency}
            </span>
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
            <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1 text-sm flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {t("portal_quotes.detail.notes") || "Notes from NileLink"}
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">{quote.notes}</p>
          </div>
        )}

        {/* Accept / Reject Actions */}
        {isActionable && !isExpired && (
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => handleAction("reject")}
              disabled={isProcessing}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 px-8 py-5 rounded-xl text-base font-bold"
            >
              <XCircle className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2" />
              {t("portal_quotes.detail.reject") || "Reject Quote"}
            </Button>
            <Button
              onClick={() => handleAction("accept")}
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-5 rounded-xl text-base font-bold shadow-md"
            >
              <CheckCircle2 className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2" />
              {t("portal_quotes.detail.accept") || "Accept Quote"}
            </Button>
          </div>
        )}

        {quote.status === "accepted" && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
              {t("portal_quotes.detail.acceptedNote") || "You have accepted this quote. Our operations team will contact you shortly."}
            </p>
          </div>
        )}

        {quote.status === "rejected" && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <XCircle className="h-6 w-6 text-red-600 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300 font-semibold">
              {t("portal_quotes.detail.rejectedNote") || "You have rejected this quote. You can submit a new request or contact us for a revised offer."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
