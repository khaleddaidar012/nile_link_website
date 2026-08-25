"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Button } from "@/components/ui/Button"
import { Link } from "@/navigation"

export function AboutPreview() {
  const t = useTranslations("aboutPreview")

  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle
            title={t("title")}
            subtitle={t("subtitle")}
            centered={false}
          />
          <p className="mt-6 text-lg leading-relaxed text-secondary-600 dark:text-secondary-400">
            {t("description")}
          </p>
          <Link href="/about">
            <Button variant="outline" className="mt-8 gap-2">
              {t("learnMore")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/container-ship.jpg"
              alt="Global logistics container ship"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </div>
    </Section>
  )
}


