"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations, useLocale } from "next-intl"
import { Menu, X, ChevronDown, Phone, Mail, Globe, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/layout/ThemeProvider"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"
import { Link, usePathname } from "@/navigation"
import { EmailLink } from "@/components/ui/EmailLink"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "nav.home" },
  { href: "/about", label: "nav.about" },
  {
    href: "/services",
    label: "nav.services",
    children: [
      { href: "/services#sea-freight", label: "nav.seaFreight" },
      { href: "/services#air-freight", label: "nav.airFreight" },
      { href: "/services#road-freight", label: "nav.roadFreight" },
      { href: "/services#customs-clearance", label: "nav.customsClearance" },
      { href: "/services#warehousing", label: "nav.warehousing" },
      { href: "/services#specialized", label: "nav.specialized" },
    ],
  },
  { href: "/request-quote", label: "nav.requestQuote" },
  { href: "/contact", label: "nav.contact" },
]

const languages = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
  { code: "it", label: "Italiano", dir: "ltr" },
  { code: "zh", label: "中文", dir: "ltr" },
  { code: "bg", label: "Български", dir: "ltr" },
]

export function Navbar() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const currentLang = languages.find((l) => l.code === locale) || languages[0]

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 shadow-premium backdrop-blur-xl dark:bg-secondary-900/90"
          : "bg-transparent"
      )}
    >
      <div className="hidden border-b border-white/10 bg-secondary-900 text-sm text-white/80 md:block dark:border-secondary-800">
        <Container className="flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a href="tel:+201000842099" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5" />
              +2 0100 0842099
            </a>
            <EmailLink className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Mail className="h-3.5 w-3.5" />
              info@nilelinklogistics.com
            </EmailLink>
          </div>
        </Container>
      </div>

      <nav className="border-b border-transparent">
        <Container className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-sm font-bold text-white">
              NL
            </div>
            <span
              className={cn(
                "text-xl font-bold transition-colors",
                scrolled
                  ? "text-secondary-900 dark:text-white"
                  : "text-white"
              )}
            >
              NileLink
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setDropdownOpen(item.href)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")
                      ? scrolled
                        ? "text-primary-500"
                        : "text-primary-300"
                      : scrolled
                        ? "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-white"
                        : "text-white/80 hover:text-white"
                  )}
                >
                  {t(item.label)}
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        dropdownOpen === item.href && "rotate-180"
                      )}
                    />
                  )}
                </Link>
                {item.children && dropdownOpen === item.href && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-secondary-200 bg-white p-2 shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-secondary-600 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-secondary-400 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                      >
                        {t(child.label)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <button
                suppressHydrationWarning
                onClick={() => setLangOpen(!langOpen)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
                    : "text-white/80 hover:text-white"
                )}
              >
                <Globe className="h-4 w-4" />
                {currentLang.label}
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    langOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full right-0 mt-1 w-40 rounded-xl border border-secondary-200 bg-white p-1 shadow-premium-lg dark:border-secondary-700 dark:bg-secondary-800"
                  >
                    {languages.map((lang) => (
                      <Link
                        key={lang.code}
                        href={pathname}
                        locale={lang.code}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition-colors",
                          locale === lang.code
                            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                            : "text-secondary-600 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-700"
                        )}
                        onClick={() => setLangOpen(false)}
                      >
                        {lang.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {mounted && (
              <button
                suppressHydrationWarning
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  scrolled
                    ? "text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-800"
                    : "text-white/80 hover:text-white"
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            <Link href="/request-quote" className="hidden lg:block">
              <Button size="sm" className="rounded-lg">
                {t("navbar.getQuote")}
              </Button>
            </Link>

            <button
              suppressHydrationWarning
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "rounded-lg p-2 lg:hidden",
                scrolled
                  ? "text-secondary-600 dark:text-secondary-400"
                  : "text-white"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </Container>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-secondary-200 bg-white dark:border-secondary-700 dark:bg-secondary-900 lg:hidden"
          >
            <Container className="py-4">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-secondary-300 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(item.label)}
                    </Link>
                    {item.children && (
                      <div className="ml-4 flex flex-col border-l-2 border-secondary-200 pl-4 dark:border-secondary-700">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-secondary-500 transition-colors hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400"
                            onClick={() => setMobileOpen(false)}
                          >
                            {t(child.label)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-secondary-200 pt-4 dark:border-secondary-700">
                <Link href="/request-quote" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">{t("navbar.getQuote")}</Button>
                </Link>
                <div className="mt-3 flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={pathname}
                      locale={lang.code}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                        locale === lang.code
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                          : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-400"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {lang.label}
                    </Link>
                  ))}
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

