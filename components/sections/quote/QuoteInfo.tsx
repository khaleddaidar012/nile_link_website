"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Headphones } from "lucide-react"
import { EmailLink } from "@/components/ui/EmailLink"

export function QuoteInfo() {
  const t = useTranslations("contact")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-premium dark:border-secondary-700 dark:bg-secondary-800">
        <h3 className="mb-4 text-lg font-bold text-secondary-900 dark:text-white">NileLink</h3>
        <p className="mb-6 text-sm text-secondary-500">{t("tagline")}</p>

        <div className="space-y-5">
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-secondary-900 dark:text-white">{t("hq")}</p>
              <p className="text-sm text-secondary-500">Al-Basarta, next to the Ebad Al-Rahman Mosque</p>
              <p className="text-sm text-secondary-500">Damietta, Egypt</p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-secondary-900 dark:text-white">{t("alexandria")}</p>
              <p className="text-sm text-secondary-500">El Raml Station, Concorde Building</p>
              <p className="text-sm text-secondary-500">Alexandria, Egypt</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
            <div>
              <a href="tel:+201000842099" className="block text-sm text-secondary-600 transition-colors hover:text-primary-500 dark:text-secondary-400">+2 0100 0842099</a>
              <a href="tel:+201222965980" className="block text-sm text-secondary-600 transition-colors hover:text-primary-500 dark:text-secondary-400">+2 01222965980</a>
            </div>
          </div>

          <div className="flex gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
            <EmailLink className="text-sm text-secondary-600 transition-colors hover:text-primary-500 dark:text-secondary-400" />
          </div>

          <div className="flex gap-3">
            <Headphones className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-secondary-900 dark:text-white">{t("support247")}</p>
              <p className="text-sm text-secondary-500">{t("support247Desc")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white">
        <h3 className="text-lg font-bold">{t("quickResponse.title")}</h3>
        <p className="mt-2 text-sm text-white/80">{t("quickResponse.description")}</p>
      </div>
    </motion.div>
  )
}
