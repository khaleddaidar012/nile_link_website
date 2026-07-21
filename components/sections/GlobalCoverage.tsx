"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import Image from "next/image"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"

const regions = [
  { name: "North America", flag: "🌎" },
  { name: "Europe", flag: "🌍" },
  { name: "Asia Pacific", flag: "🌏" },
  { name: "Middle East", flag: "🏜️" },
  { name: "Africa", flag: "🌍" },
  { name: "South America", flag: "🌎" },
]

export function GlobalCoverage() {
  const t = useTranslations("globalCoverage")

  return (
    <Section className="bg-secondary-50 dark:bg-secondary-900/50">
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />
      <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-secondary-600 dark:text-secondary-400">
        {t("description")}
      </p>

      <div className="relative mx-auto aspect-[2/1] max-w-4xl overflow-hidden rounded-2xl">
        <Image
          src="/images/global-map.jpg"
          alt="World map - global network"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute inset-0 bg-primary-900/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        {regions.map((region) => (
          <div
            key={region.name}
            className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-5 py-2.5 text-sm font-medium text-secondary-700 shadow-sm dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-300"
          >
            <span>{region.flag}</span>
            {region.name}
          </div>
        ))}
      </motion.div>
    </Section>
  )
}
