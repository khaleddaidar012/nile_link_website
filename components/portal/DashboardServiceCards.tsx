"use client"

import { useTranslations } from "next-intl"
import { Ship, Plane, Truck, ShieldCheck, Warehouse, Map } from "lucide-react"
import { Link } from "@/navigation"

export function DashboardServiceCards() {
  const t = useTranslations()

  const services = [
    {
      id: "sea",
      href: "/portal/requests/new/sea-freight",
      title: t("portal.requests.new.sea_freight") || "Sea Freight",
      icon: Ship,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      border: "hover:border-blue-200 dark:hover:border-blue-900",
    },
    {
      id: "air",
      href: "/portal/requests/new/air-freight",
      title: t("portal.requests.new.air_freight") || "Air Freight",
      icon: Plane,
      color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
      border: "hover:border-sky-200 dark:hover:border-sky-900",
    },
    {
      id: "land",
      href: "/portal/requests/new/land-freight",
      title: t("portal.requests.new.land_freight") || "Land Freight",
      icon: Truck,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      border: "hover:border-emerald-200 dark:hover:border-emerald-900",
    },
    {
      id: "customs",
      href: "/portal/requests/new/customs-clearance",
      title: t("portal.requests.new.customs") || "Customs Clearance",
      icon: ShieldCheck,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      border: "hover:border-purple-200 dark:hover:border-purple-900",
    },
    {
      id: "warehousing",
      href: "/portal/requests/new/warehousing",
      title: t("portal.requests.new.warehousing") || "Warehousing",
      icon: Warehouse,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      border: "hover:border-indigo-200 dark:hover:border-indigo-900",
    },
    {
      id: "inland",
      href: "/portal/requests/new/inland-transportation",
      title: t("portal.requests.new.inland") || "Inland Transport",
      icon: Map,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      border: "hover:border-orange-200 dark:hover:border-orange-900",
    }
  ]

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-secondary-900 dark:text-white">{t("portal.requests.new.title") || "Select a Service"}</h2>
        <Link href="/portal/requests/new" className="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400">View all ➔</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {services.map((service) => (
          <Link
            key={service.id}
            href={service.href}
            className={`group flex flex-col items-center justify-center rounded-2xl border border-secondary-200/60 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-secondary-800 dark:bg-secondary-900 ${service.border}`}
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${service.color}`}>
              <service.icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-bold text-secondary-700 dark:text-secondary-300 leading-tight">
              {service.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
