"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Globe, Users, HeartHandshake, ShieldCheck } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"

const features = [
  { key: "globalReach", icon: Globe },
  { key: "expertTeam", icon: Users },
  { key: "customerCentric", icon: HeartHandshake },
  { key: "compliance", icon: ShieldCheck },
]

export function WhyChooseUs() {
  const t = useTranslations("whyChooseUs")

  return (
    <Section>
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl border border-secondary-200 bg-white p-8 transition-all duration-300 hover:border-primary-200 hover:shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800 dark:hover:border-primary-700"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400 dark:group-hover:bg-primary-600">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
                {t(`${feature.key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary-600 dark:text-secondary-400">
                {t(`${feature.key}.description`)}
              </p>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
