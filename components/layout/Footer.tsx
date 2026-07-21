"use client"

import { useTranslations } from "next-intl"
import { Phone, Mail, MapPin, ArrowUpRight, Ship, ArrowUp } from "lucide-react"
import { FaFacebook, FaWhatsapp, FaLinkedin, FaEnvelope } from "react-icons/fa"
import { Container } from "@/components/ui/Container"
import { Link } from "@/navigation"
import { EmailLink } from "@/components/ui/EmailLink"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const footerLinks = [
  {
    title: "footer.quickLinks",
    links: [
      { href: "/", label: "nav.home" },
      { href: "/about", label: "nav.about" },
      { href: "/services", label: "nav.services" },
      { href: "/request-quote", label: "nav.requestQuote" },
      { href: "/contact", label: "nav.contact" },
    ],
  },
  {
    title: "footer.services",
    links: [
      { href: "/services#sea-freight", label: "nav.seaFreight" },
      { href: "/services#air-freight", label: "nav.airFreight" },
      { href: "/services#road-freight", label: "nav.roadFreight" },
      { href: "/services#customs-clearance", label: "nav.customsClearance" },
      { href: "/services#warehousing", label: "nav.warehousing" },
      { href: "/services#specialized", label: "nav.specialized" },
    ],
  },
]

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/nilelinklogistics/", icon: FaFacebook },
  { label: "WhatsApp", href: "https://wa.me/201000018549", icon: FaWhatsapp },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/nilelinklogistics/about/?viewAsMember=true", icon: FaLinkedin },
  { label: "Email", icon: FaEnvelope },
]

export function Footer() {
  const t = useTranslations()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <footer className="border-t border-secondary-200 bg-secondary-900 text-white dark:border-secondary-800">
        <Container className="section-padding">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-sm font-bold text-white">
                  NL
                </div>
                <span className="text-xl font-bold">NileLink</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-secondary-400">
                {t("footer.description")}
              </p>
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) =>
                  "href" in social && social.href ? (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-800 text-secondary-400 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary-500 hover:text-white hover:shadow-xl"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ) : (
                    <EmailLink
                      key={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-800 text-secondary-400 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary-500 hover:text-white hover:shadow-xl"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </EmailLink>
                  )
                )}
              </div>
            </div>

            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-400">
                  {t(group.title)}
                </h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-sm text-secondary-400 transition-colors hover:text-primary-400"
                      >
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                        <span>{t(link.label)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-400">
                {t("footer.contact")}
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                  <div>
                    <p className="text-sm font-medium">{t("contact.hq")}</p>
                    <p className="text-sm text-secondary-400">
                      Al-Basarta, next to the Ebad Al-Rahman Mosque
                    </p>
                    <p className="text-sm text-secondary-400">Damietta, Egypt</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                  <div>
                    <a
                      href="tel:+201000842099"
                      className="block text-sm text-secondary-400 transition-colors hover:text-primary-400"
                    >
                      +2 0100 0842099
                    </a>
                    <a
                      href="tel:+201222965980"
                      className="block text-sm text-secondary-400 transition-colors hover:text-primary-400"
                    >
                      +2 01222965980
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                  <EmailLink className="text-sm text-secondary-400 transition-colors hover:text-primary-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-secondary-800 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-secondary-500">
                &copy; {new Date().getFullYear()} NileLink. {t("footer.copyright")}
              </p>
              <div className="flex gap-6 text-sm text-secondary-500">
                <Link href="/" className="transition-colors hover:text-primary-400">
                  {t("footer.privacy")}
                </Link>
                <Link href="/" className="transition-colors hover:text-primary-400">
                  {t("footer.terms")}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </footer>

      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 text-white shadow-premium-lg transition-all duration-300 hover:bg-primary-600 hover:shadow-premium-xl",
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  )
}
