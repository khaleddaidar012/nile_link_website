"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import Image from "next/image"
import { Container } from "@/components/ui/Container"

export function AboutHero() {
  const t = useTranslations("about.hero")

  return (
    <section className="relative flex min-h-[50vh] items-center overflow-hidden pt-20">
      <Image
        src="/images/container-ship.jpg"
        alt="Container ship at sea"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 to-secondary-900/70" />
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg text-white/70 sm:text-xl">
            {t("description")}
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
