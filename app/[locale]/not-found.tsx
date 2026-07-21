"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/navigation"

export default function LocaleNotFound() {
  const t = useTranslations("notFound")

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-500">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-secondary-900 dark:text-white">
          {t("title")}
        </h2>
        <p className="mt-2 text-secondary-600 dark:text-secondary-400">
          {t("description")}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600"
        >
          {t("goHome")}
        </Link>
      </div>
    </div>
  )
}
