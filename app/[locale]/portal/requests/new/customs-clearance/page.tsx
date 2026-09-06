"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { Button } from "@/components/ui/Button"
import { ShieldCheck, ArrowLeft, Send, CheckCircle2, FileText, MapPin } from "lucide-react"
import { Link } from "@/navigation"
import { cn } from "@/lib/utils"

export default function CustomsClearancePage() {
  const t = useTranslations()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form State
  const [operationType, setOperationType] = useState("import")
  const [port, setPort] = useState("")
  const [commodity, setCommodity] = useState("")
  const [cargoType, setCargoType] = useState("FCL")
  const [acidNumber, setAcidNumber] = useState("")
  const [hasAcid, setHasAcid] = useState("no")
  const [priority, setPriority] = useState("high")

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
          serviceType: "customs_clearance",
          operationType,
          subject: `Customs Clearance at ${port}`,
          description: `Commodity: ${commodity}, Cargo: ${cargoType}${operationType === "import" ? `, ACID: ${hasAcid === "yes" ? acidNumber : "Pending"}` : ""}`,
          priority,
          details: {
            port,
            commodity,
            cargoType,
            acidNumber: operationType === "import" && hasAcid === "yes" ? acidNumber : null,
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
        { num: 1, label: t("portal.requests.new.customs_form.step1") || "Basic Info", icon: MapPin },
        { num: 2, label: t("portal.requests.new.customs_form.step2") || "ACID & Cargo", icon: FileText },
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
        title={t("portal.requests.new.customs") || "Customs Clearance"}
        subtitle={t("portal.requests.new.customs_desc") || "Expert handling of customs procedures & ACID."}
      />

      <div className="p-6 sm:p-8 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-secondary-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
          
          <div className="flex items-center gap-3 border-b border-secondary-100 pb-4 mb-6 dark:border-secondary-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-secondary-900 dark:text-white">{t("portal.requests.new.customs_form.title") || "New Customs Clearance"}</h2>
              <p className="text-xs text-secondary-500">{t("portal.requests.new.sea_freight_form.subtitle") || "Fill in the shipment details below."}</p>
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
                  <label className="mb-2 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.sea_freight_form.operation_type") || "Operation Type"}</label>
                  <div className="flex gap-4">
                    {["import", "export"].map((type) => (
                      <label key={type} className="flex-1 cursor-pointer">
                        <input type="radio" className="peer sr-only" checked={operationType === type} onChange={() => setOperationType(type)} />
                        <div className="rounded-xl border-2 border-secondary-100 bg-white p-3 text-center text-sm font-bold text-secondary-500 transition-colors peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700 dark:border-secondary-800 dark:bg-secondary-900 dark:peer-checked:border-primary-500 dark:peer-checked:bg-primary-900/20 dark:peer-checked:text-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 capitalize">
                          {t(`portal.requests.new.sea_freight_form.${type}`) || type}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.customs_form.port") || "Customs Port"}</label>
                  <input type="text" required placeholder={t("portal.requests.new.customs_form.port_placeholder") || "e.g. Alexandria Port, Cairo Airport"} value={port} onChange={(e) => setPort(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.sea_freight_form.commodity") || "Commodity Description"}</label>
                  <input type="text" required placeholder={t("portal.requests.new.sea_freight_form.commodity_placeholder") || "e.g. Medical Supplies"} value={commodity} onChange={(e) => setCommodity(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none" />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.customs_form.cargo_type") || "Cargo Type"}</label>
                  <select value={cargoType} onChange={(e) => setCargoType(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-800 dark:text-white focus:border-primary-500 focus:outline-none">
                    <option value="FCL">Full Container Load (FCL)</option>
                    <option value="LCL">Less than Container (LCL)</option>
                    <option value="Air">Air Freight Cargo</option>
                    <option value="Bulk">Bulk Cargo</option>
                  </select>
                </div>

                {operationType === "import" && (
                  <div className="sm:col-span-2 mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <h3 className="mb-4 font-bold text-amber-900 dark:text-amber-500 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t("portal.requests.new.customs_form.acid_title") || "ACID Number (Nafeza)"}
                    </h3>
                    
                    <div className="mb-4">
                      <label className="mb-2 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.customs_form.has_acid") || "Do you have an ACID number?"}</label>
                      <div className="flex gap-4">
                        {["yes", "no"].map((val) => (
                          <label key={val} className="flex-1 cursor-pointer">
                            <input type="radio" className="peer sr-only" checked={hasAcid === val} onChange={() => setHasAcid(val)} />
                            <div className="rounded-xl border border-secondary-200 bg-white p-2.5 text-center text-sm font-bold text-secondary-600 transition-colors peer-checked:border-amber-500 peer-checked:bg-amber-100 peer-checked:text-amber-800 dark:border-secondary-700 dark:bg-secondary-800 dark:peer-checked:border-amber-600 dark:peer-checked:bg-amber-900/40 dark:peer-checked:text-amber-400">
                              {val === "yes" ? (t("portal.requests.new.customs_form.yes") || "Yes") : (t("portal.requests.new.customs_form.no") || "No, need assistance")}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {hasAcid === "yes" && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="mb-1 block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">{t("portal.requests.new.customs_form.acid_number") || "ACID Number"}</label>
                        <input type="text" required placeholder="19-digit number" value={acidNumber} onChange={(e) => setAcidNumber(e.target.value)} className="w-full rounded-xl border border-secondary-200 bg-white p-3 text-sm font-medium dark:border-secondary-700 dark:bg-secondary-900 dark:text-white focus:border-amber-500 focus:outline-none" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-xl bg-secondary-50 p-4 dark:bg-secondary-800/50">
                  <h3 className="mb-4 text-sm font-bold text-secondary-900 dark:text-white">{t("portal.requests.new.sea_freight_form.review_title") || "Review your Booking"}</h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div className="text-secondary-500">{t("portal.requests.new.sea_freight_form.review_operation") || "Operation"}</div>
                    <div className="font-bold text-secondary-900 dark:text-white capitalize">{t(`portal.requests.new.sea_freight_form.${operationType}`) || operationType}</div>
                    
                    <div className="text-secondary-500">{t("portal.requests.new.customs_form.port") || "Customs Port"}</div>
                    <div className="font-bold text-secondary-900 dark:text-white">{port}</div>
                    
                    <div className="text-secondary-500">{t("portal.requests.new.sea_freight_form.commodity") || "Commodity"}</div>
                    <div className="font-bold text-secondary-900 dark:text-white">{commodity} ({cargoType})</div>
                    
                    {operationType === "import" && (
                      <>
                        <div className="text-secondary-500">{t("portal.requests.new.customs_form.acid_number") || "ACID Number"}</div>
                        <div className="font-bold text-amber-700 dark:text-amber-500">{hasAcid === "yes" ? acidNumber : (t("portal.requests.new.customs_form.needs_acid") || "Requested Assistance")}</div>
                      </>
                    )}
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
