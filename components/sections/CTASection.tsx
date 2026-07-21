"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { Link } from "@/navigation"

export function CTASection() {
  const t = useTranslations("cta")

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 to-primary-800/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg text-white/80">
            {t("description")}
          </p>
          <Link href="/request-quote">
            <Button
              size="lg"
              className="mt-8 gap-2 bg-white text-primary-600 hover:bg-white/90"
            >
              {t("button")}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}
