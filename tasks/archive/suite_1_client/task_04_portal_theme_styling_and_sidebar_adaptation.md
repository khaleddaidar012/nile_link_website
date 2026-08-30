# Task 04 — Portal Light Theme Baseline & Adaptive Sidebar Background Styling

## Overview

- **What this feature does**:
  1. Establishes a clean, modern, crisp **White / Light Theme as the primary visual baseline** across all platform portals (Customer Portal `/portal` and Staff Administration Portal `/admin`) while maintaining seamless dark mode switching.
  2. Resolves the styling defect where the right-hand sidebar navigation (or left-hand in LTR) remained dark or failed to switch to pure white in Light Mode, ensuring the navigation container and all menu items transition to crisp white surfaces with high contrast borders and typography.
  3. Ensures consistent background, card, border, and active nav link styling across all sub-routes and drawer components in both Arabic (RTL) and English/European (LTR) modes.
- **What problem it solves**: Fulfills Requirements 8 and 9 of `needs.md`. Eliminates jarring visual contrast where users select the light theme but encounter persistent dark navigation bars or mismatched container backgrounds.
- **Why it is needed**: Maritime logistics and port management professionals work extensively during daylight hours in bright office and port terminal environments. A clean white dashboard with dark, legible typography reduces eye strain and provides an enterprise SaaS aesthetic comparable to MSC, CMA CGM, and Maersk portals.
- **How it fits into the existing system**: Directly impacts `app/globals.css`, `components/portal/PortalSidebar.tsx`, `components/admin/AdminSidebar.tsx`, `components/portal/PortalHeader.tsx`, `components/admin/AdminHeader.tsx`, and portal layout shells.

---

## Requirements

- **REQ-08**: "اللون الاساسي يبقي الوايت" (The primary base color/theme must be White).
- **REQ-09**: "الناف بار ال في الينمين مش بيتغير للابيض لا خليه بيتغير" (The right-hand navbar/sidebar does not change to white; make it change to white properly).

---

## Current Implementation

- **Theme System**:
  - `app/globals.css` defines color tokens: `--color-surface: #ffffff`, `--color-surface-dark: #1e293b`, etc.
  - Body uses `bg-white text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100`.
  - NextThemes or local state toggles the `.dark` class on the `<html>` root element.
- **Sidebar Background Defect**:
  - In `components/portal/PortalSidebar.tsx` and `components/admin/AdminSidebar.tsx`:
    - The sidebar element is positioned on the right in Arabic (`rtl`) and on the left in English (`ltr`).
    - In some viewport configurations or nested mobile sheets, hardcoded dark classes like `bg-[#0d1322]`, `bg-slate-900`, or `text-white` were applied without active `.dark:` variants, preventing the sidebar from adopting a pure white background in light mode.
- **Header & Active Links**:
  - Headers and active navigation items must have clear background differentiation: active link in light mode should be `bg-primary-50 text-primary-700 border-primary-200` (or `bg-primary-600 text-white`) instead of dark translucent styles.
- **Reference Documentation**:
  - `API_INVENTORY.md` Section 6 (Frontend -> API Mapping Matrix).
  - `PROJECT_TASKS.md` UI Theme & Portal Shell milestones.

---

## Files / Modules Affected

- **Styles**:
  - `app/globals.css`
- **Layouts**:
  - `app/[locale]/portal/layout.tsx`
  - `app/[locale]/admin/layout.tsx`
- **Sidebar Components**:
  - `components/portal/PortalSidebar.tsx`
  - `components/admin/AdminSidebar.tsx`
- **Header Components**:
  - `components/portal/PortalHeader.tsx`
  - `components/admin/AdminHeader.tsx`
- **Shared Components**:
  - `components/admin/customers/CustomerDetailDrawer.tsx`

---

## Data / Architecture Changes

- **Database Changes**: None.
- **Theme Architecture**:
  - Set default theme baseline to `"light"` in the root theme provider.
  - Define clear CSS variable tokens for sidebars:
    - Light: `--sidebar-bg: #ffffff; --sidebar-border: #e2e8f0; --sidebar-text: #0f172a; --sidebar-muted: #64748b;`
    - Dark: `--sidebar-bg: #0f172a; --sidebar-border: #1e293b; --sidebar-text: #f8fafc; --sidebar-muted: #94a3b8;`
  - Ensure all sidebar root containers use `bg-white text-secondary-900 border-secondary-200 dark:bg-[#0f172a] dark:text-white dark:border-slate-800`.

---

## UI / UX Changes

- **Light Mode Visual Refresh**:
  - **Portal Background**: Crisp `#f8fafc` (slate-50) or pure `#ffffff`.
  - **Sidebar (Right in Arabic, Left in LTR)**:
    - Pure white surface (`bg-white dark:bg-secondary-950`).
    - Subtle border separation (`border-l border-secondary-200 rtl:border-l-0 rtl:border-r dark:border-slate-800`).
    - Inactive menu items: Slate text (`text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900`).
    - Active menu item: Rich brand blue background (`bg-primary-50 text-primary-700 font-bold dark:bg-primary-950/60 dark:text-primary-300`).
    - NileLink logo renders crisply with dark typography ("NileLink" in `text-secondary-900` for light mode, `text-white` for dark mode).
  - **Header Bar**:
    - Pure white with bottom border (`bg-white/95 border-b border-secondary-200 dark:bg-secondary-900/90 dark:border-slate-800`).
    - Search input, language selector, and theme toggle buttons clearly outlined.
- **RTL Support**:
  - When viewing in Arabic (`/ar/portal` and `/ar/admin`), the sidebar docks cleanly to the right side of the screen with a distinct left border (`border-l rtl:border-l-0 rtl:border-r`), maintaining white background parity.

---

## Implementation Plan

1. **Audit Sidebar Containers in Portal and Admin**:
   - Inspect `components/portal/PortalSidebar.tsx`:
     Replace any hardcoded `bg-slate-900` or `bg-[#0d1322]` with `bg-white dark:bg-[#0f172a]`.
     Ensure text color classes toggle between `text-secondary-900` (light) and `text-white` (dark).
   - Inspect `components/admin/AdminSidebar.tsx`:
     Standardize root container classes to `bg-white border-r border-secondary-200 text-secondary-900 dark:bg-[#0f172a] dark:border-slate-800 dark:text-white`.
2. **Standardize Header Bar Theming**:
   - In `components/portal/PortalHeader.tsx` and `components/admin/AdminHeader.tsx`, ensure `bg-white/95 backdrop-blur-md` is applied in light mode and `dark:bg-secondary-900/95` in dark mode.
3. **Verify Contrast on All Interactive Elements**:
   - Verify that logout buttons, collapse toggle buttons, badges, and user profile cards in the sidebar have high contrast against the white background.
   - Test theme toggle switch in both `/portal` and `/admin` to verify instantaneous transition without page reload.

---

## Small Tasks

- [x] Inspect `components/portal/PortalSidebar.tsx` and ensure light background uses `bg-white` and text uses dark high-contrast tokens.
- [x] In `components/portal/PortalSidebar.tsx`, ensure the sidebar background uses `bg-white` in light mode (replacing any forced dark navy or dark slate).
- [x] Ensure sidebar navigation links use crisp slate tones (`text-slate-600 hover:bg-slate-100 hover:text-slate-900`) in light mode and proper dark mode styling.
- [x] Inspect customer portal header in `components/portal/PortalHeader.tsx` to verify clean white baseline styling in light mode.
- [x] Verify light theme default attribute in `components/layout/ThemeProvider.tsx` (ensure defaultTheme is light without forced OS dark override).
- [x] Ensure dark mode toggle continues to work smoothly when the user intentionally toggles to dark mode.
- [x] Test RTL layout in Arabic (`dir="rtl"`): confirm the right-hand sidebar stays white.
- [x] Test LTR layout in English (`dir="ltr"`): confirm the left-hand sidebar stays white.

---

## Edge Cases

- **System Preference Mismatch**:
  - If a user's operating system is set to dark mode, the platform must respect the initial theme baseline while allowing the user to toggle to Light mode and persist the choice in `localStorage`.
- **Active Route Highlighting on Nested Paths**:
  - Ensure `/portal/documents` stays highlighted with the light-mode active style when navigating sub-actions (e.g. `?status=approved`).

---

## Testing Checklist

- [ ] Open `/portal` in Light Mode. Verify the entire page background is clean slate/white.
- [ ] Verify the right-hand sidebar in Arabic (`/ar/portal`) is pure white (`#ffffff`).
- [ ] Verify the sidebar navigation links have sharp contrast (dark text on white).
- [ ] Click through each link (Documents, Requests, Financials, Profile) and verify the active link highlights in light blue/primary.
- [ ] Toggle to Dark Mode. Verify the sidebar switches to dark slate (`#0f172a`).
- [ ] Toggle back to Light Mode. Verify the sidebar immediately reverts to pure white.
- [ ] Open `/admin` and verify the admin sidebar also renders in pure white in Light Mode.
- [ ] Test on mobile view (< 768px): open the mobile menu drawer and verify white background.

---

## Acceptance Criteria

- The portal's primary baseline theme is crisp White/Light mode with optimal contrast.
- The right-hand sidebar in Arabic (and left-hand in LTR) transitions to pure white when in Light Mode.
- All text, icons, badges, and active states remain fully legible and high-contrast in both modes.
- Zero TypeScript errors (`npx tsc --noEmit`).

---

## Dependencies

- Depends on:
  - Task 01 (Public Navigation & Base Styles).

---

## AI_MAP Impact

- `PROJECT_TASKS.md` (Theme & UI/UX Milestones).
