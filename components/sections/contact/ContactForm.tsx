"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

const contactSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Minimum 10 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const t = useTranslations("contact.form")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      toast.success(t("success"))
      reset()
    } catch {
      toast.error(t("error"))
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
      <form suppressHydrationWarning onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <input suppressHydrationWarning {...register("name")} placeholder={t("name")} className={inputClass} />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div>
            <input suppressHydrationWarning type="email" {...register("email")} placeholder={t("email")} className={inputClass} />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <input suppressHydrationWarning {...register("phone")} placeholder={t("phone")} className={inputClass} />
          </div>
          <div>
            <input suppressHydrationWarning {...register("subject")} placeholder={t("subject")} className={inputClass} />
          </div>
        </div>
        <div>
          <textarea suppressHydrationWarning {...register("message")} rows={5} placeholder={t("message")} className={inputClass} />
          {errors.message && <p className={errorClass}>{errors.message.message}</p>}
        </div>
        <Button type="submit" loading={loading} size="lg" className="gap-2">
          <Send className="h-4 w-4" />
          {t("submit")}
        </Button>
      </form>
    </motion.div>
  )
}
