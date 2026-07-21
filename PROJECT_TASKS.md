# NileLink - Premium Logistics Website

## Project Overview

| Property | Value |
|----------|-------|
| **Project Name** | NileLink Website Redesign |
| **Client** | NileLink (formerly M&H Shipping) |
| **Industry** | International Logistics - Sea, Air & Land Freight |
| **Tech Stack** | Next.js 15, TypeScript, TailwindCSS, Framer Motion, next-intl |
| **Target Score** | 95+ Lighthouse |
| **Status** | In Progress |

---

## Epic 1: Project Setup & Configuration

### Task 1.1 — Initialize Next.js 15 Project
**ID:** SETUP-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** None  

- [ ] Create Next.js 15 app with TypeScript and App Router
- [ ] Configure TailwindCSS v4
- [ ] Set up project folder structure
- [ ] Configure path aliases (`@/`)
- [ ] Set up ESLint and Prettier
- [ ] Configure TypeScript strict mode
- [ ] Completed

### Task 1.2 — Install Dependencies
**ID:** SETUP-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Install `framer-motion` for animations
- [ ] Install `next-intl` for internationalization
- [ ] Install `next-seo` for SEO management
- [ ] Install `lucide-react` for icons
- [ ] Install `@next/font` (built-in)
- [ ] Install `clsx` and `tailwind-merge` for class utilities
- [ ] Install `next-themes` for dark mode
- [ ] Install `zod` for form validation
- [ ] Completed

### Task 1.3 — Create Folder Structure
**ID:** SETUP-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-01  

```
/
├── app/
│   ├── [locale]/
│   │   ├── about/
│   │   ├── services/
│   │   ├── request-quote/
│   │   ├── contact/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── contact/
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   └── shared/
├── hooks/
├── lib/
├── messages/
│   ├── en.json
│   ├── ar.json
│   ├── fr.json
│   ├── de.json
│   ├── it.json
│   ├── zh.json
│   └── bg.json
├── public/
│   └── images/
├── styles/
├── types/
└── constants/
```

- [ ] Create all directories
- [ ] Add index files for clean exports
- [ ] Completed

### Task 1.4 — Configure TypeScript Paths
**ID:** SETUP-04  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Add `@/*` path alias in `tsconfig.json`
- [ ] Verify imports work correctly
- [ ] Completed

---

## Epic 2: Design System

### Task 2.1 — Define Color Palette
**ID:** DS-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Primary: Sky Blue `#0EA5E9`
- [ ] Primary Dark: `#0284C7`
- [ ] Primary Light: `#E0F2FE`
- [ ] Secondary: Navy `#1E293B`
- [ ] Secondary Light: `#334155`
- [ ] Accent: Gold `#F59E0B`
- [ ] Background Light: `#FFFFFF`
- [ ] Background Dark: `#0F172A`
- [ ] Surface Light: `#F8FAFC`
- [ ] Surface Dark: `#1E293B`
- [ ] Card Light: `#FFFFFF`
- [ ] Card Dark: `#1E293B`
- [ ] Border Light: `#E2E8F0`
- [ ] Border Dark: `#334155`
- [ ] Text Primary Light: `#0F172A`
- [ ] Text Primary Dark: `#F1F5F9`
- [ ] Text Secondary Light: `#64748B`
- [ ] Text Secondary Dark: `#94A3B8`
- [ ] Success: `#10B981`
- [ ] Warning: `#F59E0B`
- [ ] Error: `#EF4444`
- [ ] Define CSS custom properties in `globals.css`
- [ ] Completed

### Task 2.2 — Define Typography
**ID:** DS-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Import Inter font (primary, sans-serif)
- [ ] Import Cairo font (Arabic support)
- [ ] Define font scale: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl
- [ ] Define font weights: 300, 400, 500, 600, 700, 800
- [ ] Set line-height system
- [ ] Set letter-spacing system
- [ ] Completed

### Task 2.3 — Define Spacing & Sizing
**ID:** DS-03  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** DS-01  

- [ ] Use Tailwind's default spacing scale
- [ ] Define section padding (py-16, py-20, py-24)
- [ ] Define container max-widths (max-w-7xl default)
- [ ] Define border-radius scale (sm, md, lg, xl, 2xl)
- [ ] Define shadow system
- [ ] Completed

### Task 2.4 — Create TailwindCSS Theme Extension
**ID:** DS-04  
**Priority:** High  
**Status:** Pending  
**Depends On:** DS-01, DS-02  

- [ ] Extend colors in `tailwind.config.ts`
- [ ] Extend font families
- [ ] Extend animations
- [ ] Extend keyframes
- [ ] Add custom container queries
- [ ] Completed

### Task 2.5 — Create Global Styles & CSS Variables
**ID:** DS-05  
**Priority:** High  
**Status:** Pending  
**Depends On:** DS-01  

- [ ] Create `globals.css` with custom properties
- [ ] Add smooth scroll behavior
- [ ] Add selection color
- [ ] Add scrollbar styling
- [ ] Define base element styles
- [ ] Completed

### Task 2.6 — Create Design Token Constants
**ID:** DS-06  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** DS-01  

- [ ] Create `constants/design.ts` with all design tokens
- [ ] Export colors, typography, spacing as constants
- [ ] Completed

---

## Epic 3: Shared UI Components

### Task 3.1 — Utility Components
**ID:** UI-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** DS-05  

- [ ] Create `cn` utility (clsx + tailwind-merge)
- [ ] Create `components/ui/Container.tsx`
- [ ] Create `components/ui/Section.tsx`
- [ ] Create `components/ui/SectionTitle.tsx`
- [ ] Create `components/ui/Button.tsx` (variants: primary, secondary, outline, ghost)
- [ ] Create `components/ui/Badge.tsx`
- [ ] Completed

### Task 3.2 — Card Components
**ID:** UI-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01  

- [ ] Create `components/ui/Card.tsx`
- [ ] Create `components/ui/ServiceCard.tsx`
- [ ] Create `components/ui/StatCard.tsx`
- [ ] Create `components/ui/FeatureCard.tsx`
- [ ] Create `components/ui/TeamCard.tsx`
- [ ] Create `components/ui/TestimonialCard.tsx`
- [ ] Completed

### Task 3.3 — Animated Components
**ID:** UI-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01  

- [ ] Create `components/ui/AnimatedSection.tsx` (scroll reveal wrapper)
- [ ] Create `components/ui/AnimatedCounter.tsx` (stat counting animation)
- [ ] Create `components/ui/FadeIn.tsx`
- [ ] Create `components/ui/ScaleIn.tsx`
- [ ] Create `components/ui/SlideIn.tsx`
- [ ] Completed

### Task 3.4 — Form Components
**ID:** UI-04  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01  

- [ ] Create `components/ui/Input.tsx`
- [ ] Create `components/ui/Select.tsx`
- [ ] Create `components/ui/Textarea.tsx`
- [ ] Create `components/ui/Checkbox.tsx`
- [ ] Create `components/ui/FormField.tsx`
- [ ] Create `components/ui/SubmitButton.tsx`
- [ ] Completed

### Task 3.5 — Feedback Components
**ID:** UI-05  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** UI-01  

- [ ] Create `components/ui/Toast.tsx`
- [ ] Create `components/ui/LoadingSpinner.tsx`
- [ ] Create `components/ui/Skeleton.tsx`
- [ ] Completed

---

## Epic 4: Navigation — Navbar

### Task 4.1 — Navbar Layout
**ID:** NAV-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01  

- [ ] Create `components/layout/Navbar.tsx`
- [ ] Create top bar with contact info (phone, email)
- [ ] Create main navigation bar with logo and links
- [ ] Implement sticky header with scroll effect
- [ ] Add glass effect on scroll
- [ ] Completed

### Task 4.2 — Navigation Links
**ID:** NAV-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** NAV-01  

- [ ] Create nav link items: Home, About, Services, Request Quote, Contact
- [ ] Implement active link highlighting
- [ ] Add dropdown menu for Services
- [ ] Use `next-intl` for localized links
- [ ] Completed

### Task 4.3 — Mobile Navigation
**ID:** NAV-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** NAV-01  

- [ ] Create mobile hamburger menu
- [ ] Animate mobile menu open/close
- [ ] Add overlay backdrop
- [ ] Handle scroll lock when menu open
- [ ] Responsive breakpoints
- [ ] Completed

### Task 4.4 — Navbar Components
**ID:** NAV-04  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** NAV-01  

- [ ] Create `components/layout/Logo.tsx`
- [ ] Create `components/layout/LanguageSwitcher.tsx`
- [ ] Create `components/layout/ThemeSwitcher.tsx`
- [ ] Completed

---

## Epic 5: Footer

### Task 5.1 — Footer Layout
**ID:** FOOT-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01  

- [ ] Create `components/layout/Footer.tsx`
- [ ] Create multi-column grid layout
- [ ] Add company description column
- [ ] Add quick links column
- [ ] Add services column
- [ ] Add contact information column
- [ ] Completed

### Task 5.2 — Footer Bottom
**ID:** FOOT-02  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** FOOT-01  

- [ ] Add copyright with current year
- [ ] Add social media links
- [ ] Add scroll-to-top button
- [ ] Completed

---

## Epic 6: Homepage

### Task 6.1 — Hero Section
**ID:** HOME-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01, UI-03, NAV-01, FOOT-01  

- [ ] Create fullscreen hero with background image (cargo ship)
- [ ] Add dark overlay gradient
- [ ] Add main headline: "Global Logistics Solutions"
- [ ] Add subheading text
- [ ] Add two CTA buttons: "Get a Quote" and "Our Services"
- [ ] Add subtle parallax effect on scroll
- [ ] Add animated scroll indicator
- [ ] Responsive adjustments
- [ ] SEO: proper heading hierarchy (h1)
- [ ] Completed

### Task 6.2 — Trusted & Recognized Section
**ID:** HOME-02  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** HOME-01  

- [ ] Create section with partner/brand logos
- [ ] Add autoplay carousel animation
- [ ] Completed

### Task 6.3 — About Preview Section
**ID:** HOME-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** HOME-01  

- [ ] Create two-column layout (image + text)
- [ ] Add section title: "About NileLink"
- [ ] Add company description text
- [ ] Add "Learn More" link
- [ ] Add image with decorative elements
- [ ] Scroll reveal animation
- [ ] Completed

### Task 6.4 — Services Preview Section
**ID:** HOME-04  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-02, HOME-01  

- [ ] Create section with 3x2 grid of service cards
- [ ] Show 6 main services with icons
- [ ] Add hover animations on cards
- [ ] Add "View All Services" link
- [ ] Completed

### Task 6.5 — Why Choose NileLink Section
**ID:** HOME-05  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-02, HOME-01  

- [ ] Create feature cards for: Global Reach, Expert Team, Customer-Centric, Compliance
- [ ] Add icons for each feature
- [ ] Add hover effects
- [ ] Responsive grid
- [ ] Completed

### Task 6.6 — Statistics/Counter Section
**ID:** HOME-06  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-03, HOME-01  

- [ ] Create background section with image/color
- [ ] Add animated counters: Success Rate, Shipments, Clients, Years Experience
- [ ] Animate numbers on scroll
- [ ] Completed

### Task 6.7 — Global Coverage Section
**ID:** HOME-07  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** HOME-01  

- [ ] Create world map visualization (SVG or image)
- [ ] Add text about global network
- [ ] Add key regions/countries served
- [ ] Completed

### Task 6.8 — Industries Served Section
**ID:** HOME-08  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** UI-02, HOME-01  

- [ ] Create horizontal scroll or grid of industry items
- [ ] Items: Automotive, Pharmaceutical, Retail, Technology, Industrial, Food & Beverage
- [ ] Add icons and hover effects
- [ ] Completed

### Task 6.9 — Testimonials Section
**ID:** HOME-09  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** UI-02, HOME-01  

- [ ] Create carousel/slider of testimonials
- [ ] Add client avatar, name, role, company
- [ ] Add star ratings
- [ ] Auto-play with pause on hover
- [ ] Manual navigation arrows
- [ ] Completed

### Task 6.10 — FAQ Section
**ID:** HOME-10  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** UI-01, HOME-01  

- [ ] Create accordion FAQ component
- [ ] Add smooth expand/collapse animation
- [ ] Schema.org FAQ structured data
- [ ] Completed

### Task 6.11 — CTA Section
**ID:** HOME-11  
**Priority:** High  
**Status:** Pending  
**Depends On:** HOME-01  

- [ ] Create full-width CTA banner
- [ ] Add background image
- [ ] Add heading: "Ready to Ship?"
- [ ] Add subtext
- [ ] Add "Request a Quote" button
- [ ] Add "Contact Us" button
- [ ] Completed

### Task 6.12 — Newsletter Section
**ID:** HOME-12  
**Priority:** Low  
**Status:** Pending  
**Depends On:** HOME-01  

- [ ] Create email subscription form
- [ ] Add validation
- [ ] Completed

---

## Epic 7: About Page

### Task 7.1 — About Hero
**ID:** ABOUT-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01, UI-03  

- [ ] Create page hero with background image
- [ ] Add page title and breadcrumb
- [ ] Subtle animation
- [ ] Completed

### Task 7.2 — Who We Are
**ID:** ABOUT-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** ABOUT-01  

- [ ] Two-column layout with company story
- [ ] Gallery of images (3 images grid)
- [ ] Completed

### Task 7.3 — Mission & Vision
**ID:** ABOUT-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** ABOUT-01  

- [ ] Create two cards: Mission and Vision
- [ ] Add icons per card
- [ ] Staggered reveal animation
- [ ] Completed

### Task 7.4 — Company Statistics
**ID:** ABOUT-04  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-03, ABOUT-01  

- [ ] Animated counters: Success Rate, Shipments, Clients
- [ ] Attractive layout with gradient background
- [ ] Completed

### Task 7.5 — Core Values
**ID:** ABOUT-05  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** ABOUT-01  

- [ ] Grid of value cards
- [ ] Values: Integrity, Innovation, Customer Focus, Reliability, Safety, Sustainability
- [ ] Each with icon and description
- [ ] Completed

### Task 7.6 — Leadership Team
**ID:** ABOUT-06  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** UI-02, ABOUT-01  

- [ ] Team member cards with photos
- [ ] Name, role, description
- [ ] Completed

### Task 7.7 — About Page SEO
**ID:** ABOUT-07  
**Priority:** High  
**Status:** Pending  
**Depends On:** ABOUT-01  

- [ ] Set metadata title and description
- [ ] OpenGraph tags
- [ ] JSON-LD structured data (Organization)
- [ ] Completed

---

## Epic 8: Services Page

### Task 8.1 — Services Hero
**ID:** SVC-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01, UI-03  

- [ ] Page hero with background image (cargo airplane or containers)
- [ ] Title and breadcrumb
- [ ] Completed

### Task 8.2 — Services Grid
**ID:** SVC-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-02, SVC-01  

- [ ] Create 3x2 grid of detailed service cards
- [ ] Each card: image, icon, title, description, CTA
- [ ] Services:
  1. Sea Freight - FCL/LCL, global ports
  2. Air Freight - Express, standard, consolidated
  3. Road Freight - Domestic & cross-border
  4. Customs Clearance - Documentation & compliance
  5. Warehousing - Storage, inventory, fulfillment
  6. Specialized Services - Temperature control, hazardous, project cargo
- [ ] Hover animations with image zoom
- [ ] Completed

### Task 8.3 — Service Detail Modal/Page
**ID:** SVC-03  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** SVC-02  

- [ ] Create expandable service detail section
- [ ] Additional information per service
- [ ] Benefits list
- [ ] CTA for quote
- [ ] Completed

### Task 8.4 — Shipping Methods Comparison
**ID:** SVC-04  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** SVC-01  

- [ ] Table or cards comparing air, sea, road freight
- [ ] Transit times, costs, capacity
- [ ] Completed

### Task 8.5 — Why Choose Us (Services)
**ID:** SVC-05  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** UI-02, SVC-01  

- [ ] Feature highlights specific to services
- [ ] Completed

### Task 8.6 — Services CTA
**ID:** SVC-06  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** SVC-01  

- [ ] Call to action section for quote request
- [ ] Completed

### Task 8.7 — Services SEO
**ID:** SVC-07  
**Priority:** High  
**Status:** Pending  
**Depends On:** SVC-01  

- [ ] Metadata for services page
- [ ] JSON-LD for Service schema
- [ ] Completed

---

## Epic 9: Request Quote Page

### Task 9.1 — Quote Hero
**ID:** QUOTE-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01, UI-03  

- [ ] Page hero with background
- [ ] Title and description
- [ ] Completed

### Task 9.2 — Quote Form
**ID:** QUOTE-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-04, QUOTE-01  

- [ ] Multi-step or single-page form
- [ ] Fields:
  - First Name, Last Name
  - Company
  - Email, Phone
  - Address, City, State, Postcode, Country
  - Freight Type (Air, Road, Ocean)
  - Weight, Quantity
  - Dimensions (Length, Height, Width)
  - From/To locations
  - Additional notes
- [ ] Form validation with Zod
- [ ] Loading state on submit
- [ ] Success/error feedback
- [ ] Completed

### Task 9.3 — Form API Route
**ID:** QUOTE-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** QUOTE-02  

- [ ] Create API route for form submission
- [ ] Email notification (optional: SendGrid, Resend)
- [ ] Database or file logging
- [ ] Rate limiting
- [ ] Completed

### Task 9.4 — Sidebar Information
**ID:** QUOTE-04  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** QUOTE-01  

- [ ] Add contact info sidebar
- [ ] Office addresses
- [ ] Phone numbers
- [ ] Business hours
- [ ] Completed

### Task 9.5 — Quote SEO
**ID:** QUOTE-05  
**Priority:** High  
**Status:** Pending  
**Depends On:** QUOTE-01  

- [ ] Metadata
- [ ] Completed

---

## Epic 10: Contact Page

### Task 10.1 — Contact Hero
**ID:** CONT-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-01, UI-03  

- [ ] Page hero with background
- [ ] Title and description
- [ ] Completed

### Task 10.2 — Contact Form
**ID:** CONT-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** UI-04, CONT-01  

- [ ] Contact form with Name, Email, Phone, Subject, Message
- [ ] Validation with Zod
- [ ] Submit handler with API route
- [ ] Success/error feedback
- [ ] Completed

### Task 10.3 — Contact Information
**ID:** CONT-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** CONT-01  

- [ ] Display HQ address: Al-Basarta, Damietta, Egypt
- [ ] Display Alexandria office address
- [ ] Display phone: +2 0100 0842099, +2 01222965980
- [ ] Display email: asmaa.hassan@mh-eg.com
- [ ] Add icons per contact method
- [ ] Completed

### Task 10.4 — Google Maps Embed
**ID:** CONT-04  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** CONT-01  

- [ ] Embed Google Map for both locations
- [ ] Responsive container
- [ ] Lazy loading
- [ ] Completed

### Task 10.5 — Business Hours
**ID:** CONT-05  
**Priority:** Low  
**Status:** Pending  
**Depends On:** CONT-01  

- [ ] Display working hours
- [ ] 24/7 support badge
- [ ] Completed

### Task 10.6 — Contact SEO
**ID:** CONT-06  
**Priority:** High  
**Status:** Pending  
**Depends On:** CONT-01  

- [ ] Metadata
- [ ] JSON-LD LocalBusiness schema
- [ ] Completed

---

## Epic 11: Internationalization (next-intl)

### Task 11.1 — i18n Configuration
**ID:** I18N-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-02  

- [ ] Configure `next-intl` with `createSharedPathnamesNavigation`
- [ ] Set up `i18n.ts` with routing config
- [ ] Create `middleware.ts` for locale detection
- [ ] Supported locales: en, ar, fr, de, it, zh, bg
- [ ] Default locale: en
- [ ] Completed

### Task 11.2 — English Translations (en.json)
**ID:** I18N-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Create complete English translation file
- [ ] All pages, sections, navigation, forms, footer
- [ ] Completed

### Task 11.3 — Arabic Translations (ar.json)
**ID:** I18N-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Create complete Arabic translation file
- [ ] All pages, sections, navigation, forms, footer
- [ ] RTL direction support
- [ ] Completed

### Task 11.4 — French Translations (fr.json)
**ID:** I18N-04  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Create French translation file
- [ ] Completed

### Task 11.5 — German Translations (de.json)
**ID:** I18N-05  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Create German translation file
- [ ] Completed

### Task 11.6 — Italian Translations (it.json)
**ID:** I18N-06  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Create Italian translation file
- [ ] Completed

### Task 11.7 — Chinese Translations (zh.json)
**ID:** I18N-07  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Create Chinese translation file
- [ ] Completed

### Task 11.8 — Bulgarian Translations (bg.json)
**ID:** I18N-08  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Create Bulgarian translation file
- [ ] Completed

### Task 11.9 — RTL Support
**ID:** I18N-09  
**Priority:** High  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Implement RTL layout for Arabic
- [ ] Flip margins, paddings, transforms for RTL
- [ ] Add `dir="rtl"` attribute
- [ ] Test all pages in RTL mode
- [ ] Completed

### Task 11.10 — Language Switcher
**ID:** I18N-10  
**Priority:** High  
**Status:** Pending  
**Depends On:** I18N-01, NAV-04  

- [ ] Create dropdown language switcher component
- [ ] Show language names in native script
- [ ] Persist language preference
- [ ] Completed

### Task 11.11 — SEO for Multi-Language
**ID:** I18N-11  
**Priority:** High  
**Status:** Pending  
**Depends On:** I18N-01  

- [ ] Add `hreflang` tags for all locales
- [ ] Localized canonical URLs
- [ ] Localized metadata
- [ ] Completed

---

## Epic 12: Dark Mode

### Task 12.1 — Theme Provider Setup
**ID:** DM-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** DS-01  

- [ ] Install `next-themes`
- [ ] Create `components/layout/ThemeProvider.tsx`
- [ ] Wrap app with ThemeProvider
- [ ] Configure theme storage key
- [ ] Completed

### Task 12.2 — Dark Mode Styles
**ID:** DM-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** DM-01  

- [ ] Define dark mode CSS variables
- [ ] Apply dark: variants to all components
- [ ] Ensure proper contrast ratios
- [ ] Test all pages in dark mode
- [ ] Completed

### Task 12.3 — Theme Switcher Component
**ID:** DM-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** DM-01, NAV-04  

- [ ] Create theme toggle button (sun/moon icon)
- [ ] Smooth transition between themes
- [ ] Persist user preference
- [ ] Respect system preference
- [ ] Completed

---

## Epic 13: SEO

### Task 13.1 — Metadata Configuration
**ID:** SEO-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Create `lib/seo.ts` with SEO constants
- [ ] Define default metadata in root layout
- [ ] Create OpenGraph images
- [ ] Define Twitter card metadata
- [ ] Completed

### Task 13.2 — Per-Page Metadata
**ID:** SEO-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** SEO-01  

- [ ] Homepage metadata
- [ ] About page metadata
- [ ] Services page metadata
- [ ] Request Quote metadata
- [ ] Contact page metadata
- [ ] Completed

### Task 13.3 — Structured Data (JSON-LD)
**ID:** SEO-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** SEO-01  

- [ ] Create `components/shared/JsonLd.tsx`
- [ ] Organization schema for NileLink
- [ ] LocalBusiness schema (for offices)
- [ ] Service schema (for logistics services)
- [ ] FAQ schema (for FAQ section)
- [ ] BreadcrumbList schema
- [ ] Completed

### Task 13.4 — Sitemap & Robots
**ID:** SEO-04  
**Priority:** High  
**Status:** Pending  
**Depends On:** SEO-01  

- [ ] Create `app/sitemap.ts` with all localized URLs
- [ ] Create `app/robots.ts`
- [ ] Add canonical URLs to all pages
- [ ] Add `hreflang` alternate tags
- [ ] Completed

### Task 13.5 — Performance & Accessibility SEO
**ID:** SEO-05  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** SEO-01  

- [ ] Add semantic HTML throughout
- [ ] Proper heading hierarchy (h1 -> h6)
- [ ] Image alt texts
- [ ] ARIA labels
- [ ] Meta viewport
- [ ] Completed

---

## Epic 14: Performance Optimization

### Task 14.1 — Image Optimization
**ID:** PERF-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Use `next/image` for all images
- [ ] Configure remote patterns for external images
- [ ] Set appropriate sizes and breakpoints
- [ ] Add blur placeholder
- [ ] Lazy loading for below-fold images
- [ ] Completed

### Task 14.2 — Code Splitting
**ID:** PERF-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Use dynamic imports for heavy components
- [ ] Lazy load non-critical sections
- [ ] Suspense boundaries
- [ ] Completed

### Task 14.3 — Font Optimization
**ID:** PERF-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** DS-02  

- [ ] Use `next/font` with `display: swap`
- [ ] Preload critical fonts
- [ ] Subset fonts when possible
- [ ] Completed

### Task 14.4 — Bundle Analysis
**ID:** PERF-04  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Add `@next/bundle-analyzer`
- [ ] Identify large dependencies
- [ ] Optimize bundle size
- [ ] Completed

### Task 14.5 — Core Web Vitals
**ID:** PERF-05  
**Priority:** High  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Optimize LCP (hero image, font)
- [ ] Optimize FID/INP (remove blocking JS)
- [ ] Optimize CLS (set image dimensions, font fallback)
- [ ] Completed

---

## Epic 15: Analytics & Monitoring

### Task 15.1 — Google Analytics
**ID:** ANAL-01  
**Priority:** Medium  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Add Google Analytics 4 script
- [ ] Track page views
- [ ] Track form submissions (events)
- [ ] Completed

### Task 15.2 — Error Monitoring
**ID:** ANAL-02  
**Priority:** Low  
**Status:** Pending  
**Depends On:** SETUP-01  

- [ ] Add error boundary component
- [ ] Log errors to console (or Sentry)
- [ ] Completed

---

## Epic 16: Final Integration & Testing

### Task 16.1 — Cross-Browser Testing
**ID:** TEST-01  
**Priority:** High  
**Status:** Pending  
**Depends On:** All pages  

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test mobile browsers
- [ ] Completed

### Task 16.2 — Lighthouse Audit
**ID:** TEST-02  
**Priority:** High  
**Status:** Pending  
**Depends On:** All pages  

- [ ] Run Lighthouse for each page
- [ ] Fix any issues below 95
- [ ] Verify performance, accessibility, SEO, best practices
- [ ] Completed

### Task 16.3 — Responsive Testing
**ID:** TEST-03  
**Priority:** High  
**Status:** Pending  
**Depends On:** All pages  

- [ ] Test at 1920x1080
- [ ] Test at 1440x900
- [ ] Test at 1024x768 (iPad)
- [ ] Test at 768x1024 (iPad portrait)
- [ ] Test at 375x812 (iPhone X)
- [ ] Test at 390x844 (iPhone 14)
- [ ] Completed

### Task 16.4 — Build & Export
**ID:** TEST-04  
**Priority:** High  
**Status:** Pending  
**Depends On:** All tasks  

- [ ] Run `npm run build`
- [ ] Fix any build errors
- [ ] Verify production build
- [ ] Completed

---

## Implementation Order

The project must be implemented in the following order:

```
Epic 1  →  Project Setup
Epic 2  →  Design System
Epic 3  →  UI Components
Epic 4  →  Navbar
Epic 5  →  Footer
Epic 6  →  Homepage
Epic 7  →  About Page
Epic 8  →  Services Page
Epic 9  →  Request Quote
Epic 10 →  Contact Page
Epic 11 →  Internationalization
Epic 12 →  Dark Mode
Epic 13 →  SEO
Epic 14 →  Performance
Epic 15 →  Analytics
Epic 16 →  Testing & Final
```

Each Epic must be completed fully before moving to the next.
Each Task within an Epic must be completed fully before moving to the next Task.
**Never work randomly.**

---

## Business Information Reference

Extracted from old website (M&H Shipping → rebranded to NileLink):

| Field | Value |
|-------|-------|
| **Company Name** | NileLink (formerly M&H Shipping) |
| **Tagline** | Your No.1 Partner in Global Logistics |
| **HQ** | Al-Basarta, next to the Ebad Al-Rahman Mosque, Damietta, Egypt |
| **Alexandria Branch** | El Raml Station, Concorde Building, Alexandria, Egypt |
| **Email** | asmaa.hassan@mh-eg.com |
| **Phone** | +2 0100 0842099 / +2 01222965980 |
| **Services** | Sea Freight, Air Freight, Road Freight, Customs Clearance, Warehousing, Specialized Services |
| **Core Values** | Global Reach, Expert Team, Customer-Centric, Compliance & Regulations |
| **Working Hours** | 24/7 Support |

---

## Color System

```
Primary:       #0EA5E9  (Sky Blue)
Primary Dark:  #0284C7
Primary Light: #E0F2FE
Secondary:     #1E293B  (Navy)
Accent:        #F59E0B  (Gold)
Success:       #10B981
Warning:       #F59E0B
Error:         #EF4444
```

---

This document is a living roadmap. Update task status as work progresses.
Completed tasks are marked with [x]. In-progress tasks are marked with [~].
