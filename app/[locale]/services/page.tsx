import { getTranslations } from "next-intl/server"
import { constructMetadata } from "@/lib/seo"
import { ServicesHero } from "@/components/sections/services/ServicesHero"
import { ServicesGrid } from "@/components/sections/services/ServicesGrid"
import { ShippingComparison } from "@/components/sections/services/ShippingComparison"
import { ServicesCTA } from "@/components/sections/services/ServicesCTA"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "services" })

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/services",
  })
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <ShippingComparison />
      <ServicesCTA />
    </>
  )
}
