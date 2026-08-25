"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { Link } from "@/navigation"

export function ServicesCTA() {
  const t = useTranslations("cta")

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            {t("description")}
          </p>
          <Link href="/request-quote">
            <Button size="lg" className="mt-8 gap-2 bg-white text-primary-600 hover:bg-white/90">
              {t("button")}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}
