import { getTranslations } from "next-intl/server"
import { constructMetadata } from "@/lib/seo"
import { QuoteHero } from "@/components/sections/quote/QuoteHero"
import { QuoteForm } from "@/components/sections/quote/QuoteForm"
import { QuoteInfo } from "@/components/sections/quote/QuoteInfo"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "quote" })

  return constructMetadata({
    title: t("hero.title"),
    description: t("hero.description"),
    locale,
    path: "/request-quote",
  })
}

export default function QuotePage() {
  return (
    <>
      <QuoteHero />
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <QuoteForm />
            </div>
            <div>
              <QuoteInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
