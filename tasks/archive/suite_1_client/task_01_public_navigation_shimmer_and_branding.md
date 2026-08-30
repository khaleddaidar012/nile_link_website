# Task 01 — Public Navigation, Shimmer Animation & High-Resolution Background

## Overview

- **What this feature does**:
  1. Standardizes the public navigation bar CTA to use the concise, modern Arabic label **"تسجيل الدخول"** (Login) instead of verbose variants like "تسجيل الدخول الي البوابة".
  2. Implements a high-end, diagonal glossy light streak shimmer animation (`animate-shine-sweep`) that sweeps continuously across the login CTA button from left to right.
  3. Replaces overly blurred or washed-out backgrounds on the `/login` and `/login?tab=register` entry points with crisp, high-resolution branded maritime logistics imagery with layered readability overlays.
- **What problem it solves**: Fulfills Requirements 1, 2, and 5 of `needs.md`. Eliminates cluttered CTA text, adds an eye-catching call to action that directs visitors to the customer portal, and elevates the visual aesthetic of the entry authentication pages to an enterprise grade.
- **Why it is needed**: The landing navigation is the initial touchpoint for prospective and returning corporate clients. A polished login button with dynamic micro-animations significantly improves user conversion and branding.
- **How it fits into the existing system**: Directly integrates into `components/layout/Navbar.tsx`, `components/auth/AuthNavActions.tsx`, and `app/[locale]/login/page.tsx`, adhering to the Next.js internationalized routing architecture (`next-intl`) and Tailwind CSS design tokens.

---

## Requirements

- **REQ-01**: "في الموقع برا تسجيل الدخول الي البوابة خليها تسجيل الدخول" (In the public site, change the button text from 'تسجيل الدخول الي البوابة' to 'تسجيل الدخول').
- **REQ-02**: "زرار تسجيل الدخول ال في يكون وراها انمشين كدا كدا خط مائل ببريق احترافي يروح من الشمال الي اليمين" (The login button must have a professional diagonal light beam shimmer animation traveling from left to right).
- **REQ-05**: "لما بيظهر صفحة تسجيل الدخول او تسجيل حساب الخلفيه البلور مش حلوه حط خلفيه الموقع" (When the login or account registration page is displayed, replace the excessive blur background with the crisp branded website hero background).

---

## Current Implementation

- **Navbar & Action Buttons**:
  - `components/auth/AuthNavActions.tsx` renders the desktop and mobile CTA buttons.
  - Currently evaluates `const loginLabel = t("nav.portalLogin") || t("nav.clientPortal") || "Client Portal"`.
  - In `messages/ar.json`, `nav.portalLogin` is defined as `"تسجيل الدخول"`. However, fallback chains or hardcoded occurrences across subcomponents must be unified.
- **Shimmer Animation**:
  - `app/globals.css` defines `@keyframes shine-sweep` and `.animate-shine-sweep`, applying a diagonal `skewX(-25deg)` light gradient.
  - In `AuthNavActions.tsx`, the shimmer container is embedded inside the `<Button>` component with `overflow-hidden` and `pointer-events-none`.
- **Authentication Pages Background**:
  - `app/[locale]/login/page.tsx` and `app/[locale]/forgot-password/page.tsx` load `/images/hero-bg.jpg` via `next/image` with priority loading.
  - Overlay gradient uses `from-secondary-950/90 via-slate-900/85 to-secondary-950/95` and `backdrop-blur-[2px]`.
- **Reference Documentation**:
  - `API_INVENTORY.md` Section 6 (Frontend -> API Mapping Matrix, Items 1 & 2).
  - `PROJECT_TASKS.md` UI/UX Polish track.

---

## Files / Modules Affected

- **Components**:
  - `components/auth/AuthNavActions.tsx`
  - `components/layout/Navbar.tsx`
- **Pages**:
  - `app/[locale]/login/page.tsx`
  - `app/[locale]/forgot-password/page.tsx`
  - `app/[locale]/reset-password/page.tsx`
- **Styles**:
  - `app/globals.css`
- **Localization**:
  - `messages/ar.json`
  - `messages/en.json`
  - `messages/fr.json`
  - `messages/de.json`
  - `messages/it.json`
  - `messages/zh.json`
  - `messages/bg.json`

---

## Data / Architecture Changes

- **Database Changes**: None.
- **Schema Changes**: None.
- **API Changes**: None.
- **CSS / Style Changes**:
  - Verify keyframes for `.animate-shine-sweep` ensure a fluid 60fps diagonal translate across both LTR and RTL orientations.
  - Maintain balanced opacity for overlay tints (`bg-secondary-950/80` with minimal `backdrop-blur-[1px]` or no blur) so the high-resolution ship / port background is visibly sharp.

---

## UI / UX Changes

- **Navbar CTA**:
  - Button text strictly reads "تسجيل الدخول" in Arabic, "Sign In" in English, "Connexion" in French, "Anmelden" in German, "Accedi" in Italian, "登录" in Chinese, and "Вход" in Bulgarian.
  - A diagonal lustrous beam sweeps across the button every 3.5 seconds.
  - On hover, button elevation scales subtly (`hover:scale-105`) with heightened glow (`hover:shadow-primary-500/30`).
- **Login / Register Page Background**:
  - High-resolution container ship / maritime freight hero graphic rendered sharply behind the login card.
  - Card container features clean glassmorphism (`bg-white/95 dark:bg-secondary-900/90 border border-white/20 shadow-2xl backdrop-blur-md`).
- **Responsive & RTL Behavior**:
  - Shimmer trajectory works harmoniously in both RTL (`dir="rtl"`) and LTR (`dir="ltr"`).
  - Mobile sheet menu displays the full-width CTA button with the identical shimmer animation.

---

## Implementation Plan

1. **Audit Navigation Labels Across Locales**:
   - Verify `nav.portalLogin` in `messages/*.json` is consistently mapped to `"تسجيل الدخول"` in `ar.json` and equivalent concise login terms across all 7 languages.
   - Inspect `components/layout/Navbar.tsx` and `components/auth/AuthNavActions.tsx` to guarantee `t("nav.portalLogin")` is used exclusively for unauthenticated states.
2. **Refine Diagonal Shimmer Keyframes**:
   - In `app/globals.css`, verify `@keyframes shine-sweep` uses a 45-degree or 25-degree skew with linear gradient (`from-transparent via-white/40 to-transparent`).
   - Ensure the inner shine element in `AuthNavActions.tsx` has `w-1/2`, `h-full`, and does not cause scrollbars or touch blockage.
3. **Calibrate Login Hero Visuals**:
   - In `app/[locale]/login/page.tsx`, ensure the hero image `/images/hero-bg.jpg` renders with `priority`, `sizes="100vw"`, and minimal blur (`backdrop-blur-[1px]`) to maintain crisp background details.
   - Mirror these background styling rules in `forgot-password/page.tsx` and `reset-password/page.tsx`.

---

## Small Tasks

- [x] Verify `messages/ar.json` maps `nav.portalLogin` to `"تسجيل الدخول"`.
- [x] Verify `messages/en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json` have clean concise login translations for `nav.portalLogin`.
- [x] Inspect `components/auth/AuthNavActions.tsx` and ensure `loginLabel` falls back strictly to `t("nav.portalLogin")`.
- [x] Confirm mobile drawer in `components/auth/AuthNavActions.tsx` renders the shimmer sweep animation on the login button.
- [x] Confirm desktop navbar in `components/auth/AuthNavActions.tsx` renders the shimmer sweep animation in both scrolled and transparent states.
- [x] Review `@keyframes shine-sweep` in `app/globals.css` to verify smooth diagonal timing and prevent hardware stuttering.
- [x] Inspect `app/[locale]/login/page.tsx` background container to ensure background image sharpness with reduced backdrop filter.
- [x] Verify `app/[locale]/forgot-password/page.tsx` background matches the login page aesthetic.
- [x] Test mobile viewport (< 640px) and desktop viewport (> 1024px) for visual alignment.

---

## Edge Cases

- **Session Hydration Delay**:
  - While `/api/auth/me` is verifying token cookies, a subtle skeleton pulse must prevent button flickering.
- **RTL Skew Inversion**:
  - The diagonal sweep angle (`skewX(-25deg)`) must look natural regardless of whether the site is viewed in Arabic (RTL) or European languages (LTR).
- **Reduced Motion Accessibility**:
  - Respect `prefers-reduced-motion: reduce` by disabling or softening the infinite loop if requested by user OS settings.

---

## Testing Checklist

- [ ] Normal flow: Visit `/ar` and confirm the top-right button displays "تسجيل الدخول".
- [ ] Visit `/en` and confirm the button displays "Sign In" or "Log In".
- [ ] Confirm the diagonal shimmer line sweeps from left to right across the button continuously.
- [ ] Scroll down the page and verify the button transitions to the solid primary state while retaining the shimmer streak.
- [ ] Open the mobile hamburger menu and verify the button appears full-width with the shimmer effect.
- [ ] Click the button and navigate to `/ar/login`. Verify the background image displays clearly with high contrast.
- [ ] Toggle between Login and Register tabs on `/login` and confirm background stability.

---

## Acceptance Criteria

- The navbar login button explicitly reads "تسجيل الدخول" in Arabic.
- A luminous diagonal line sweeps smoothly across the login button without causing overflow or layout shifts.
- The `/login` page renders a crisp, high-resolution branded logistics background with readable form contrast.
- Zero TypeScript errors (`npx tsc --noEmit`).

---

## Dependencies

- Depends on: None (Foundation UI Task).

---

## AI_MAP Impact

- `API_INVENTORY.md` Section 6 (Frontend -> API Mapping Matrix).
- `PROJECT_TASKS.md` (Public UX & Branding Milestones).
