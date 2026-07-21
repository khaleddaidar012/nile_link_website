"use client"

import { useEffect } from "react"
import { CONTACT } from "@/constants/contact"

function useJsonLd(id: string, schema: Record<string, unknown> | null) {
  useEffect(() => {
    if (!schema) return

    const script = document.createElement("script")
    script.id = id
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [id, schema])
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NileLink",
  url: "https://nilelink-eg.com",
  logo: "https://nilelink-eg.com/images/logo.png",
  description:
    "NileLink is a leading freight forwarding company in Egypt, offering sea freight, air freight, road freight, customs clearance, and warehousing services worldwide.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+2-0100-0842099",
    contactType: "customer service",
    availableLanguage: ["English", "Arabic", "French", "German", "Italian", "Chinese", "Bulgarian"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Al-Basarta, next to the Ebad Al-Rahman Mosque",
    addressLocality: "Damietta",
    addressCountry: "EG",
  },
  sameAs: [
    "https://facebook.com/nilelink",
    "https://linkedin.com/company/nilelink",
    "https://twitter.com/nilelink",
  ],
}

export function OrganizationSchema() {
  useJsonLd("organization-schema", organizationSchema)
  return null
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "NileLink - Damietta Office",
  description: "Head office of NileLink freight forwarding company",
  url: "https://nilelink-eg.com",
  telephone: "+2-0100-0842099",
  email: CONTACT.EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Al-Basarta, next to the Ebad Al-Rahman Mosque",
    addressLocality: "Damietta",
    addressCountry: "EG",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
}

export function LocalBusinessSchema() {
  useJsonLd("local-business-schema", localBusinessSchema)
  return null
}

export function FAQSchema({ items }: { items: { question: string; answer: string }[] }) {
  const schema = items.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null

  useJsonLd("faq-schema", schema)

  return null
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = items.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }
    : null

  useJsonLd("breadcrumb-schema", schema)

  return null
}
