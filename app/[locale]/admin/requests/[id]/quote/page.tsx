"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "@/navigation"
import { useLocale } from "next-intl"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  FileText,
  Send,
  Building2,
  Mail,
  Phone,
  Package,
  Ship,
  FileCheck2,
  Truck,
  Receipt,
  Calendar,
  ChevronDown,
  Plus,
  Minus,
  RefreshCw,
  Sparkles,
  Clock,
  AlertCircle,
  Eye,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { Link } from "@/navigation"
import { cn } from "@/lib/utils"

/* ─── helpers ─── */
const SERVICE_ICON_MAP: Record<string, any> = {
  ocean_freight: Ship,
  sea_freight: Ship,
  air_freight: Package,
  customs_clearance: FileCheck2,
  land_transport: Truck,
  land_freight: Truck,
  storage: Receipt,
  default: Package,
}

function getServiceIcon(key: string) {
  const lower = (key || "").toLowerCase()
  for (const [k, v] of Object.entries(SERVICE_ICON_MAP)) {
    if (lower.includes(k.split("_")[0])) return v
  }
  return SERVICE_ICON_MAP.default
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  EGP: "ج.م",
  SAR: "ر.س",
}

const SERVICE_LABELS: Record<string, string> = {
  sea_freight: "شحن بحري",
  ocean_freight: "شحن بحري",
  air_freight: "شحن جوي",
  land_freight: "شحن بري",
  land_transport: "نقل بري",
  customs_clearance: "تخليص جمركي",
  warehousing: "تخزين",
  inland_transportation: "نقل داخلي",
  general_inquiry: "استفسار عام",
  storage: "تخزين",
  freight_booking: "حجز شحن",
}

function getServiceLabel(key: string, isAr: boolean) {
  if (!key) return "—"
  if (isAr && SERVICE_LABELS[key]) return SERVICE_LABELS[key]
  return key.replace(/_/g, " ")
}


/* ─── types ─── */
interface QuoteLineItemBreakdown {
  id: string
  description: string
  basePrice: number | string
  additionalCharges: number | string
}

interface QuoteLineItem {
  requestServiceId: string
  serviceKey: string
  serviceLabelAr: string
  serviceLabelEn: string
  breakdown: QuoteLineItemBreakdown[]
  basePrice: number
  additionalCharges: number
  finalPrice: number
  note: string
}

/* ─── main component ─── */
export default function AdminGenerateQuotePage() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const isAr = locale === "ar"
  const id = params.id as string

  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  /* form state */
  const [currency, setCurrency] = useState("USD")
  const [validUntil, setValidUntil] = useState("")
  const [notes, setNotes] = useState("")
  const [quoteItems, setQuoteItems] = useState<Record<string, QuoteLineItem>>({})
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [generatedQuoteNumber, setGeneratedQuoteNumber] = useState("")

  /* default valid-until = 7 days from now */
  useEffect(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    setValidUntil(d.toISOString().split("T")[0])
  }, [])

  /* fetch */
  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [reqRes, priceRes] = await Promise.all([
        fetch(`/api/admin/requests/${id}`),
        fetch(`/api/admin/requests/${id}/price`),
      ])
      const reqData = await reqRes.json()
      const priceData = await priceRes.json()

      if (reqData.request) {
        setRequest(reqData.request)
        const init: Record<string, QuoteLineItem> = {}
        reqData.request.services?.forEach((s: any) => {
          const match = priceData.data?.find((p: any) => p.serviceId === s._id)
          const base = match?.suggestedPrice ?? 0
          const label = (s.serviceKey || s.serviceType || "service")
          init[s._id] = {
            requestServiceId: s._id,
            serviceKey: label,
            serviceLabelAr: getServiceLabel(label, true),
            serviceLabelEn: getServiceLabel(label, false),
            breakdown: [{ id: Math.random().toString(36).substr(2, 9), description: isAr ? "المرحلة الأولى" : "Leg 1", basePrice: base || "", additionalCharges: "" }],
            basePrice: base || 0,
            additionalCharges: 0,
            finalPrice: base || 0,
            note: "",
          }
        })
        setQuoteItems(init)
      }
    } catch {
      toast.error(isAr ? "فشل تحميل البيانات" : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleItemNoteChange = (sid: string, value: string) => {
    setQuoteItems((prev) => ({
      ...prev,
      [sid]: { ...prev[sid], note: value }
    }))
  }

  const handleBreakdownChange = (sid: string, bid: string, field: keyof QuoteLineItemBreakdown, value: string | number) => {
    setQuoteItems((prev) => {
      const item = { ...prev[sid] }
      const newBreakdown = item.breakdown.map((b) => b.id === bid ? { ...b, [field]: value } : b)
      
      const newBase = newBreakdown.reduce((sum, b) => sum + (Number(b.basePrice) || 0), 0)
      const newExtra = newBreakdown.reduce((sum, b) => sum + (Number(b.additionalCharges) || 0), 0)
      
      item.breakdown = newBreakdown
      item.basePrice = newBase
      item.additionalCharges = newExtra
      item.finalPrice = newBase + newExtra
      
      return { ...prev, [sid]: item }
    })
  }

  const addBreakdownRow = (sid: string) => {
    setQuoteItems((prev) => {
      const item = { ...prev[sid] }
      item.breakdown = [...item.breakdown, { id: Math.random().toString(36).substr(2, 9), description: "", basePrice: "", additionalCharges: "" }]
      return { ...prev, [sid]: item }
    })
  }

  const removeBreakdownRow = (sid: string, bid: string) => {
    setQuoteItems((prev) => {
      const item = { ...prev[sid] }
      item.breakdown = item.breakdown.filter((b) => b.id !== bid)
      
      const newBase = item.breakdown.reduce((sum, b) => sum + (Number(b.basePrice) || 0), 0)
      const newExtra = item.breakdown.reduce((sum, b) => sum + (Number(b.additionalCharges) || 0), 0)
      
      item.basePrice = newBase
      item.additionalCharges = newExtra
      item.finalPrice = newBase + newExtra
      
      return { ...prev, [sid]: item }
    })
  }

  const totalAmount = Object.values(quoteItems).reduce((s, i) => s + i.finalPrice, 0)
  const currSym = CURRENCY_SYMBOLS[currency] || currency

  /* submit */
  const handleSubmit = async () => {
    if (!validUntil) {
      toast.error(isAr ? "حدد تاريخ صلاحية العرض" : "Please set a valid-until date")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request._id,
          customerId: request.customerId._id,
          currency,
          validUntil,
          notes,
          items: Object.values(quoteItems),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedQuoteNumber(data.quote?.quoteNumber || "NL-QT-****")
        setSubmitSuccess(true)
        setStep(3)
      } else {
        console.error("Quote error:", data.details || data.error)
        toast.error(data.details || data.error || (isAr ? "فشل إنشاء العرض" : "Failed to generate quote"))
      }
    } catch {
      toast.error(isAr ? "خطأ في الاتصال" : "Network error")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ─── loading skeleton ─── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary-100 dark:border-primary-900" />
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary-600" />
        </div>
        <p className="text-sm font-semibold text-secondary-500">
          {isAr ? "جاري تحميل بيانات الطلب..." : "Loading request data..."}
        </p>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <p className="text-lg font-bold text-secondary-900 dark:text-white">
          {isAr ? "لم يتم العثور على الطلب" : "Request not found"}
        </p>
        <Link href="/admin/requests">
          <Button variant="outline" className="rounded-xl">
            {isAr ? "العودة إلى القائمة" : "Back to list"}
          </Button>
        </Link>
      </div>
    )
  }

  /* ─── BLOCK IF COMPLIANCE MISSING ─── */
  if (["import", "export", "transit"].includes(request.operationType) && !request.complianceNumber) {
    const type = request.operationType === "export" ? "UCR" : "ACID"
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="h-16 w-16 text-amber-500" />
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {isAr ? "إنشاء العرض معلق" : "Quote Generation Blocked"}
        </h2>
        <p className="max-w-md text-center text-secondary-600 dark:text-secondary-400">
          {isAr 
            ? `يجب إدخال رقم الـ ${type} الخاص بالطلب قبل أن تتمكن من إصدار عرض السعر للعميل.` 
            : `You must issue and provide the ${type} number for this request before you can generate a quote.`}
        </p>
        <Link href={`/admin/requests/${id}`}>
          <Button className="mt-4 rounded-xl px-8">
            {isAr ? "العودة لتفاصيل الطلب لإدخال الرقم" : `Go back to provide ${type}`}
          </Button>
        </Link>
      </div>
    )
  }

  /* ─── STEP 3 SUCCESS ─── */
  if (step === 3 && submitSuccess) {
    return (
      <div className="flex flex-col">
        <AdminHeader
          title={isAr ? "تم إنشاء عرض السعر بنجاح ✓" : "Quote Generated Successfully ✓"}
          subtitle={isAr ? "تم إرسال العرض للعميل فوراً" : "The quote has been sent to the customer"}
        />
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-secondary-900 dark:text-white">
              {isAr ? "تم الإرسال!" : "Quote Sent!"}
            </h2>
            <p className="mt-2 text-secondary-500">
              {isAr
                ? `تم إنشاء عرض السعر ${generatedQuoteNumber} وإرساله للعميل`
                : `Quote ${generatedQuoteNumber} has been created and sent to the customer`}
            </p>

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800/50 dark:bg-emerald-900/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-secondary-700 dark:text-secondary-300">
                  {isAr ? "رقم العرض" : "Quote No."}
                </span>
                <span className="font-mono font-black text-emerald-700 dark:text-emerald-400">
                  {generatedQuoteNumber}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-secondary-700 dark:text-secondary-300">
                  {isAr ? "الإجمالي" : "Total"}
                </span>
                <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                  {currSym} {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/admin/requests">
                <Button className="w-full rounded-xl bg-primary-600 text-white hover:bg-primary-700 sm:w-auto">
                  {isAr ? "العودة إلى الطلبات" : "Back to Requests"}
                </Button>
              </Link>
              <Link href={`/admin/requests/${id}`}>
                <Button variant="outline" className="w-full rounded-xl sm:w-auto">
                  {isAr ? "عرض تفاصيل الطلب" : "View Request Details"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  /* ─── steps indicator ─── */
  const steps = [
    { num: 1, labelAr: "إعدادات العرض", labelEn: "Quote Settings" },
    { num: 2, labelAr: "مراجعة وإرسال", labelEn: "Review & Send" },
  ]

  return (
    <div className="flex flex-col pb-16">
      <AdminHeader
        title={
          isAr
            ? `إنشاء عرض سعر — ${request.trackingNumber}`
            : `Generate Quote — ${request.trackingNumber}`
        }
        subtitle={
          isAr
            ? `${request.customerId?.companyName} · ${request.subject}`
            : `${request.customerId?.companyName} · ${request.subject}`
        }
      />

      <div className="p-6 sm:p-8">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* Back button */}
          <Link href={`/admin/requests/${id}`}>
            <Button variant="outline" size="sm" className="rounded-xl">
              {isAr ? (
                <><ArrowRight className="mr-0 ml-1.5 h-3.5 w-3.5" /> العودة للطلب</>
              ) : (
                <><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Request</>
              )}
            </Button>
          </Link>

          {/* Steps indicator */}
          <div className="flex items-center gap-0">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex flex-1 items-center">
                <button
                  onClick={() => step > s.num && setStep(s.num as 1 | 2)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all",
                    step === s.num
                      ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                      : step > s.num
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-secondary-100 text-secondary-400 dark:bg-secondary-800"
                  )}
                >
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black",
                    step === s.num ? "bg-white/20" : step > s.num ? "bg-emerald-200 dark:bg-emerald-800" : "bg-secondary-200 dark:bg-secondary-700"
                  )}>
                    {step > s.num ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.num}
                  </span>
                  <span className="hidden sm:inline">{isAr ? s.labelAr : s.labelEn}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div className={cn("mx-2 h-0.5 flex-1 rounded", step > s.num ? "bg-emerald-300 dark:bg-emerald-700" : "bg-secondary-200 dark:bg-secondary-800")} />
                )}
              </div>
            ))}
          </div>

          {/* ═══════════ STEP 1 ═══════════ */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: isAr ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isAr ? -30 : 30 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-6 lg:grid-cols-3"
              >
                {/* Left: Line Items */}
                <div className="space-y-4 lg:col-span-2">
                  {/* Quote Settings Card */}
                  <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
                    <h2 className="mb-5 flex items-center gap-2 text-sm font-black text-secondary-900 dark:text-white">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/60">
                        <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </span>
                      {isAr ? "إعدادات عرض السعر" : "Quote Settings"}
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Currency */}
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-secondary-600 dark:text-secondary-400">
                          {isAr ? "العملة" : "Currency"}
                        </label>
                        <div className="relative">
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-secondary-200 bg-white px-3.5 py-2.5 pr-9 text-sm font-semibold text-secondary-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pl-9 rtl:pr-3.5"
                          >
                            <option value="USD">🇺🇸 USD — دولار</option>
                            <option value="EUR">🇪🇺 EUR — يورو</option>
                            <option value="EGP">🇪🇬 EGP — جنيه مصري</option>
                            <option value="SAR">🇸🇦 SAR — ريال سعودي</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:right-auto rtl:left-3" />
                        </div>
                      </div>

                      {/* Valid Until */}
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-secondary-600 dark:text-secondary-400">
                          {isAr ? "صالح حتى *" : "Valid Until *"}
                        </label>
                        <div className="relative">
                          <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-secondary-400 rtl:left-auto rtl:right-3" />
                          <input
                            type="date"
                            required
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="w-full rounded-xl border border-secondary-200 bg-white px-3.5 py-2.5 pl-10 text-sm font-semibold text-secondary-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pl-3.5 rtl:pr-10"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-bold text-secondary-600 dark:text-secondary-400">
                          {isAr ? "ملاحظات للعميل" : "Notes to Customer"}
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          placeholder={isAr ? "أي شروط أو أحكام خاصة بهذا العرض..." : "Any special terms or conditions for this quote..."}
                          className="w-full resize-none rounded-xl border border-secondary-200 bg-white px-3.5 py-2.5 text-sm text-secondary-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Line Items */}
                  <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
                    <h2 className="mb-5 flex items-center gap-2 text-sm font-black text-secondary-900 dark:text-white">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/60">
                        <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </span>
                      {isAr ? "بنود الخدمات والتسعير" : "Service Line Items & Pricing"}
                    </h2>

                    <div className="space-y-4">
                      {request.services?.map((service: any, idx: number) => {
                        const item = quoteItems[service._id]
                        if (!item) return null
                        const IconComp = getServiceIcon(item.serviceKey)
                        const colors = [
                          "from-blue-500 to-cyan-500",
                          "from-emerald-500 to-teal-500",
                          "from-orange-500 to-amber-500",
                          "from-violet-500 to-purple-500",
                          "from-rose-500 to-pink-500",
                        ]
                        return (
                          <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.07 }}
                            className="overflow-hidden rounded-2xl border border-secondary-200/80 dark:border-secondary-800"
                          >
                            {/* Service header */}
                            <div className="flex items-center gap-3 border-b border-secondary-100 bg-secondary-50/60 px-4 py-3 dark:border-secondary-800 dark:bg-secondary-800/40">
                              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", colors[idx % colors.length])}>
                                <IconComp className="h-4 w-4" />
                              </div>
                              <span className="font-bold text-secondary-900 capitalize dark:text-white">
                                {isAr ? item.serviceLabelAr : item.serviceLabelEn}
                              </span>
                              <span className={cn(
                                "ml-auto rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase rtl:ml-0 rtl:mr-auto",
                                service.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-100 text-emerald-700"
                              )}>
                                {isAr ? "قيد الانتظار" : service.status || "pending"}
                              </span>
                            </div>

                            {/* Breakdown pricing legs */}
                            <div className="space-y-3 p-4">
                              {item.breakdown.map((leg, legIdx) => (
                                <div key={leg.id} className="relative rounded-xl border border-secondary-100 bg-secondary-50/50 p-3 pb-4 pt-4 dark:border-secondary-800 dark:bg-secondary-900/50">
                                  {/* Delete leg button */}
                                  {item.breakdown.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeBreakdownRow(service._id, leg.id)}
                                      className="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400 rtl:-left-2.5 rtl:-right-auto"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </button>
                                  )}
                                  
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    {/* Description */}
                                    <div>
                                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-secondary-500">
                                        {isAr ? "الوصف" : "Description"}
                                      </label>
                                      <input
                                        type="text"
                                        value={leg.description}
                                        onChange={(e) => handleBreakdownChange(service._id, leg.id, "description", e.target.value)}
                                        placeholder={isAr ? "مثال: من المصنع للميناء" : "e.g., Factory to Port"}
                                        className="w-full rounded-xl border border-secondary-200 bg-white py-2 px-3 text-sm font-semibold text-secondary-900 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                                      />
                                    </div>
                                    
                                    {/* Base Price */}
                                    <div>
                                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-secondary-500">
                                        {isAr ? "السعر الأساسي" : "Base Price"}
                                      </label>
                                      <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-secondary-400 rtl:left-auto rtl:right-3">
                                          {currSym}
                                        </span>
                                        <input
                                          type="number"
                                          min={0}
                                          placeholder="0"
                                          value={leg.basePrice}
                                          onChange={(e) => handleBreakdownChange(service._id, leg.id, "basePrice", e.target.value === "" ? "" : Number(e.target.value))}
                                          className="w-full rounded-xl border border-secondary-200 bg-white py-2 pl-7 pr-3 text-sm font-semibold text-secondary-900 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white rtl:pl-3 rtl:pr-7"
                                        />
                                      </div>
                                    </div>

                                    {/* Additional Charges */}
                                    <div>
                                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                        <Plus className="mr-0.5 inline h-3 w-3" />
                                        {isAr ? "رسوم إضافية" : "Extra Charges"}
                                      </label>
                                      <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-emerald-400 rtl:left-auto rtl:right-3">
                                          {currSym}
                                        </span>
                                        <input
                                          type="number"
                                          min={0}
                                          placeholder="0"
                                          value={leg.additionalCharges}
                                          onChange={(e) => handleBreakdownChange(service._id, leg.id, "additionalCharges", e.target.value === "" ? "" : Number(e.target.value))}
                                          className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 py-2 pl-7 pr-3 text-sm font-semibold text-secondary-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:text-white rtl:pl-3 rtl:pr-7"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Add leg button and Final sum */}
                              <div className="flex items-center justify-between pt-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => addBreakdownRow(service._id)}
                                  className="h-8 rounded-lg border-primary-200 text-xs font-bold text-primary-700 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/30"
                                >
                                  <Plus className="mr-1 h-3 w-3 rtl:ml-1 rtl:mr-0" />
                                  {isAr ? "إضافة مرحلة" : "Add Leg"}
                                </Button>
                                
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                                    {isAr ? "إجمالي الخدمة:" : "Service Total:"}
                                  </span>
                                  <div className="flex h-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-indigo-600 px-3 text-sm font-black text-white shadow-sm">
                                    {currSym} {item.finalPrice.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Note per service */}
                            <div className="border-t border-secondary-100 px-4 pb-4 dark:border-secondary-800">
                              <input
                                type="text"
                                value={item.note}
                                onChange={(e) => handleItemNoteChange(service._id, e.target.value)}
                                placeholder={isAr ? "ملاحظة خاصة بهذه الخدمة (اختياري)..." : "Note specific to this service (optional)..."}
                                className="mt-3 w-full rounded-xl border border-secondary-200 bg-secondary-50 px-3.5 py-2 text-xs text-secondary-700 transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800/60 dark:text-secondary-300"
                              />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right sidebar: summary + client */}
                <div className="space-y-4">
                  {/* Client info */}
                  <div className="rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
                    <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                      {isAr ? "معلومات العميل" : "Client Info"}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/60">
                          <Building2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-[10px] text-secondary-400">{isAr ? "الشركة" : "Company"}</p>
                          <p className="font-bold text-secondary-900 dark:text-white">
                            {request.customerId?.companyName || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary-100 dark:bg-secondary-800">
                          <Mail className="h-4 w-4 text-secondary-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-secondary-400">{isAr ? "البريد" : "Email"}</p>
                          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                            {request.customerId?.contactEmail || "—"}
                          </p>
                        </div>
                      </div>
                      {request.customerId?.contactPhone && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary-100 dark:bg-secondary-800">
                            <Phone className="h-4 w-4 text-secondary-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-secondary-400">{isAr ? "الهاتف" : "Phone"}</p>
                            <p className="text-xs font-semibold text-secondary-900 dark:text-white">
                              {request.customerId.contactPhone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live price summary */}
                  <div className="sticky top-24 rounded-2xl border border-primary-200/70 bg-gradient-to-br from-primary-50 to-indigo-50/60 p-5 shadow-sm dark:border-primary-800/50 dark:from-primary-950/30 dark:to-indigo-950/20">
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary-700 dark:text-primary-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      {isAr ? "ملخص العرض" : "Quote Summary"}
                    </h3>

                    <div className="space-y-2.5">
                      {Object.values(quoteItems).map((item) => (
                        <div key={item.requestServiceId} className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs font-semibold capitalize text-secondary-600 dark:text-secondary-400">
                            {isAr ? item.serviceLabelAr : item.serviceLabelEn}
                          </span>
                          <span className="shrink-0 text-xs font-black text-secondary-900 dark:text-white">
                            {currSym} {item.finalPrice.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 border-t border-primary-200/60 pt-4 dark:border-primary-800/40">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary-800 dark:text-primary-200">
                          {isAr ? "الإجمالي" : "Total"}
                        </span>
                        <span className="text-2xl font-black text-primary-700 dark:text-primary-300">
                          {currSym} {totalAmount.toLocaleString()}
                        </span>
                      </div>
                      {validUntil && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-primary-600 dark:text-primary-400">
                          <Clock className="h-3 w-3" />
                          {isAr ? `صالح حتى ${validUntil}` : `Valid until ${validUntil}`}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => setStep(2)}
                      className="mt-5 w-full rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3 font-black text-white shadow-lg shadow-primary-500/25 hover:from-primary-700 hover:to-indigo-700"
                    >
                      <Eye className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" />
                      {isAr ? "مراجعة وإرسال" : "Review & Send"}
                      <ArrowRight className="mr-0 ml-1.5 h-4 w-4 rtl:ml-0 rtl:mr-1.5 rtl:rotate-180" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ STEP 2 — REVIEW ═══════════ */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: isAr ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isAr ? 30 : -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Quote Preview Card — styled like a real quote document */}
                <div className="overflow-hidden rounded-3xl border border-secondary-200 bg-white shadow-xl dark:border-secondary-800 dark:bg-secondary-900">
                  {/* Document Header */}
                  <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-600 px-8 py-8 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-white/20 p-1.5">
                            <div className="h-full w-full rounded bg-white/60" />
                          </div>
                          <span className="text-lg font-black tracking-tight">NileLink LOGISTICS</span>
                        </div>
                        <p className="mt-1 text-xs text-primary-200">
                          {isAr ? "عرض أسعار رسمي" : "Official Freight Quotation"}
                        </p>
                      </div>
                      <div className="text-right rtl:text-left">
                        <p className="text-xs text-primary-200">{isAr ? "رقم العرض" : "Quote No."}</p>
                        <p className="font-mono text-lg font-black">NL-QT-{new Date().getFullYear()}-XXXX</p>
                        <p className="mt-1 flex items-center justify-end gap-1 text-xs text-primary-200 rtl:justify-start">
                          <Calendar className="h-3 w-3" />
                          {new Date().toLocaleDateString(isAr ? "ar-EG" : "en-US")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Client + Request info */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-secondary-500">
                          {isAr ? "مقدم إلى" : "Prepared For"}
                        </p>
                        <p className="text-lg font-black text-secondary-900 dark:text-white">
                          {request.customerId?.companyName}
                        </p>
                        <p className="text-xs text-secondary-500">{request.customerId?.contactEmail}</p>
                        {request.customerId?.contactPhone && (
                          <p className="text-xs text-secondary-500">{request.customerId.contactPhone}</p>
                        )}
                      </div>
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-secondary-500">
                          {isAr ? "تفاصيل الطلب" : "Request Details"}
                        </p>
                        <p className="font-mono text-sm font-bold text-primary-600 dark:text-primary-400">
                          {request.trackingNumber}
                        </p>
                        <p className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                          {request.subject}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-secondary-500">
                          <Clock className="h-3 w-3" />
                          {isAr ? `صالح حتى: ${validUntil}` : `Valid Until: ${validUntil}`}
                        </div>
                      </div>
                    </div>

                    {/* Line items table */}
                    <div className="overflow-hidden rounded-2xl border border-secondary-200 dark:border-secondary-800">
                      <table className="w-full text-left text-xs rtl:text-right">
                        <thead className="border-b border-secondary-200 bg-secondary-50 dark:border-secondary-800 dark:bg-secondary-800/50">
                          <tr>
                            <th className="px-4 py-3 font-black uppercase tracking-wider text-secondary-600 dark:text-secondary-400">
                              {isAr ? "الخدمة" : "Service"}
                            </th>
                            <th className="px-4 py-3 text-center font-black uppercase tracking-wider text-secondary-600 dark:text-secondary-400">
                              {isAr ? "أساسي" : "Base"}
                            </th>
                            <th className="px-4 py-3 text-center font-black uppercase tracking-wider text-emerald-600">
                              {isAr ? "إضافي" : "Extra"}
                            </th>
                            <th className="px-4 py-3 text-right font-black uppercase tracking-wider text-primary-700 dark:text-primary-400 rtl:text-left">
                              {isAr ? "الإجمالي" : "Total"}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                          {Object.values(quoteItems).map((item, idx) => {
                            const IconComp = getServiceIcon(item.serviceKey)
                            return (
                              <tr key={item.requestServiceId} className="hover:bg-secondary-50/60 dark:hover:bg-secondary-800/30">
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <IconComp className="h-4 w-4 text-primary-500" />
                                    <div>
                                      <p className="font-bold capitalize text-secondary-900 dark:text-white">
                                        {isAr ? item.serviceLabelAr : item.serviceLabelEn}
                                      </p>
                                      {item.note && (
                                        <p className="text-[10px] text-secondary-400">{item.note}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-center font-semibold text-secondary-700 dark:text-secondary-300">
                                  {currSym} {item.basePrice.toLocaleString()}
                                </td>
                                <td className="px-4 py-3.5 text-center font-semibold text-emerald-600">
                                  {item.additionalCharges > 0 ? `+ ${currSym} ${item.additionalCharges.toLocaleString()}` : "—"}
                                </td>
                                <td className="px-4 py-3.5 text-right rtl:text-left">
                                  <span className="rounded-lg bg-primary-50 px-2.5 py-1 font-black text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                    {currSym} {item.finalPrice.toLocaleString()}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-secondary-200 bg-secondary-50/60 dark:border-secondary-700 dark:bg-secondary-800/30">
                            <td colSpan={3} className="px-4 py-4 font-black text-secondary-900 dark:text-white">
                              {isAr ? "إجمالي عرض السعر" : "Total Quote Amount"}
                            </td>
                            <td className="px-4 py-4 text-right rtl:text-left">
                              <span className="text-xl font-black text-primary-700 dark:text-primary-300">
                                {currSym} {totalAmount.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Notes */}
                    {notes && (
                      <div className="mt-6 rounded-2xl border border-secondary-200 bg-secondary-50 p-4 dark:border-secondary-800 dark:bg-secondary-800/30">
                        <div className="flex items-start gap-2">
                          <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-500">
                              {isAr ? "ملاحظات" : "Notes"}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-secondary-600 dark:text-secondary-400">{notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="rounded-xl"
                  >
                    {isAr ? (
                      <><ArrowRight className="ml-1.5 h-4 w-4" /> تعديل العرض</>
                    ) : (
                      <><ArrowLeft className="mr-1.5 h-4 w-4" /> Edit Quote</>
                    )}
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 font-black text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isSubmitting ? (
                      <><RefreshCw className="mr-1.5 h-4 w-4 animate-spin rtl:mr-0 rtl:ml-1.5" /> {isAr ? "جاري الإرسال..." : "Sending..."}</>
                    ) : (
                      <><Send className="mr-1.5 h-4 w-4 rtl:mr-0 rtl:ml-1.5" /> {isAr ? "إرسال عرض السعر للعميل" : "Send Quote to Customer"}</>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

