"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { CONTACT_CHANNELS } from "@/constants/contact"

export function ContactCards() {
  const t = useTranslations()

  return (
    <section className="section-padding">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_CHANNELS.filter((channel) => !channel.hidden).map((channel, index) => {
            const Icon = channel.icon
            const isExternal = channel.href.startsWith("http")

            return (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col gap-4 rounded-2xl border border-secondary-200 bg-white p-6 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800 dark:hover:border-primary-600"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
                    {t(channel.title)}
                  </h3>
                  <a
                    href={channel.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    dir="ltr"
                    className="mt-1 block break-all text-sm font-medium text-primary-600 transition-colors group-hover:text-primary-500 dark:text-primary-400"
                  >
                    {channel.value}
                  </a>
                  {channel.secondaryValue && channel.secondaryHref && (
                    <a
                      href={channel.secondaryHref}
                      dir="ltr"
                      className="mt-0.5 block break-all text-sm font-medium text-primary-600 transition-colors group-hover:text-primary-500 dark:text-primary-400"
                    >
                      {channel.secondaryValue}
                    </a>
                  )}
                  <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                    {t(channel.description)}
                  </p>
                </div>
                {isExternal && (
                  <ArrowUpRight className="absolute top-5 right-5 h-4 w-4 text-secondary-300 transition-colors group-hover:text-primary-500 dark:text-secondary-500" />
                )}
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
