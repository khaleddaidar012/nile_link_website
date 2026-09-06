"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { Button } from "@/components/ui/Button"
import { Warehouse, ArrowLeft, Send, CheckCircle2, Package, MapPin } from "lucide-react"
import { Link } from "@/navigation"
import { cn } from "@/lib/utils"

export default function WarehousingPage() {
  const t = useTranslations()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form State
  const [location, setLocation] = useState("")
  const [storageType, setStorageType] = useState("general")
  const [commodity, setCommodity] = useState("")
  const [volume, setVolume] = useState("")
  const [duration, setDuration] = useState("1_month")
  const [priority, setPriority] = useState("medium")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/portal/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: "warehousing",
          operationType: "storage",
          subject: `Warehousing Request in ${location}`,
          description: `Commodity: ${commodity}, Volume: ${volume} sqm, Duration: ${duration}`,
          priority,
          details: {
            location,
            storageType,
            commodity,
            volume,
            duration
          },
        }),
      })

      if (res.ok) {
        router.push("/portal/requests")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to submit request")
        setIsSubmitting(false)
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-between relative">
      <div className="absolute left-0 top-1/2 w-full h-0.5 bg-secondary-100 dark:bg-secondary-800 -z-10 -translate-y-1/2 rounded"></div>
      
      {[
        { num: 1, label: t("portal.requests.new.warehousing_form.step1") || "Requirements", icon: MapPin },
        { num: 2, label: t("portal.requests.new.sea_freight_form.step2") || "Cargo", icon: Package },
        { num: 3, label: t("portal.requests.new.sea_freight_form.step3") || "Review", icon: CheckCircle2 }
      ].map((s) => (
        <div key={s.num} className="flex flex-col items-center gap-2 bg-white dark:bg-secondary-900 px-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
            step > s.num ? "border-primary-600 bg-primary-600 text-white" :
            step === s.num ? "border-primary-600 bg-white text-primary-600 dark:bg-secondary-900" :
            "border-secondary-200 bg-secondary-50 text-secondary-400 dark:border-secondary-700 dark:bg-secondary-800"
          )}>
            {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
          </div>
          <span className={cn(
            "text-xs font-bold",
            step >= s.num ? "text-secondary-900 dark:text-white" : "text-secondary-400"
          )}>{s.label}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col">
      <PortalHeader
        title={t("portal.requests.new.warehousing") || "Warehousing"}
        subtitle={t("portal.requests.new.warehousing_desc") || "Secure and efficient storage solutions."}
      />

      <div className="p-6 sm:p-8 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-secondary-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
          
          <div className="flex items-center gap-3 border-b border-secondary-100 pb-4 mb-6 dark:border-secondary-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
              <Warehouse className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-secondary-900 dark:text-white">{t("portal.requests.new.warehousing_form.title") || "New Warehousing Request"}</h2>
              <p className="text-xs text-secondary-500">{t("portal.requests.new.sea_freight_form.subtitle") || "Fill in the storage details below."}</p>
            </div>
          </div>

          {renderStepIndicator()}

          {error && (
            <div className="rounded-xl bg-rose-50 p-4 mb-6 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.warehousing_form.location") || "Preferred Location"}</label>
                  <input type="text" required placeholder={t("portal.requests.new.warehousing_form.location_placeholder") || "e.g. Alexandria, Cairo"} value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none" />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.warehousing_form.storage_type") || "Storage Type"}</label>
                  <select value={storageType} onChange={(e) => setStorageType(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none">
                    <option value="general">General Cargo Storage</option>
                    <option value="bonded">Bonded Warehouse</option>
                    <option value="temperature">Temperature Controlled</option>
                    <option value="hazardous">Hazardous Materials (HAZMAT)</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.warehousing_form.duration") || "Estimated Storage Duration"}</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none">
                    <option value="less_than_1_month">Less than 1 Month</option>
                    <option value="1_to_3_months">1 - 3 Months</option>
                    <option value="3_to_6_months">3 - 6 Months</option>
                    <option value="more_than_6_months">More than 6 Months</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.sea_freight_form.commodity") || "Commodity Description"}</label>
                  <input type="text" required placeholder={t("portal.requests.new.sea_freight_form.commodity_placeholder") || "e.g. Spare Parts"} value={commodity} onChange={(e) => setCommodity(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none" />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.warehousing_form.volume") || "Estimated Area/Volume (sqm or cbm)"}</label>
                  <input type="number" required placeholder="e.g. 150" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-xl bg-secondary-50 p-4 dark:bg-secondary-800/50">
                  <h3 className="mb-4 text-sm font-bold text-secondary-900 dark:text-white">{t("portal.requests.new.sea_freight_form.review_title") || "Review your Booking"}</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div className="text-secondary-500">{t("portal.requests.new.warehousing_form.location") || "Location"}</div>
                    <div className="font-bold text-secondary-900 dark:text-white">{location}</div>
                    
                    <div className="text-secondary-500">{t("portal.requests.new.warehousing_form.storage_type") || "Storage Type"}</div>
                    <div className="font-bold text-secondary-900 dark:text-white capitalize">{storageType.replace("_", " ")}</div>
                    
                    <div className="text-secondary-500">{t("portal.requests.new.sea_freight_form.commodity") || "Commodity"}</div>
                    <div className="font-bold text-secondary-900 dark:text-white">{commodity} ({volume} units)</div>
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.sea_freight_form.priority") || "Priority"}</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none">
                    <option value="low">{t("portal.requests.priority_low") || "Low"}</option>
                    <option value="medium">{t("portal.requests.priority_medium") || "Medium"}</option>
                    <option value="high">{t("portal.requests.priority_high") || "High"}</option>
                    <option value="urgent">{t("portal.requests.priority_urgent") || "Urgent"}</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-secondary-100 pt-6 mt-6 dark:border-secondary-800">
            {step === 1 ? (
              <Link href="/portal/requests/new">
                <Button type="button" variant="ghost" className="text-secondary-500 hover:text-secondary-900 dark:hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
                  {t("portal.requests.new.sea_freight_form.cancel") || "Cancel"}
                </Button>
              </Link>
            ) : (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} className="text-secondary-500 hover:text-secondary-900 dark:hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
                {t("portal.requests.new.sea_freight_form.back") || "Back"}
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary-600 px-6 font-bold text-white shadow hover:bg-primary-700"
            >
              {isSubmitting ? (
                <span>{t("portal.requests.new.sea_freight_form.processing") || "Processing..."}</span>
              ) : step < 3 ? (
                <span>{t("portal.requests.new.sea_freight_form.next") || "Next Step"}</span>
              ) : (
                <>
                  <span>{t("portal.requests.new.sea_freight_form.submit") || "Submit Request"}</span>
                  <Send className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
