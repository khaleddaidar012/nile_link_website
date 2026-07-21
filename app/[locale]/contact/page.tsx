import { getTranslations } from "next-intl/server"
import { constructMetadata } from "@/lib/seo"
import { ContactHero } from "@/components/sections/contact/ContactHero"
import { ContactForm } from "@/components/sections/contact/ContactForm"
import { ContactInfo } from "@/components/sections/contact/ContactInfo"
import { ContactMap } from "@/components/sections/contact/ContactMap"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contact" })

  return constructMetadata({
    title: t("hero.title"),
    description: t("hero.description"),
    locale,
    path: "/contact",
  })
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
      <ContactMap />
    </>
  )
}
