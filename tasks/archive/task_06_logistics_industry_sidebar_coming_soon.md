# Task 06 — Comprehensive Admin Analytics Dashboard & Logistics Industry Sidebar Roadmap Modules ("Coming Soon")

## Overview

- **What this feature does**:
  1. Builds a high-impact, professional executive management overview dashboard on `/admin` with live KPIs (revenue/invoice flow, container shipments in transit, pending compliance document queue, customer growth charts, and quick-action shortcuts).
  2. Researches and incorporates industry-standard freight forwarding, customs clearance, and global supply chain management modules into the Admin Sidebar, badged with an elegant **"Coming Soon" / "قريباً"** pill.
  3. Creates a dedicated, interactive **Coming Soon Landing Page** (`/admin/coming-soon/[module]` or `/admin/[module]`) that showcases feature specifications, workflow diagrams, and expected delivery roadmaps for each upcoming logistics module when clicked.
- **What problem it solves**: Fulfills Requirements 7 & 8 of `needs.md`: gives executives an all-in-one control center and transparently communicates the enterprise roadmap for NileLink's end-to-end logistics platform.
- **Why it is needed**: Global logistics enterprises require integrated operations (sea, air, land freight, ACID customs declarations, demurrage billing, yard inventory, trucking fleet dispatch, and CRM quotations). Highlighting these modules positions NileLink as a premier full-suite logistics digital ecosystem.
- **How it fits into the existing system**: Upgrades `/admin/page.tsx` and `AdminSidebar.tsx`, connects with `/api/admin/analytics/overview`, and provides dynamic coming-soon module routing.

---

## Requirements

1. **Comprehensive Executive Operations Dashboard (`/admin`)**:
   - **Hero Metric Cards**:
     - Active Customer Accounts (with percentage growth)
     - Compliance Documents in Review Queue (urgent badge)
     - Documents in Danger Expiry Zone (<30 days)
     - Total Invoiced & Active Service Requests
   - **Interactive Document Compliance Velocity Chart**: Visual graph of document approvals vs rejections vs pending queue over time.
   - **Recent Activity Stream**: Live feed of customer uploads, staff approvals, and automated expiry alerts dispatched.
   - **Quick Action Bar**: Shortcuts to "Review Documents", "Add Employee", "Broadcast Alert", "System Settings".
2. **Logistics Industry Sidebar Modules ("Coming Soon" / "قريباً")**:
   - Researched enterprise freight forwarding modules to add to sidebar:
     1. 🚢 **Shipment Operations & Tracking** (`/admin/shipments`): Sea containers, air waybills, land freight convoys, Bill of Lading (B/L) tracking.
     2. 🛃 **Customs Declarations & ACID** (`/admin/customs`): Egyptian Nafeza MTS integration, 46-K forms, tariff classification, ACID port approvals.
     3. 💳 **Tariffs, Demurrage & Invoicing** (`/admin/financials`): Port storage fees, shipping line detention & demurrage calculations, automated multi-currency invoicing.
     4. 🏭 **Warehousing & Yard Inventory** (`/admin/warehouses`): Bonded warehouse staging, SKU bin tracking, cold-chain temperature monitoring.
     5. 🚛 **Fleet & Trucking Dispatch** (`/admin/fleet`): GPS truck tracking, driver assignments, port gate pass scheduling.
     6. 💼 **CRM & Freight Quotations** (`/admin/quotes`): Inbound RFQs, automated freight rate calculation, customer contracts.
3. **Coming Soon Interactive Module View**:
   - Clicking any "Coming Soon" sidebar link routes to `/admin/coming-soon/[module]`.
   - Displays a sleek glassmorphic preview featuring:
     - Module Name & Logistics Domain Icon
     - "Under Development / قيد التطوير - قريباً" status badge
     - Overview of capabilities and enterprise workflows
     - Planned features breakdown list
     - "Request Priority Access / طلب أولوية التجربة" interaction button
     - Button to return to dashboard.

---

## Current Implementation

- `app/[locale]/admin/page.tsx` had a basic placeholder overview.
- `AdminSidebar.tsx` only included 4 basic links without the broader freight logistics roadmap.
- No "Coming Soon" page existed.

---

## Files / Modules Affected

- **Frontend Pages & Components**:
  - `app/[locale]/admin/page.tsx` (Executive Management Dashboard)
  - `components/admin/analytics/AdminAnalyticsOverview.tsx` (Charts, KPIs, and activity stream)
  - `components/admin/AdminSidebar.tsx` (Expanded with grouped logistics roadmap items and "Coming Soon" pills)
  - `app/[locale]/admin/coming-soon/[module]/page.tsx` (Dynamic Coming Soon Landing Page)
  - `components/admin/coming-soon/ModuleComingSoonView.tsx` (Interactive module preview showcase)
- **Backend APIs**:
  - `app/api/admin/analytics/overview/route.ts` (Aggregates live counts for customers, documents, review queue, and notifications)
- **Translations**:
  - `messages/*.json` (Logistics module titles, descriptions, and coming soon badges in all 7 languages)

---

## UI / UX Changes

- **Sidebar Grouping**:
  - Section 1: "Core Operations" (Dashboard, Document Review Queue, Customer Accounts, Notifications, Staff RBAC, Settings).
  - Section 2: "Logistics Enterprise Modules (Upcoming)" (Shipments & B/L, Customs & ACID, Demurrage Billing, Warehouses, Fleet Dispatch, CRM & Quotes) with cyan/purple "قريباً" / "Soon" badges.
- **Executive Dashboard Layout**:
  - 4 high-contrast KPI cards with sparkline gradients.
  - Urgent document review queue widget with 1-click review action.
  - Live activity feed showing timestamps and user avatars.

---

## Implementation Plan

1. **Dashboard Analytics API**:
   - Enhance `app/api/admin/analytics/overview/route.ts` returning live aggregated counts.
2. **Dashboard UI Refactor**:
   - Build `AdminAnalyticsOverview.tsx` with KPI cards, compliance charts, and activity feeds.
   - Update `app/[locale]/admin/page.tsx`.
3. **Sidebar Roadmap Expansion**:
   - Update `AdminSidebar.tsx` with grouped navigation categories and animated "Coming Soon" badges.
4. **Coming Soon Page**:
   - Build `app/[locale]/admin/coming-soon/[module]/page.tsx` with detailed metadata for each logistics module.
5. **Localization**:
   - Add translation keys for all 6 upcoming logistics modules in all 7 language files.

---

## Small Tasks

- [x] Enhance `app/api/admin/analytics/overview/route.ts` with live database aggregation metrics.
- [x] Build `components/admin/analytics/AdminAnalyticsOverview.tsx` with KPI cards and activity stream.
- [x] Update `app/[locale]/admin/page.tsx` to render the comprehensive executive management dashboard.
- [x] Define the 6 logistics enterprise modules with icons, descriptions, and feature lists.
- [x] Build `components/admin/coming-soon/ModuleComingSoonView.tsx` with interactive module preview.
- [x] Create dynamic route `app/[locale]/admin/coming-soon/[module]/page.tsx`.
- [x] Update `components/admin/AdminSidebar.tsx` with categorized navigation and "Coming Soon" / "قريباً" badges.
- [x] Add translation strings for all dashboard metrics and upcoming modules in `messages/*.json`.
- [x] Test navigation to all 6 "Coming Soon" pages in Arabic and English.

---

## Edge Cases

- User navigates to unknown module slug (clean 404 fallback with link back to `/admin`).
- Database has zero activity logs (clean zero-state illustrations for activity stream and charts).
- Very long module names in German/Russian wrapping neatly inside sidebar pills without clipping.

---

## Testing Checklist

- [ ] Verify executive dashboard displays accurate live metrics from MongoDB.
- [ ] Verify sidebar displays all upcoming logistics modules with "Coming Soon" / "قريباً" badges.
- [ ] Verify clicking any upcoming module routes smoothly to `/admin/coming-soon/[module]`.
- [ ] Verify Coming Soon page renders correct module icon, title, description, and feature list.
- [ ] Verify full responsive behavior and RTL alignment in Arabic.

---

## Acceptance Criteria

- Admin overview dashboard delivers comprehensive analytics and live operational oversight.
- All 6 researched logistics enterprise modules appear in the sidebar with "Coming Soon" badges and route to rich preview pages.

---

## Dependencies

Depends on:
- Task 01 (Staff RBAC)
- Task 02 (Customer Directory)
- Task 05 (Theme & Multilingual Support)
