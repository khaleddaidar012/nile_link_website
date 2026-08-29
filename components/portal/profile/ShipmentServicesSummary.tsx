"use client"

import { useTranslations, useLocale } from "next-intl"
import {
  Ship,
  Plane,
  FileCheck2,
  Warehouse,
  Truck,
  ArrowUpRight,
  Package,
  Activity,
  CheckCircle2,
} from "lucide-react"
import { Link } from "@/navigation"
import { cn } from "@/lib/utils"

export interface OperationsStats {
  totalShipments: number
  activeShipments: number
  deliveredShipments: number
  activeServices: string[]
}

interface ShipmentServicesSummaryProps {
  operations: OperationsStats
}

export function ShipmentServicesSummary({ operations }: ShipmentServicesSummaryProps) {
  const t = useTranslations()
  const locale = useLocale()

  const serviceIcons: Record<string, any> = {
    "Sea Freight (FCL / LCL)": Ship,
    "Air Cargo Express": Plane,
    "Customs Clearance Alexandria & Sokhna": FileCheck2,
    "Bonded Warehousing": Warehouse,
  }

  return (
    <div className="space-y-6">
      {/* 3 Operations Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Total Operations */}
        <div className="rounded-2xl border border-secondary-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-secondary-800 dark:bg-secondary-900/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500 uppercase tracking-wider dark:text-secondary-400">
              {locale === "ar" ? "إجمالي العمليات والشحنات" : "Total Operations / Shipments"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-secondary-900 dark:text-white">
              {operations.totalShipments}
            </h3>
            <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
              {locale === "ar" ? "كافة الشحنات والتخليص الجمركي" : "All registered shipping requests"}
            </p>
          </div>
        </div>

        {/* Card 2: Active Shipments */}
        <div className="rounded-2xl border border-secondary-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-secondary-800 dark:bg-secondary-900/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500 uppercase tracking-wider dark:text-secondary-400">
              {locale === "ar" ? "شحنات جارية ونشطة" : "Active Operations in Transit"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {operations.activeShipments}
            </h3>
            <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
              {locale === "ar" ? "قيد الإبحار والتخليص بالموانئ" : "Active logistics & customs clearance"}
            </p>
          </div>
        </div>

        {/* Card 3: Delivered & Completed */}
        <div className="rounded-2xl border border-secondary-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-secondary-800 dark:bg-secondary-900/90">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary-500 uppercase tracking-wider dark:text-secondary-400">
              {locale === "ar" ? "شحنات مسلمة بنجاح" : "Completed Deliveries"}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {operations.deliveredShipments}
            </h3>
            <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
              {locale === "ar" ? "تم تفريغها وتسليمها للمستودعات" : "Successfully cleared & delivered"}
            </p>
          </div>
        </div>
      </div>

      {/* Active Contracted Logistics Services */}
      <div className="rounded-2xl border border-secondary-200/80 bg-white p-6 shadow-sm dark:border-secondary-800 dark:bg-secondary-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-secondary-900 dark:text-white">
              {locale === "ar" ? "الخدمات اللوجستية المفعلة للشركة" : "Subscribed Logistics Services"}
            </h3>
            <p className="mt-0.5 text-xs text-secondary-500 dark:text-secondary-400">
              {locale === "ar"
                ? "باقات الشحن والتخليص الجمركي المعتمدة في عقد NileLink"
                : "Active enterprise shipping & supply chain solutions under contract"}
            </p>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:underline dark:text-primary-400"
          >
            <span>{locale === "ar" ? "استعراض كافة الخدمات" : "View All Services"}</span>
            <ArrowUpRight className="h-3.5 w-3.5 rtl:rotate-90" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {operations.activeServices.map((serviceName, idx) => {
            const Icon = serviceIcons[serviceName] || Truck
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-secondary-200/80 bg-secondary-50/50 p-3.5 transition-colors hover:border-primary-500/30 hover:bg-primary-50/20 dark:border-secondary-800 dark:bg-secondary-800/50 dark:hover:bg-primary-950/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-secondary-900 dark:text-white">
                    {serviceName}
                  </h4>
                  <span className="mt-0.5 inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {locale === "ar" ? "نشط ومفعل" : "Active Service"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
