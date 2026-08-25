import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/Toast"
import { OrganizationSchema, LocalBusinessSchema } from "@/components/shared/JsonLd"
import { HtmlLang } from "@/components/shared/HtmlLang"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://nilelink-eg.com/${locale}`,
      languages: {
        en: "https://nilelink-eg.com/en",
        ar: "https://nilelink-eg.com/ar",
        fr: "https://nilelink-eg.com/fr",
        de: "https://nilelink-eg.com/de",
        it: "https://nilelink-eg.com/it",
        zh: "https://nilelink-eg.com/zh",
        bg: "https://nilelink-eg.com/bg",
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <OrganizationSchema />
      <LocalBusinessSchema />
      <ThemeProvider>
        <HtmlLang />
        <div className="flex min-h-screen flex-col" dir={locale === "ar" ? "rtl" : "ltr"}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
