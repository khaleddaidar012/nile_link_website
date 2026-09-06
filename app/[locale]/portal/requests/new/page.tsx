"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { PortalHeader } from "@/components/portal/PortalHeader"
import { Ship, Plane, Truck, ShieldCheck, Factory, MessageSquare, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "@/navigation"
import { toast } from "sonner"

const servicesList = [
  {
    id: "sea_freight",
    icon: Ship,
    titleKey: "portal.requests.new.sea_freight",
    defaultTitle: "Sea Freight",
    descKey: "portal.requests.new.sea_freight_desc",
    defaultDesc: "FCL and LCL shipping solutions across the globe.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-100 dark:border-blue-800/50",
    ring: "ring-blue-600 dark:ring-blue-400",
  },
  {
    id: "air_freight",
    icon: Plane,
    titleKey: "portal.requests.new.air_freight",
    defaultTitle: "Air Freight",
    descKey: "portal.requests.new.air_freight_desc",
    defaultDesc: "Fast and reliable air cargo transportation.",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-100 dark:border-sky-800/50",
    ring: "ring-sky-600 dark:ring-sky-400",
  },
  {
    id: "land_freight",
    icon: Truck,
    titleKey: "portal.requests.new.land_freight",
    defaultTitle: "Land Freight",
    descKey: "portal.requests.new.land_freight_desc",
    defaultDesc: "Seamless overland transportation.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800/50",
    ring: "ring-emerald-600 dark:ring-emerald-400",
  },
  {
    id: "customs_clearance",
    icon: ShieldCheck,
    titleKey: "portal.requests.new.customs",
    defaultTitle: "Customs Clearance",
    descKey: "portal.requests.new.customs_desc",
    defaultDesc: "Expert handling of customs procedures & ACID.",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-100 dark:border-purple-800/50",
    ring: "ring-purple-600 dark:ring-purple-400",
  },
  {
    id: "warehousing",
    icon: Factory,
    titleKey: "portal.requests.new.warehousing",
    defaultTitle: "Warehousing",
    descKey: "portal.requests.new.warehousing_desc",
    defaultDesc: "Secure and efficient storage solutions.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-100 dark:border-amber-800/50",
    ring: "ring-amber-600 dark:ring-amber-400",
  },
  {
    id: "inland_transportation",
    icon: Truck,
    titleKey: "portal.requests.new.inland",
    defaultTitle: "Inland Transportation",
    descKey: "portal.requests.new.inland_desc",
    defaultDesc: "Local and regional cargo transport.",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-100 dark:border-indigo-800/50",
    ring: "ring-indigo-600 dark:ring-indigo-400",
  },
  {
    id: "general_inquiry",
    icon: MessageSquare,
    titleKey: "portal.requests.new.general",
    defaultTitle: "General Logistics Inquiry",
    descKey: "portal.requests.new.general_desc",
    defaultDesc: "Ask us anything about shipping or complex operations.",
    color: "text-secondary-600 dark:text-secondary-400",
    bg: "bg-secondary-50 dark:bg-secondary-800/50",
    border: "border-secondary-200 dark:border-secondary-700",
    ring: "ring-secondary-600 dark:ring-secondary-400",
  },
]

export default function NewRequestCardsPage() {
  const t = useTranslations()
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleContinue = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service to continue.")
      return
    }
    // Convert to query params
    const query = new URLSearchParams()
    selectedServices.forEach((s) => query.append("services", s))
    router.push(`/portal/requests/new/details?${query.toString()}`)
  }

  return (
    <div className="flex flex-col">
      <PortalHeader
        title={t("portal.requests.new.title") || "Select Required Services"}
        subtitle={t("portal.requests.new.subtitle") || "You can select one or multiple services for this request."}
      />

      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            {selectedServices.length} {t("portal.requests.new.selected_count") || "service(s) selected"}
          </p>
          <button
            onClick={handleContinue}
            disabled={selectedServices.length === 0}
            className={cn(
              "flex items-center px-6 py-2.5 rounded-xl font-bold transition-all text-white",
              selectedServices.length > 0 ? "bg-primary-600 hover:bg-primary-700 shadow-md" : "bg-gray-300 cursor-not-allowed dark:bg-secondary-800 dark:text-secondary-500"
            )}
          >
            {t("portal.requests.new.continue") || "Continue"}
            <ArrowRight className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {servicesList.map((service) => {
            const isSelected = selectedServices.includes(service.id)
            return (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all text-left",
                  isSelected ? `ring-2 ${service.ring} shadow-md` : "hover:shadow-md hover:-translate-y-1",
                  "dark:bg-secondary-900",
                  service.border
                )}
              >
                {isSelected && (
                  <div className={cn("absolute top-4 right-4 rtl:left-4 rtl:right-auto rounded-full p-1", service.bg, service.color)}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}
                <div>
                  <div className={cn("mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl", service.bg, service.color)}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-secondary-900 dark:text-white">
                    {t(service.titleKey) !== service.titleKey ? t(service.titleKey) : service.defaultTitle}
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {t(service.descKey) !== service.descKey ? t(service.descKey) : service.defaultDesc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
