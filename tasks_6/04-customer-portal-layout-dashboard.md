# Task: Customer Portal Shell, Navigation & Overview Dashboard

Status: in_progress
Priority: high

## 1. Overview & Scope

Build the responsive, branded customer portal interface for NileLink clients, including a collapsible sidebar, contextual header, mobile bottom navigation, urgent account health alert banner, 4 KPI metric cards, quick document dropzone widget, and recent activity feed.

---

## 2. Master Subtask Checklist

- [x] Subtask 01 — Customer Portal Root Layout & Route Protection (`/[locale]/portal/layout.tsx`)
- [x] Subtask 02 — Collapsible CMA-CGM Style Portal Sidebar (`PortalSidebar.tsx`)
- [x] Subtask 03 — Portal Context & Real-Time Sync Provider (`PortalContext.tsx`)
- [x] Subtask 04 — Portal Header with Breadcrumbs & Theme Switcher (`PortalHeader.tsx`)
- [x] Subtask 05 — Mobile Bottom Navigation Bar (`MobileBottomNav.tsx`)
- [x] Subtask 06 — Urgent Account Health Banner (`AccountHealthAlertBanner.tsx`)
- [x] Subtask 07 — 4 Overview Metric Cards (`DashboardMetricsCards.tsx`)
- [x] Subtask 08 — Quick Document Upload Widget (`QuickUploadWidget.tsx`)
- [x] Subtask 09 — Customer Recent Activity Feed (`RecentActivityFeed.tsx`)
- [x] Subtask 10 — Main Customer Dashboard Page Assembly (`/[locale]/portal/page.tsx`)

---

## 3. Subtask Details

### Subtask 01 — Customer Portal Master Layout & Navigation Shell

#### Objective
Create the root layout for all customer portal routes (`/[locale]/portal/*`) with auth guard verification, user context provider, and responsive structure matching the aesthetic standards of CMA-CGM and MSC.

#### Why it is needed
Provides a consistent, secure, and branded wrapper for all client self-service modules.

#### Where it should be implemented
- `app/[locale]/portal/layout.tsx`
- `components/portal/PortalLayoutClient.tsx`
- `components/portal/PortalContext.tsx`

#### Expected Result
- Server-side session verification verifying `role === "customer"` or `role === "customer_admin"`.
- Context provider providing `currentUser`, `currentCustomer`, unread notification count, and active document health status.
- Split layout: Fixed/collapsible sidebar on desktop, responsive main content area, and mobile navigation container.
- Full RTL and LTR support with automatic margin/padding directional flips.

#### Dependencies
- `02-auth-backend-security.md` (RBAC & Auth verification)
- `01-database-schema-models.md`

#### Acceptance Criteria
- Unauthorized requests redirect to `/login`.
- Theme toggle (Dark/Light mode) applies instantly without page flicker.
- Supports smooth layout transitions on sidebar collapse/expand.

---

### Subtask 02 — Collapsible Sidebar & Navigation Links

#### Objective
Build the desktop sidebar navigation component with active route highlighting, badge counters (e.g. expiring documents count, unread notifications), and collapsible state (icon-only mode).

#### Why it is needed
Enables swift navigation across all portal features with clear visual hierarchy.

#### Where it should be implemented
`components/portal/PortalSidebar.tsx`

#### Expected Result
- NileLink Portal Logo & Company Name.
- Navigation Menu Items:
  1. **Dashboard** (`/portal`): Overview & KPIs.
  2. **My Documents** (`/portal/documents`): Document registry & 20-file upload (with badge count if documents are expiring).
  3. **Service Requests** (`/portal/requests`): Active shipments and inquiries.
  4. **Financials & Invoices** (`/portal/financials`): Invoices, receipts & payments.
  5. **Notifications** (`/portal/notifications`): Full notification inbox.
  6. **Company Profile** (`/portal/profile`): Legal data & account settings.
- Collapse/Expand toggle button (persisting preference in local storage).
- Customer organization name and quick account status badge (`Active` 🟢 / `Warning` 🟡 / `Inactive` 🔴) at the bottom of the sidebar.

#### Dependencies
- `lucide-react`
- `next-intl`

#### Acceptance Criteria
- Active link is prominently styled with primary brand accents.
- Badge counters reflect live document expiry and notification states.

---

### Subtask 03 — Portal Header, Profile Dropdown & Notification Bell

#### Objective
Build the top header bar featuring dynamic page breadcrumbs, live search shortcut, quick notification bell popover with unread counter, and user profile avatar menu.

#### Why it is needed
Offers global utility actions accessible from every portal page.

#### Where it should be implemented
- `components/portal/PortalHeader.tsx`
- `components/portal/ProfileDropdown.tsx`
- `components/portal/NotificationBellPopover.tsx`

#### Expected Result
- Breadcrumb navigation showing current section (e.g., `Portal > Documents > Upload`).
- Notification Bell displaying real-time unread badge count (pulsing red if urgent expiry alerts exist).
- Clicking notification bell opens a floating popover showing the 5 most recent alerts with "Mark all as read" and "View all" links.
- Profile dropdown containing: User Full Name, Role badge, "My Profile", "Security & Password", and "Sign Out" button (calling `/api/auth/logout`).

#### Dependencies
- `02-auth-backend-security.md` (`/api/auth/logout`)
- `09-notification-system-email-whatsapp.md`

#### Acceptance Criteria
- Logout terminates session and redirects to `/login`.
- Clicking a notification in popover navigates to the relevant document/request.

---

### Subtask 04 — Mobile Bottom Navigation & Touch Drawer

#### Objective
Implement an Android/iOS app-style mobile navigation bar fixed at the bottom of the viewport on small screens, combined with a slide-over touch drawer for secondary menu items.

#### Why it is needed
Delivers a first-class mobile experience for logistics managers and customers accessing the portal on mobile phones.

#### Where it should be implemented
- `components/portal/MobileBottomNav.tsx`
- `components/portal/MobileDrawer.tsx`

#### Expected Result
- Fixed bottom bar on `< 768px` screens with 4 primary icons: **Dashboard**, **Documents**, **Requests**, and **Menu**.
- Tapping "Menu" slides out a full-height touch drawer with remaining links (Financials, Profile, Notifications, Theme switcher, Logout).
- Minimum 48px touch targets for mobile accessibility.

#### Dependencies
- `framer-motion`

#### Acceptance Criteria
- Smooth 60fps swipe-to-dismiss animation for mobile drawer.
- Safe area inset padding for modern iOS and Android navigation bars.

---

### Subtask 05 — Customer Account Health & Expiry Alert Banner

#### Objective
Create a prominent status banner displayed at the top of the Customer Dashboard that dynamically warns clients if their documents are expiring soon or expired, with a direct CTA button.

#### Why it is needed
Ensures immediate visibility for critical legal compliance deadlines (e.g., "Your Commercial Registration will expire in 8 days").

#### Where it should be implemented
`components/portal/AccountHealthAlertBanner.tsx`

#### Expected Result
- When all documents are valid (> 30 days): Subtle green banner "All documents verified and up to date."
- When documents are in Warning / Urgent state (≤ 10 days): Amber/Orange banner with pulsing warning icon:
  `⚠️ Warning: 1 document will expire in 8 days (Commercial Registration). Please renew to avoid service disruption.` + `[Upload New Document]` CTA button.
- When documents are Expired / Inactive: High-contrast red banner:
  `⛔ Critical: Your Tax Card expired 2 days ago. Account features may be restricted.` + `[Renew Now]` CTA button.

#### Dependencies
- `08-expiry-detection-progressive-warnings.md`

#### Acceptance Criteria
- Clicking "Upload New Document" immediately opens the upload drawer/modal on the Documents page.
- Alert updates in real-time when new documents are uploaded or approved.

---

### Subtask 06 — Executive Metrics KPI Cards

#### Objective
Build a grid of metric summary cards on the Customer Dashboard displaying key operational metrics with trends and status badges.

#### Why it is needed
Provides at-a-glance visibility into company standing, document counts, and shipment requests.

#### Where it should be implemented
`components/portal/DashboardMetricsCards.tsx`

#### Expected Result
4 primary KPI Cards:
1. **Account Status**: `Active` / `Warning` / `Inactive` (with color badge and days until next renewal).
2. **Total Documents**: Count of uploaded files (e.g. `12 / 20 Used`), with breakdown: `10 Approved`, `1 Pending`, `1 Expiring Soon`.
3. **Active Requests**: Number of ongoing shipping and customs clearance orders.
4. **Outstanding Invoices**: Total pending financial payments and due dates.

#### Dependencies
- `01-database-schema-models.md`
- `lucide-react`

#### Acceptance Criteria
- Cards display skeleton loaders while fetching data.
- Numbers animate smoothly from zero to target value.

---

### Subtask 07 — Quick Upload & Recent Activity Widgets

#### Objective
Build two dashboard widgets: a compact "Quick Document Upload" dropzone and a "Recent Activity & Request Timeline" feed.

#### Why it is needed
Allows clients to immediately drag and drop renewed files from the home screen and monitor recent updates without navigating multiple subpages.

#### Where it should be implemented
- `components/portal/QuickUploadWidget.tsx`
- `components/portal/RecentActivityFeed.tsx`
- `app/[locale]/portal/page.tsx`

#### Expected Result
- **Quick Upload Widget**: Dropzone allowing quick drop of renewed documents that opens the full upload modal with preloaded files.
- **Recent Activity Feed**: Chronological list of events (e.g., "Tax Card approved by NileLink Staff", "Customs Request #NL-0012 moved to In Progress", "Invoice #INV-0481 paid").

#### Dependencies
- `05-customer-document-upload-management.md`
- `07-document-review-verification-engine.md`

#### Acceptance Criteria
- Activity timestamps formatted with relative time (e.g., "2 hours ago", "Yesterday").
- Multilingual Arabic and English date formatting.

---

### Subtask 08 — Localization Strings for Portal Shell & Dashboard

#### Objective
Provide comprehensive Arabic and English translation dictionaries for the portal shell, header, sidebar, dashboard cards, alert banners, and activity feeds.

#### Why it is needed
Guarantees native Arabic and English parity across all dashboard elements.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- Dedicated `portal` namespace containing:
  - `sidebar`: dashboard, documents, requests, financials, notifications, profile, logout, collapse.
  - `header`: search, notifications, unread, viewAll, profile, myAccount.
  - `dashboard`: welcomeBack, accountStatus, kpis, totalDocs, activeRequests, pendingInvoices, recentActivity, quickUpload.
  - `healthBanners`: allValid, warningText, criticalText, uploadCta, renewCta.

#### Dependencies
- `next-intl`

#### Acceptance Criteria
- Clean JSON formatting with matching keys in both Arabic and English dictionaries.

---

## 4. Edge Cases & Handling

1. **Zero Documents State**: If a newly registered client has 0 documents uploaded, the dashboard must display a prominent onboarding wizard card: "Complete Your Company Profile — Upload your 4 required documents (Commercial Register, Tax Card, Import License, Authorized Signature)".
2. **Account Inactive Lockout Notice**: If customer status becomes `Inactive`, display a non-dismissible banner explaining which document caused the suspension and how to resolve it.
3. **Small Screen Table Overflow**: Ensure all cards and feeds wrap gracefully on small mobile screens (320px to 420px width).

---

## 5. Regression Requirements

- Must NOT modify or interfere with the existing public website layout at `app/[locale]/layout.tsx`.
- Must operate cleanly within the existing Next.js App Router localization scheme.

---

## 6. Acceptance Criteria Summary

- [ ] Master portal layout rendered with responsive sidebar, header, and mobile bottom navigation.
- [ ] Account health banner alerts users when documents are expiring (≤ 10 days).
- [ ] 4 KPI cards and Recent Activity widget operational on `/portal`.
- [ ] Full Arabic RTL and English LTR alignment verified.
