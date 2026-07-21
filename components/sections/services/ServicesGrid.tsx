"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import Image from "next/image"
import { Ship, Plane, Truck, FileCheck, Warehouse, Settings2, CheckCircle2 } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"

const featureKeys = ["item1", "item2", "item3", "item4"] as const

const services = [
  {
    id: "sea-freight",
    key: "seaFreight",
    icon: Ship,
    image: "/images/hero-bg.jpg",
  },
  {
    id: "air-freight",
    key: "airFreight",
    icon: Plane,
    image: "/images/air-freight.jpg",
  },
  {
    id: "road-freight",
    key: "roadFreight",
    icon: Truck,
    image: "/images/road-freight.jpg",
  },
  {
    id: "customs-clearance",
    key: "customsClearance",
    icon: FileCheck,
    image: "/images/customs-clearance.jpg",
  },
  {
    id: "warehousing",
    key: "warehousing",
    icon: Warehouse,
    image: "/images/container-ship.jpg",
  },
  {
    id: "specialized",
    key: "specialized",
    icon: Settings2,
    image: "/images/specialized-cargo.jpg",
  },
]

export function ServicesGrid() {
  const t = useTranslations("services")

  return (
    <Section>
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />
      <div className="space-y-16">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <motion.div
              id={service.id}
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-24"
            >
              <div className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                <div className={`space-y-4 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className={`flex items-center gap-4 ${index % 2 === 1 ? "lg:flex-row-reverse lg:text-right" : ""}`}>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                      {t(`${service.key}.title`)}
                    </h3>
                  </div>
                  <p className={`text-lg leading-relaxed text-secondary-600 dark:text-secondary-400 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                    {t(`${service.key}.description`)}
                  </p>
                  <ul className={`space-y-2 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                    {featureKeys.map((fk) => (
                      <li key={fk} className={`flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-500" />
                        {t(`${service.key}.features.${fk}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <Image
                    src={service.image}
                    alt={t(`${service.key}.title`)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
