"use client"

import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { cn } from "@/lib/utils"
import { FAQSchema } from "@/components/shared/JsonLd"

export function FAQ() {
  const t = useTranslations("faq")
  const items = t.raw("items") as { question: string; answer: string }[]
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Section className="bg-secondary-50 dark:bg-secondary-900/50">
      <FAQSchema items={items} />
      <SectionTitle title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto max-w-3xl">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "border-b border-secondary-200 dark:border-secondary-700",
              index === 0 && "border-t"
            )}
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              aria-expanded={openIndex === index}
            >
              <span className="text-base font-medium text-secondary-900 dark:text-white">
                {item.question}
              </span>
              <span className="ml-4 shrink-0">
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-primary-500" />
                ) : (
                  <Plus className="h-5 w-5 text-secondary-400" />
                )}
              </span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-sm leading-relaxed text-secondary-600 dark:text-secondary-400">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
