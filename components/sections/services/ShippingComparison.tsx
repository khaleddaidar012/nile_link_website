"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Ship, Plane, Truck, Clock, DollarSign, Globe } from "lucide-react"

const comparisonKeys = ["seaFreight", "airFreight", "roadFreight"] as const

const iconMap = {
  seaFreight: Ship,
  airFreight: Plane,
  roadFreight: Truck,
} as const

const styleMap: Record<string, { color: string; bg: string }> = {
  seaFreight: { color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  airFreight: { color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/20" },
  roadFreight: { color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
}

export function ShippingComparison() {
  const t = useTranslations("services.comparison")

  return (
    <Section className="bg-secondary-50 dark:bg-secondary-900/50">
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-6 md:grid-cols-3">
        {comparisonKeys.map((key, index) => {
          const Icon = iconMap[key]
          const item = styleMap[key]
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white">{t(`${key}.method`)}</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-secondary-500">
                    <Clock className="h-4 w-4" /> {t("labels.transit")}
                  </span>
                  <span className="font-medium text-secondary-900 dark:text-white">{t(`${key}.transit`)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-secondary-500">
                    <DollarSign className="h-4 w-4" /> {t("labels.cost")}
                  </span>
                  <span className="font-medium text-secondary-900 dark:text-white">{t(`${key}.cost`)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-secondary-500">
                    <Globe className="h-4 w-4" /> {t("labels.capacity")}
                  </span>
                  <span className="font-medium text-secondary-900 dark:text-white">{t(`${key}.capacity`)}</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-secondary-50 px-3 py-2 text-xs text-secondary-600 dark:bg-secondary-900 dark:text-secondary-400">
                {t("labels.bestFor")}: {t(`${key}.bestFor`)}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
