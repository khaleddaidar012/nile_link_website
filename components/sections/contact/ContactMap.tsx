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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109196.11409178646!2d31.79162023954853!3d31.40509220942615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f9db2a5b8f3c2d%3A0x8b5f5b5f5b5f5b5f!2sDamietta%2C%20Egypt!5e0!3m2!1sen!2sus!4v1"
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
