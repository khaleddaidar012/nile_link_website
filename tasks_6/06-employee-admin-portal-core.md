# Task: Employee Admin Portal Core & Customer Overview Table

Status: in_progress
Priority: high

## 1. Overview & Scope

Develop the Employee Admin Portal shell, operational analytics dashboard, and the master Customer Overview Table displaying `Client | Documents | Expiring | Expired | Account Status` with search, filtering, and manual warning trigger actions.

---

## 2. Master Subtask Checklist

- [x] Subtask 01 — Admin Portal Root Layout & Route Security (`/[locale]/admin/layout.tsx`)
- [x] Subtask 02 — Admin Collapsible Sidebar & Navigation (`AdminSidebar.tsx`)
- [x] Subtask 03 — Admin Operational Header (`AdminHeader.tsx`)
- [x] Subtask 04 — Admin KPI Analytics Cards (`AdminMetricCards.tsx`)
- [x] Subtask 05 — Document Expiry Horizon Bar Chart (`ExpiryTrendsChart.tsx`)
- [x] Subtask 06 — Urgent Expiry Alert Banner (`UrgentExpiryTicker.tsx`)
- [x] Subtask 07 — Master Customer Overview Table (`CustomerOverviewTable.tsx`)
- [x] Subtask 08 — Admin Dashboard Page (`/[locale]/admin/page.tsx`)
- [ ] Subtask 06 — Staff Alert Ticker & Urgency Counter (`⚠️ 8 documents will expire in 10 days`)
- [ ] Subtask 07 — Staff & Super-Admin Role Management (`/[locale]/admin/staff`)
- [ ] Subtask 08 — Localization Strings for Admin Portal & Analytics

---

## 3. Subtask Details

### Subtask 01 — Admin Portal Master Shell & Layout

#### Objective
Create the root layout for all employee/admin routes (`/[locale]/admin/*`) enforcing strict RBAC verification (`role === "staff"` or `role === "super_admin"`), distinct admin visual branding (dark navy/slate accent), and staff session context.

#### Why it is needed
Guarantees that internal administrative tools and customer data are strictly accessible only to authorized NileLink staff.

#### Where it should be implemented
- `app/[locale]/admin/layout.tsx`
- `components/admin/AdminLayoutClient.tsx`
- `components/admin/AdminContext.tsx`

#### Expected Result
- Server-side RBAC guard rejecting unauthorized or non-staff users with redirect to `/login` or `/portal`.
- Admin context provider supplying `staffUser`, pending verification count, and system health status.
- Admin layout with left sidebar, top action header, and responsive content canvas.
- Full RTL and LTR support.

#### Dependencies
- `02-auth-backend-security.md` (RBAC guard)
- `01-database-schema-models.md` (`User`)

#### Acceptance Criteria
- Customers attempting to load `/admin` are immediately redirected with a 403 access denial.
- Admin session stays active with auto-refreshing token mechanism.

---

### Subtask 02 — Admin Sidebar Navigation & Staff Profile Header

#### Objective
Build the administrative sidebar navigation menu and header bar featuring pending review badge counters, staff role indicator, and quick search across all customers and documents.

#### Why it is needed
Provides employees with immediate access to all administrative modules with live task queues.

#### Where it should be implemented
- `components/admin/AdminSidebar.tsx`
- `components/admin/AdminHeader.tsx`

#### Expected Result
- Sidebar navigation links:
  1. **Analytics Dashboard** (`/admin`): Key metrics, expiry charts & alerts.
  2. **Document Review Queue** (`/admin/documents/review`): Pending documents (with badge count e.g. `[14]`).
  3. **Customers Overview** (`/admin/customers`): Master client table & account health.
  4. **All Documents** (`/admin/documents`): Master document repository.
  5. **Notification Center** (`/admin/notifications`): Staff alert dispatch & log.
  6. **Staff Management** (`/admin/staff`): Super admin role delegation.
  7. **Activity Audit Logs** (`/admin/logs`): Global system event logs.
- Header featuring global client search, staff name & avatar, role badge (`Staff` / `Super Admin`), and logout trigger.

#### Dependencies
- `lucide-react`
- `next-intl`

#### Acceptance Criteria
- Badge counter on "Document Review Queue" updates dynamically when new files are uploaded.
- Sidebar collapses smoothly on tablet and desktop viewports.

---

### Subtask 03 — Employee Customer Overview Page (`/[locale]/admin/customers`)

#### Objective
Create the central Customers management page allowing staff to browse, search, filter, and inspect all registered corporate clients and their compliance status.

#### Why it is needed
Enables staff to quickly pinpoint which clients require manual intervention, document renewals, or account status updates.

#### Where it should be implemented
- `app/[locale]/admin/customers/page.tsx`
- `app/api/admin/customers/route.ts`

#### Expected Result
- API route returning paginated customer records with aggregated document statistics (`totalDocs`, `expiringCount`, `expiredCount`, `accountStatus`).
- Page with search bar (by Company Name, Commercial Register No., Contact Email, Phone).
- Filter dropdowns: Account Status (`All`, `Active`, `Warning`, `Inactive`), Assigned Inspector, Country/City.
- Summary counter ribbon: `Total: 142 Clients` | `Active: 118` | `Warning: 18` | `Inactive: 6`.

#### Dependencies
- `01-database-schema-models.md` (`Customer`, `Document`)

#### Acceptance Criteria
- Pagination supports 10, 25, 50, 100 clients per page.
- Instant search with 300ms debounce.

---

### Subtask 04 — Customer Overview Data Table (`Client | Documents | Expiring | Expired | Account Status`)

#### Objective
Build the high-density data table displaying comprehensive customer standing and one-click operational actions.

#### Why it is needed
Fulfills the core requirement for staff to see at a glance: `Client | Documents | Expiring | Expired | Account Status`.

#### Where it should be implemented
`components/admin/customers/CustomerOverviewTable.tsx`

#### Expected Result
- Table columns:
  1. **Client / Company**: Company Name, CR Number, and contact person.
  2. **Total Documents**: Count badge (e.g. `12 / 20`).
  3. **Expiring Soon**: Amber badge showing count of documents expiring in ≤ 10 days (e.g. `2 Expiring` or `-`).
  4. **Expired**: Red badge showing count of expired documents (e.g. `1 Expired` or `-`).
  5. **Account Status**: Dynamic badge:
     - `Active` 🟢 (All mandatory docs valid)
     - `Warning` 🟡 (Document expiring in ≤ 10 days)
     - `Inactive` 🔴 (Mandatory doc expired or rejected)
  6. **Quick Actions**:
     - `Inspect Documents` (opens customer document list).
     - `Send Expiry Warning` (opens Email/WhatsApp modal).
     - `Edit Account Status` (manual status override).

#### Dependencies
- `components/ui/badge.tsx`
- `07-document-review-verification-engine.md`

#### Acceptance Criteria
- Rows with `Expired` or `Warning` status are subtly highlighted.
- Sorting enabled on Client Name, Expiring Count, Expired Count, and Status.

---

### Subtask 05 — Expiry Analytics & Operational Dashboard (`/[locale]/admin/page.tsx`)

#### Objective
Build the master Admin Dashboard displaying key operational KPI cards and graphical analytical charts powered by Recharts.

#### Why it is needed
Provides leadership and operations managers with aggregate visibility into company compliance, pending workload, and communication performance.

#### Where it should be implemented
- `app/[locale]/admin/page.tsx`
- `components/admin/analytics/AdminMetricCards.tsx`
- `components/admin/analytics/ExpiryTrendsChart.tsx`
- `components/admin/analytics/DocumentStatusDonut.tsx`
- `app/api/admin/analytics/overview/route.ts`

#### Expected Result
- **6 KPI Metric Cards**:
  1. `Total Customers`: Total registered companies with month-over-month growth %.
  2. `Active Customers`: Companies in good standing (100% compliant).
  3. `Inactive / Action Required`: Companies with expired documents.
  4. `Documents Pending Review`: Immediate employee backlog queue count.
  5. `Documents Expiring Soon`: Breakdown of ≤10d, ≤7d, and ≤3d documents.
  6. `Notifications Dispatched`: Total Email & WhatsApp warnings sent this month.
- **Expiry Horizon Chart**: Bar/Line chart showing document expirations across the next 30 days (Today, 3d, 7d, 10d, 30d).
- **Document Status Breakdown**: Donut chart visualizing Approved, Pending, Expiring, Expired, and Rejected documents.

#### Dependencies
- `recharts`
- `01-database-schema-models.md`

#### Acceptance Criteria
- Chart tooltips render cleanly in both Arabic and English locales.
- Dashboard loads within 500ms with aggregated MongoDB queries.

---

### Subtask 06 — Staff Alert Ticker & Urgency Counter (`⚠️ 8 documents will expire in 10 days`)

#### Objective
Display a prominent live alert ticker and badge counter at the top of the Admin Dashboard summarizing upcoming legal document expirations requiring staff attention.

#### Why it is needed
Ensures staff are constantly notified of urgent client deadlines (e.g. `⚠️ 8 documents will expire within 10 days`).

#### Where it should be implemented
`components/admin/analytics/UrgentExpiryTicker.tsx`

#### Expected Result
- Banner displaying:
  `⚠️ Attention: 8 documents across 6 clients will expire within the next 10 days (3 critical in ≤3 days).`
- "Review Expiring Documents" button that filters the review queue to show only expiring items.

#### Dependencies
- `08-expiry-detection-progressive-warnings.md`

#### Acceptance Criteria
- Ticker updates automatically when document dates are modified.
- Highlighting changes dynamically based on maximum urgency.

---

### Subtask 07 — Staff & Super-Admin Role Management (`/[locale]/admin/staff`)

#### Objective
Create the staff user management interface allowing Super Admins to invite staff members, assign roles (`staff`, `super_admin`), and designate assigned customer accounts.

#### Why it is needed
Allows administrative control over internal user permissions and staff accountability.

#### Where it should be implemented
- `app/[locale]/admin/staff/page.tsx`
- `app/api/admin/staff/route.ts`
- `components/admin/staff/StaffManagementTable.tsx`
- `components/admin/staff/InviteStaffModal.tsx`

#### Expected Result
- List of internal staff accounts with role badges, assigned customer count, and last active timestamp.
- "Invite Staff Member" dialog with email, name, role, and temporary password generator.
- Role toggle and account deactivation switch (restricted to Super Admin).

#### Dependencies
- `01-database-schema-models.md` (`User`)
- `02-auth-backend-security.md` (RBAC)

#### Acceptance Criteria
- Regular staff members cannot access `/admin/staff` (Super Admin only).
- Prevents Super Admin from accidentally deleting or locking their own account.

---

### Subtask 08 — Localization Strings for Admin Portal & Analytics

#### Objective
Add all Arabic and English translation dictionaries for admin sidebar, customer table, analytics KPI titles, charts, urgency tickers, and staff management in `messages/ar.json` and `messages/en.json`.

#### Why it is needed
Ensures full bilingual operation for administrative staff in Arabic and English.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- Dedicated `admin` namespace containing:
  - `sidebar`: dashboard, reviewQueue, customers, allDocs, notifications, staff, logs.
  - `analytics`: totalClients, activeClients, inactiveClients, pendingReview, expiringSoon, expiredDocs, notificationsSent, expiryTrend, statusDistribution.
  - `customerTable`: clientName, crNo, totalDocs, expiring, expired, status, actions, sendWarning, viewDocs.
  - `ticker`: attentionTitle, expiringWithin10d, viewExpiringCta.

#### Dependencies
- `next-intl`

#### Acceptance Criteria
- Professional Arabic phrasing for corporate compliance terminology.

---

## 4. Edge Cases & Handling

1. **Large Customer Base Pagination**: Optimize MongoDB aggregation pipeline with indexed cursor/skip pagination to handle 10,000+ customer records smoothly.
2. **Staff Permission Revocation**: If a staff member's role is revoked or account suspended, immediately invalidate their session cookies upon next request.
3. **Empty Data States**: Display engaging empty state illustrations for zero pending reviews or zero expiring documents ("All customer documents are up to date! 🎉").

---

## 5. Regression Requirements

- Must NOT affect customer portal routing or public marketing navigation.
- All admin API routes must be protected against non-staff access.

---

## 6. Acceptance Criteria Summary

- [ ] Admin layout operational with RBAC protection for staff/super-admins.
- [ ] Master Customer Overview Table displays `Client | Documents | Expiring | Expired | Account Status`.
- [ ] Expiry Analytics Dashboard renders 6 KPI cards and Recharts visualizations.
- [ ] Urgent expiry ticker alerts staff of documents expiring in ≤10 days.
- [ ] Staff and role management interface functional for Super Admin.
