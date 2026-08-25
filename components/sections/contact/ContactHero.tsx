"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Container } from "@/components/ui/Container"

export function ContactHero() {
  const t = useTranslations("contact.hero")

  return (
    <section className="relative overflow-hidden bg-secondary-900 pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div className="pointer-events-none absolute -top-32 right-1/4 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-500 text-2xl font-bold text-white shadow-premium-lg">
            NL
          </div>
          <h1 className="mt-8 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {t("companyName")}
          </h1>
          <div className="mt-4 h-1 w-24 rounded-full bg-primary-500" />
          <p className="mt-6 max-w-2xl text-lg text-white/70 sm:text-xl">
            {t("description")}
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
