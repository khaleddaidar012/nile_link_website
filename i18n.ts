import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "ar", "fr", "de", "it", "zh", "bg"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
})
