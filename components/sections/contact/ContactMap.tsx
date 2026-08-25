"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/Container"

export function ContactMap() {
  return (
    <section className="section-padding-sm bg-secondary-50 dark:bg-secondary-900/50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl shadow-premium-lg"
        >
          <div className="aspect-[2/1] w-full bg-secondary-200 dark:bg-secondary-700">
            <iframe
              src="https://maps.google.com/maps?q=31.4038182,31.8101459&z=17&hl=en&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NileLink Damietta Office Location"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
