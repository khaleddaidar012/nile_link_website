"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { quoteFormSchema, type QuoteFormData } from "@/types/quote"

export function QuoteForm() {
  const t = useTranslations("quote.form")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
  })

  const onSubmit = async (data: QuoteFormData) => {
    setLoading(true)
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || t("error"))
      }

      toast.success(result.message || t("success"))
      reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : t("error")
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-sm text-secondary-900 placeholder-secondary-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-700 dark:bg-secondary-800 dark:text-white dark:placeholder-secondary-500"
  const errorClass = "mt-1 text-xs text-error"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-8 text-2xl font-bold text-secondary-900 dark:text-white">
        {t("title")}
      </h2>

      <form suppressHydrationWarning onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("firstName")} *
            </label>
            <input suppressHydrationWarning {...register("firstName")} className={inputClass} />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("lastName")} *
            </label>
            <input suppressHydrationWarning {...register("lastName")} className={inputClass} />
            {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("company")}
            </label>
            <input suppressHydrationWarning {...register("company")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("email")} *
            </label>
            <input suppressHydrationWarning type="email" {...register("email")} className={inputClass} />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("phone")} *
            </label>
            <input suppressHydrationWarning type="tel" {...register("phone")} className={inputClass} />
            {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("freightType")} *
            </label>
            <select suppressHydrationWarning {...register("freightType")} className={inputClass}>
              <option value="air">{t("freightAir")}</option>
              <option value="road">{t("freightRoad")}</option>
              <option value="ocean">{t("freightOcean")}</option>
            </select>
            {errors.freightType && <p className={errorClass}>{errors.freightType.message}</p>}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("weight")}
            </label>
            <input suppressHydrationWarning type="number" {...register("weight")} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("quantity")}
            </label>
            <input suppressHydrationWarning type="number" {...register("quantity")} className={inputClass} />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("from")} *
            </label>
            <input suppressHydrationWarning {...register("from")} className={inputClass} />
            {errors.from && <p className={errorClass}>{errors.from.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {t("to")} *
            </label>
            <input suppressHydrationWarning {...register("to")} className={inputClass} />
            {errors.to && <p className={errorClass}>{errors.to.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {t("notes")}
          </label>
          <textarea suppressHydrationWarning {...register("notes")} rows={3} className={inputClass} />
        </div>

        <Button type="submit" loading={loading} size="lg" className="w-full gap-2 sm:w-auto">
          <Send className="h-4 w-4" />
          {t("submit")}
        </Button>
      </form>
    </motion.div>
  )
}
