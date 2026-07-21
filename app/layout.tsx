import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import "./globals.css"
import { AnalyticsTracker } from "@/lib/analytics-client"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://nilelink-eg.com"),
  title: {
    default: "NileLink | Global Logistics Solutions",
    template: "%s | NileLink",
  },
  description:
    "NileLink is a leading freight forwarding company in Egypt, offering sea freight, air freight, road freight, customs clearance, and warehousing services worldwide.",
  keywords: [
    "freight forwarding",
    "logistics Egypt",
    "sea freight",
    "air freight",
    "NileLink",
    "shipping company",
    "international shipping",
  ],
  authors: [{ name: "NileLink" }],
  creator: "NileLink",
  publisher: "NileLink",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NileLink",
    title: "NileLink | Global Logistics Solutions",
    description:
      "Your No.1 Partner in Global Logistics — Sea, Air & Land Freight",
    images: [
      {
        url: "/images/container-ship.jpg",
        width: 1200,
        height: 630,
        alt: "NileLink - Global Logistics Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NileLink | Global Logistics Solutions",
    description:
      "Your No.1 Partner in Global Logistics — Sea, Air & Land Freight",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cairo.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  )
}
