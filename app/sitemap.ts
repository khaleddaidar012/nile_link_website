import { MetadataRoute } from "next"

const locales = ["en", "ar", "fr", "de", "it", "zh", "bg"]
const staticPages = ["", "/about", "/services", "/request-quote", "/contact"]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `https://nilelink-eg.com/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              `https://nilelink-eg.com/${l}${page}`,
            ])
          ),
        },
      })
    }
  }

  return entries
}
