# Task 05 — Staff Portal Theme Switcher (Dark/Light Mode) Fix & 100% Multilingual Localization Across All Locales

## Overview

- **What this feature does**: 
  1. Fixes the Dark / Light theme toggle throughout the entire Staff & Admin Portal (`/admin`), ensuring all pages, sidebars, headers, cards, modals, and tables transition smoothly between light and dark themes with persistent user preference.
  2. Implements comprehensive 100% multilingual translation and RTL/LTR layout support across all staff modules in all 7 supported platform languages (`ar`, `en`, `fr`, `de`, `it`, `zh`, `bg`).
- **What problem it solves**: Resolves Requirements 6 & 9 of `needs.md`: fixes hardcoded dark styling that prevented the theme toggle from functioning, and ensures zero untranslated English strings or broken layouts when viewing staff pages in Arabic or other languages.
- **Why it is needed**: Staff operators work in varying lighting conditions (e.g. night shifts at ports or bright office environments) and require full Arabic and multilingual ergonomics for operational productivity.
- **How it fits into the existing system**: Refactors `AdminLayout.tsx`, `AdminSidebar.tsx`, `AdminHeader.tsx`, review modals, and tables using Tailwind dark mode classes (`dark:bg-slate-950 dark:text-white bg-slate-50 text-slate-900`), and enriches `messages/*.json` with `admin` translation namespaces.

---

## Requirements

1. **Theme Switching Fix**:
   - The theme toggle button in `AdminHeader.tsx` must switch the HTML root class between `dark` and `light`.
   - All admin components must replace hardcoded `bg-slate-950` / `border-slate-800` / `text-white` with dynamic classes:
     - **Light Mode**: `bg-slate-50 text-slate-900 border-slate-200 bg-white shadow-sm`
     - **Dark Mode**: `dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800 dark:bg-slate-900/80`
   - User preference must persist across page refreshes and sessions via `localStorage` and `theme` cookie.
2. **7-Language Multi-Language Translation**:
   - Every text, table header, button label, modal prompt, toast message, filter dropdown, and metric card in `/admin` must use `useTranslations("admin")` or `t()`.
   - Complete translations populated for:
     - 🇪🇬 **Arabic (`ar.json`)**
     - 🇬🇧 **English (`en.json`)**
     - 🇫🇷 **French (`fr.json`)**
     - 🇩🇪 **German (`de.json`)**
     - 🇮🇹 **Italian (`it.json`)**
     - 🇨🇳 **Chinese (`zh.json`)**
     - 🇧🇬 **Bulgarian (`bg.json`)**
3. **Bi-directional RTL / LTR Polish**:
   - Proper margin/padding flipping (`rtl:mr-0 rtl:ml-auto`, `rtl:text-right`), rotated chevrons, and alignment for Arabic locale.

---

## Current Implementation

- `app/[locale]/admin/layout.tsx` hardcodes `<div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">`, overriding light mode entirely.
- `AdminHeader.tsx` hardcoded `bg-slate-950/90 text-white border-slate-800`.
- Admin translation namespaces in message files were partial and contained English strings in non-English locales.

---

## Files / Modules Affected

- **Layout & Header Components**:
  - `app/[locale]/admin/layout.tsx` (Refactor to use dynamic `bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`)
  - `components/admin/AdminHeader.tsx` (Refactor to use theme-aware background, borders, and language selector for all 7 locales)
  - `components/admin/AdminSidebar.tsx` (Theme-aware sidebar styling with smooth light/dark contrasts)
- **Admin Feature Views & Modals**:
  - `app/[locale]/admin/page.tsx` (Overview dashboard)
  - `app/[locale]/admin/customers/page.tsx` & `CustomerOverviewTable.tsx`
  - `app/[locale]/admin/documents/review/page.tsx` & `DocumentReviewModal.tsx`
  - `app/[locale]/admin/notifications/page.tsx`
  - `app/[locale]/admin/staff/page.tsx`
  - `app/[locale]/admin/settings/page.tsx`
- **Translation Bundles**:
  - `messages/ar.json`, `messages/en.json`, `messages/fr.json`, `messages/de.json`, `messages/it.json`, `messages/zh.json`, `messages/bg.json`

---

## UI / UX Changes

- **Light Mode Visual Identity**:
  - Clean enterprise aesthetic with crisp white cards (`bg-white`), slate-200 borders, soft shadows, and deep navy text (`text-slate-900`).
- **Dark Mode Visual Identity**:
  - Premium deep slate-950 theme with subtle glassmorphism and cyan/indigo accents.
- **Language Switcher Dropdown**:
  - Upgraded to list all 7 languages with instant switching.

---

## Implementation Plan

1. **Refactor Admin Layout & Shell**:
   - Update `app/[locale]/admin/layout.tsx` to remove hardcoded dark colors.
   - Update `AdminHeader.tsx` and `AdminSidebar.tsx` with light/dark adaptive CSS classes.
2. **Refactor Admin Components**:
   - Update `CustomerOverviewTable.tsx`, `DocumentReviewModal.tsx`, `ExpiryEscalationTable.tsx`, and analytics cards with `dark:` variants.
3. **Consolidate Message Bundles**:
   - Build unified `admin` translation schema covering sidebar, overview, review queue, customer management, staff RBAC, notifications, and settings.
   - Inject complete translations into `ar.json`, `en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json`.
4. **Verification**:
   - Test theme toggle in light mode and dark mode across all admin pages.
   - Verify Arabic RTL layout and language switcher in all 7 languages.

---

## Small Tasks

- [x] Update `app/[locale]/admin/layout.tsx` to support light/dark theme classes dynamically.
- [x] Update `components/admin/AdminHeader.tsx` with light mode styling, theme toggle trigger, and all 7 languages in dropdown.
- [x] Update `components/admin/AdminSidebar.tsx` with light/dark adaptive styling and RTL icon rotation.
- [x] Refactor `app/[locale]/admin/page.tsx` (Dashboard stats and quick actions) for light/dark mode and `t()`.
- [x] Refactor `components/admin/review/DocumentReviewModal.tsx` for light/dark mode and full multi-language labels.
- [x] Refactor `CustomerOverviewTable.tsx` for light/dark mode and full multi-language labels.
- [x] Add complete `admin` translation trees to `messages/ar.json` and `messages/en.json`.
- [x] Add complete `admin` translation trees to `messages/fr.json`, `de.json`, `it.json`, `zh.json`, and `bg.json`.
- [x] Verify light mode contrast and typography on all tables and modals.
- [x] Verify Arabic RTL layout across the entire `/admin` section.

---

## Edge Cases

- User switching themes mid-review in a modal (modal instantly updates without closing or losing form state).
- System preference set to light but user manually toggled dark (persisted manual preference takes precedence).
- Numbers and dates formatted cleanly according to locale (e.g. `ar-EG` / `en-GB`).

---

## Testing Checklist

- [ ] Verify clicking Sun/Moon icon switches `/admin` instantly between Light and Dark modes.
- [ ] Verify Light Mode has high contrast, readable text, and correct background colors on all cards and tables.
- [ ] Verify switching locale to Arabic (`/ar/admin`) displays 100% Arabic text with zero English leaks.
- [ ] Verify switching locale to French, German, Italian, Chinese, and Bulgarian renders complete translations.
- [ ] Verify theme choice persists upon page refresh and browser restart.

---

## Acceptance Criteria

- Dark and Light modes work seamlessly across all staff portal pages and components.
- All staff modules are 100% translated into all 7 platform languages with native RTL/LTR layouts.

---

## Dependencies

Depends on:
- Task 01 (Staff RBAC)
- Task 02 (Customer Governance)
- Task 03 (Expiry Escalation)
- Task 04 (Review & System Settings)
