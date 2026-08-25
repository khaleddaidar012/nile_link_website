"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Target, Eye } from "lucide-react"
import { Section } from "@/components/ui/Section"

export function MissionVision() {
  const t = useTranslations("about")

  return (
    <Section className="bg-secondary-50 dark:bg-secondary-900/50">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-secondary-200 bg-white p-8 shadow-premium transition-all duration-300 hover:shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Target className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
            {t("mission.title")}
          </h3>
          <p className="mt-4 leading-relaxed text-secondary-600 dark:text-secondary-400">
            {t("mission.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-secondary-200 bg-white p-8 shadow-premium transition-all duration-300 hover:shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Eye className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
            {t("vision.title")}
          </h3>
          <p className="mt-4 leading-relaxed text-secondary-600 dark:text-secondary-400">
            {t("vision.description")}
          </p>
        </motion.div>
      </div>
    </Section>
  )
}
