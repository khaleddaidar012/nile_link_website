"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import Image from "next/image"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"

export function WhoWeAre() {
  const t = useTranslations("about.whoWeAre")

  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle title={t("title")} centered={false} />
          <p className="text-lg leading-relaxed text-secondary-600 dark:text-secondary-400">
            {t("description1")}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-secondary-600 dark:text-secondary-400">
            {t("description2")}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src="/images/container-ship.jpg"
              alt="Container ship at sea"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative mt-8 aspect-square overflow-hidden rounded-2xl">
            <Image
              src="/images/hero-bg.jpg"
              alt="Shipping containers"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative -mt-8 aspect-square overflow-hidden rounded-2xl">
            <Image
              src="/images/pexels-yankrukov-7693158.jpg"
              alt="Cargo plane"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src="/images/road-freight.jpg"
              alt="Truck fleet"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
