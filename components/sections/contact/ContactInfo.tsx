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
                {t("hqAddressStreet")}
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{t("hqAddressCity")}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">{t("alexandria")}</h3>
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                {t("alexandriaAddressStreet")}
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">{t("alexandriaAddressCity")}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">{t("phone")}</h3>
              <a href="tel:+20100018549" className="mt-1 block text-sm text-secondary-600 transition-colors hover:text-primary-500 dark:text-secondary-400">
                <span dir="ltr">+20 10 00018549</span>
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
