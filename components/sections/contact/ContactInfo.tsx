"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Headphones } from "lucide-react"
import { EmailLink } from "@/components/ui/EmailLink"

export function ContactInfo() {
  const t = useTranslations("contact")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-secondary-200 bg-white p-8 shadow-premium dark:border-secondary-700 dark:bg-secondary-800">
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">{t("hq")}</h3>
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                Al-Basarta, next to the Ebad Al-Rahman Mosque
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Damietta, Egypt</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">{t("alexandria")}</h3>
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                El Raml Station, Concorde Building
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Alexandria, Egypt</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">{t("phone")}</h3>
              <a href="tel:+201000842099" className="mt-1 block text-sm text-secondary-600 transition-colors hover:text-primary-500 dark:text-secondary-400">
                +2 0100 0842099
              </a>
              <a href="tel:+201222965980" className="block text-sm text-secondary-600 transition-colors hover:text-primary-500 dark:text-secondary-400">
                +2 01222965980
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">{t("email")}</h3>
              <EmailLink className="mt-1 block text-sm text-secondary-600 transition-colors hover:text-primary-500 dark:text-secondary-400" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">{t("support247")}</h3>
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                {t("support247Desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
