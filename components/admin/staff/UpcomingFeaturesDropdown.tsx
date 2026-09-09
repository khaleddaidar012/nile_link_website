"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocale } from "next-intl"
import {
  ChevronDown,
  Sparkles,
  Ship,
  FileCheck2,
  Receipt,
  Warehouse,
  Truck,
  FileSpreadsheet,
  Clock,
  ArrowRight,
} from "lucide-react"
import { Link } from "@/navigation"

const UPCOMING_FEATURES = [
  {
    slug: "shipments",
    icon: Ship,
    nameEn: "Shipments & Container Tracking",
    nameAr: "الشحنات وتتبع الحاويات",
    quarter: "Q4 2026",
    colorClass: "from-blue-500 to-cyan-500",
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderClass: "border-blue-200 dark:border-blue-800/50",
    textClass: "text-blue-700 dark:text-blue-300",
  },
  {
    slug: "customs",
    icon: FileCheck2,
    nameEn: "Customs Declarations & ACID",
    nameAr: "الإقرارات الجمركية و ACID",
    quarter: "Q4 2026",
    colorClass: "from-emerald-500 to-teal-500",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    borderClass: "border-emerald-200 dark:border-emerald-800/50",
    textClass: "text-emerald-700 dark:text-emerald-300",
  },
  {
    slug: "financials",
    icon: Receipt,
    nameEn: "Demurrage, Penalties & Invoicing",
    nameAr: "الأرضيات والغرامات والفوترة",
    quarter: "Q1 2027",
    colorClass: "from-orange-500 to-amber-500",
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    borderClass: "border-orange-200 dark:border-orange-800/50",
    textClass: "text-orange-700 dark:text-orange-300",
  },
  {
    slug: "warehouses",
    icon: Warehouse,
    nameEn: "Warehouses & Yard Management",
    nameAr: "المستودعات والساحات",
    quarter: "Q1 2027",
    colorClass: "from-violet-500 to-purple-500",
    bgClass: "bg-violet-50 dark:bg-violet-950/30",
    borderClass: "border-violet-200 dark:border-violet-800/50",
    textClass: "text-violet-700 dark:text-violet-300",
  },
  {
    slug: "fleet",
    icon: Truck,
    nameEn: "Land Fleet Operations (GPS)",
    nameAr: "أسطول النقل البري (GPS)",
    quarter: "Q2 2027",
    colorClass: "from-rose-500 to-pink-500",
    bgClass: "bg-rose-50 dark:bg-rose-950/30",
    borderClass: "border-rose-200 dark:border-rose-800/50",
    textClass: "text-rose-700 dark:text-rose-300",
  },
  {
    slug: "quotes",
    icon: FileSpreadsheet,
    nameEn: "Quotes & Customer CRM",
    nameAr: "عروض الأسعار والعملاء",
    quarter: "Q2 2027",
    colorClass: "from-indigo-500 to-blue-600",
    bgClass: "bg-indigo-50 dark:bg-indigo-950/30",
    borderClass: "border-indigo-200 dark:border-indigo-800/50",
    textClass: "text-indigo-700 dark:text-indigo-300",
  },
]

export function UpcomingFeaturesDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale()
  const isAr = locale === "ar"

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 text-sm font-bold shadow-sm transition-all duration-300 ${
          isOpen
            ? "border-primary-400 bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/20"
            : "border-primary-200/70 bg-gradient-to-r from-primary-50 to-indigo-50 text-primary-800 hover:border-primary-400 hover:shadow-md dark:border-primary-800/50 dark:from-primary-950/40 dark:to-indigo-950/40 dark:text-primary-200"
        }`}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2.5">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-xl transition-all ${
              isOpen ? "bg-white/20" : "bg-primary-100 dark:bg-primary-900/60"
            }`}
          >
            <Sparkles
              className={`h-4 w-4 transition-colors ${
                isOpen ? "text-white" : "text-primary-600 dark:text-primary-400"
              }`}
            />
          </span>
          <span>
            {isAr
              ? "✦ مميزات قريبة — منظومة الشحن المتكاملة"
              : "✦ Upcoming Features — Integrated Shipping Suite"}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-black tracking-wide ${
              isOpen
                ? "bg-white/20 text-white"
                : "bg-primary-600/10 text-primary-700 dark:bg-primary-400/10 dark:text-primary-300"
            }`}
          >
            6
          </span>
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>

      {/* Sliding Dropdown Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="upcoming-panel"
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 overflow-hidden rounded-2xl border border-secondary-200/80 bg-white shadow-xl shadow-secondary-900/5 dark:border-secondary-800 dark:bg-secondary-900">
              {/* Panel Header */}
              <div className="border-b border-secondary-100 px-5 py-3 dark:border-secondary-800">
                <p className="text-[11px] font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                  {isAr
                    ? "الوحدات المجدولة للإطلاق — اضغط لمعاينة التفاصيل"
                    : "Scheduled Modules — Click any to preview details"}
                </p>
              </div>

              {/* Features Grid — 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {UPCOMING_FEATURES.map((feature, idx) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.slug}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.045, duration: 0.22 }}
                      className="border-b border-secondary-100 last:border-b-0 sm:odd:border-r sm:rtl:odd:border-r-0 sm:rtl:even:border-r dark:border-secondary-800"
                    >
                      <Link
                        href={`/admin/coming-soon/${feature.slug}` as any}
                        className="group flex items-center gap-3.5 px-5 py-4 transition-all hover:bg-secondary-50/80 dark:hover:bg-secondary-800/40"
                      >
                        {/* Gradient Icon */}
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.colorClass} text-white shadow-sm`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </div>

                        {/* Name + Quarter */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-secondary-900 dark:text-white">
                            {isAr ? feature.nameAr : feature.nameEn}
                          </p>
                          <span
                            className={`mt-0.5 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${feature.bgClass} ${feature.borderClass} ${feature.textClass}`}
                          >
                            <Clock className="h-2.5 w-2.5" />
                            {feature.quarter}
                          </span>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-secondary-400 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Panel Footer */}
              <div className="border-t border-secondary-100 bg-secondary-50/60 px-5 py-2.5 dark:border-secondary-800 dark:bg-secondary-800/30">
                <p className="text-center text-[11px] text-secondary-400 dark:text-secondary-500">
                  {isAr
                    ? "🚀 قيد التطوير النشط — اضغط على أي وحدة لمعاينة قدراتها المخطط لها"
                    : "🚀 In active development — Click any module to preview its planned capabilities"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
