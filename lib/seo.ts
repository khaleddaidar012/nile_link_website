import type { Metadata } from "next"

export const siteConfig = {
  name: "NileLink",
  description:
    "NileLink is a leading freight forwarding company in Egypt, offering sea freight, air freight, road freight, customs clearance, and warehousing services worldwide.",
  url: "https://nilelink-eg.com",
  ogImage: "/images/og-image.jpg",
  locale: "en_US",
  localeAr: "ar_EG",
  localeFr: "fr_FR",
  localeDe: "de_DE",
  localeIt: "it_IT",
  localeZh: "zh_CN",
  localeBg: "bg_BG",
  twitterHandle: "@nilelink",
  keywords: [
    "freight forwarding",
    "logistics Egypt",
    "sea freight",
    "air freight",
    "NileLink",
    "shipping company Egypt",
    "international shipping",
    "cargo services",
  ],
}

export function constructMetadata({
  title,
  description,
  image,
  noIndex = false,
  locale = "en",
  path = "",
}: {
  title: string
  description?: string
  image?: string
  noIndex?: boolean
  locale?: string
  path?: string
}): Metadata {
  return {
    title: `${title} | ${siteConfig.name}`,
    description: description || siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale:
        locale === "ar"
          ? siteConfig.localeAr
          : locale === "fr"
            ? siteConfig.localeFr
            : locale === "de"
              ? siteConfig.localeDe
              : locale === "it"
                ? siteConfig.localeIt
                : locale === "zh"
                  ? siteConfig.localeZh
                  : locale === "bg"
                    ? siteConfig.localeBg
                    : siteConfig.locale,
      url: `${siteConfig.url}/${locale}${path}`,
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
      creator: siteConfig.twitterHandle,
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}${path}`,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        ar: `${siteConfig.url}/ar${path}`,
        fr: `${siteConfig.url}/fr${path}`,
        de: `${siteConfig.url}/de${path}`,
        it: `${siteConfig.url}/it${path}`,
        zh: `${siteConfig.url}/zh${path}`,
        bg: `${siteConfig.url}/bg${path}`,
      },
    },
  }
}
