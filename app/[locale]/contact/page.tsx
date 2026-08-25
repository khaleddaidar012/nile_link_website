import { getTranslations } from "next-intl/server"
import { constructMetadata } from "@/lib/seo"
import { ContactHero } from "@/components/sections/contact/ContactHero"
import { ContactCards } from "@/components/sections/contact/ContactCards"
import { ContactForm } from "@/components/sections/contact/ContactForm"
import { ContactMap } from "@/components/sections/contact/ContactMap"
import { Container } from "@/components/ui/Container"

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
      <ContactCards />
      <section className="section-padding">
        <Container className="max-w-3xl">
          <ContactForm />
        </Container>
      </section>
      <ContactMap />
    </>
  )
}
