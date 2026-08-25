"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
  className?: string
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12 md:mb-16",
        centered && "text-center",
        className
      )}
    >
      <span
        className={cn(
          "mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium",
          light
            ? "bg-white/10 text-white"
            : "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
        )}
      >
        {subtitle}
      </span>
      <h2
        className={cn(
          "text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl",
          light ? "text-white" : "text-secondary-900 dark:text-white"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "mx-auto mt-4 h-1 w-20 rounded-full",
          light ? "bg-white/30" : "bg-primary-500"
        )}
      />
    </motion.div>
  )
}
