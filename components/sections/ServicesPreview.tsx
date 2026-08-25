"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Ship, Plane, Truck, FileCheck, Warehouse, Settings2 } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Button } from "@/components/ui/Button"
import { Link } from "@/navigation"
import { cn } from "@/lib/utils"

const services = [
  {
    key: "seaFreight",
    icon: Ship,
    image:
      "/images/hero-bg.jpg",
  },
  {
    key: "airFreight",
    icon: Plane,
    image:
      "/images/air-freight.jpg",
  },
  {
    key: "roadFreight",
    icon: Truck,
    image:
      "/images/road-freight.jpg",
  },
  {
    key: "customsClearance",
    icon: FileCheck,
    image:
      "/images/customs-clearance.jpg",
  },
  {
    key: "warehousing",
    icon: Warehouse,
    image:
      "/images/container-ship.jpg",
  },
  {
    key: "specialized",
    icon: Settings2,
    image:
      "/images/specialized-cargo.jpg",
  },
]

export function ServicesPreview() {
  const t = useTranslations("services")

  return (
    <Section className="bg-secondary-50 dark:bg-secondary-900/50">
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />
      <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-secondary-600 dark:text-secondary-400">
        {t("description")}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-premium transition-all duration-500 hover:shadow-premium-xl dark:bg-secondary-800"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={t(`${service.key}.title`)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-primary-600 backdrop-blur-sm dark:bg-secondary-800/90 dark:text-primary-400">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                  {t(`${service.key}.title`)}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-secondary-600 dark:text-secondary-400">
                  {t(`${service.key}.description`)}
                </p>
                <Link
                  href={`/services#${service.key}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
                >
                  {t("learnMore")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <Link href="/services">
          <Button variant="outline" size="lg" className="gap-2">
            {t("viewAll")}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </Section>
  )
}
