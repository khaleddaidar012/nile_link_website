"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Shield, Lightbulb, Users, RefreshCw, Leaf, Heart } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"

const icons = [Shield, Lightbulb, Users, RefreshCw, Leaf, Heart] as const
const valueKeys = ["integrity", "innovation", "customerFocus", "reliability", "sustainability", "safety"] as const

export function CoreValues() {
  const t = useTranslations("about.coreValues")

  return (
    <Section>
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {valueKeys.map((key, index) => {
          const Icon = icons[index]
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group rounded-2xl border border-secondary-200 bg-white p-6 transition-all duration-300 hover:border-primary-200 hover:shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800 dark:hover:border-primary-700"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400 dark:group-hover:bg-primary-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-600 dark:text-secondary-400">
                {t(`${key}.description`)}
              </p>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
