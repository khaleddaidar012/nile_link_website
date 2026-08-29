# Task 02 — Customer Accounts Directory & 360° Inspection View

## Overview

- **What this feature does**: Provides managers and authorized employees with a comprehensive customer management console and an interactive 360° inspection drawer/view for each customer account.
- **What problem it solves**: Requirement 2 of `needs.md` requires staff to click on any customer account and immediately inspect its operational health, uploaded compliance documents, expiring files, and change account activation status.
- **Why it is needed**: Freight forwarding and customs operations require fast visibility into client legal standing, impending document expirations, and the ability to freeze or activate accounts based on compliance.
- **How it fits into the existing system**: Enhances `/admin/customers` with deep search/filtering, quick statistics, and a dedicated `CustomerDetailDrawer.tsx` component that queries live customer documents and enables status modifications.

---

## Requirements

1. **Customer Directory Table**:
   - Lists all registered companies with Company Name, Commercial Register #, Tax Card #, Contact Person, Phone, Email, Account Status (`active`, `warning`, `inactive`), and Document Counts.
   - Filter by Account Status (`all`, `active`, `warning`, `inactive`) and Search by name, CR number, or tax ID.
2. **Interactive 360° Customer Inspection Drawer / Modal**:
   - Clicking any customer opens a rich slide-over drawer showing:
     - **Company Profile Header**: Name, registration numbers, contact information, industry, registration date.
     - **Account Health Card**: Visual badge indicating account status (`active` / `warning` / `inactive`) with one-click status change controls (requires `canManageCustomers` permission).
     - **Document Compliance Summary**: Total documents, approved count, expiring soon (<30 days), expired count, and pending review count.
     - **Live Document Explorer Tab**: Displays all files uploaded by this specific customer with preview links, issue/expiry dates, status badges, and direct review action buttons.
     - **Quick Contact & Alert Trigger**: Send direct WhatsApp or Email notification regarding missing or expiring documents.
3. **Account Governance Controls**:
   - Authorize staff (with `canManageCustomers` flag) to change status to `active` (all operations open), `warning` (action needed), or `inactive` (account restricted).

---

## Current Implementation

- `app/[locale]/admin/customers/page.tsx` renders basic customer table.
- `app/api/admin/customers/route.ts` provides basic listing.
- No detailed customer inspection drawer or per-customer document drill-down currently exists in the UI.

---

## Files / Modules Affected

- **Backend APIs**:
  - `app/api/admin/customers/[id]/route.ts` (GET detailed customer profile with associated documents & stats)
  - `app/api/admin/customers/[id]/status/route.ts` (PATCH update account status & reason)
- **Frontend Pages & Components**:
  - `app/[locale]/admin/customers/page.tsx` (Enhanced Customer Management Page)
  - `components/admin/customers/CustomerOverviewTable.tsx` (Refactored interactive table)
  - `components/admin/customers/CustomerDetailDrawer.tsx` (360° Inspection Slide-Over)
  - `components/admin/customers/CustomerStatusBadge.tsx` (Status indicators)
- **Translations**:
  - `messages/*.json` (Customer governance keys in all 7 languages)

---

## Data / Architecture Changes

### New API Endpoints
- `GET /api/admin/customers/[id]`:
  - Returns complete customer record, assigned manager, and array of all uploaded `Document` records with expiry status and activity history.
- `PATCH /api/admin/customers/[id]/status`:
  - Body: `{ "accountStatus": "active" | "warning" | "inactive", "statusReason": string }`
  - Validates `canManageCustomers` permission and writes audit log.

---

## UI / UX Changes

- **Slide-over Drawer**:
  - Smooth animation using Framer Motion opening from the right (or left in RTL).
  - Tabbed or structured sections: "Overview & Compliance", "Uploaded Documents", "Communication History".
- **Interactive Action Bar**:
  - "Activate Account", "Set Warning", "Suspend / Restrict" action buttons with confirmation modals.
- **Direct Document Review Link**:
  - Review button directly inside customer drawer opening the review modal without leaving context.

---

## Implementation Plan

1. **Backend Endpoints**:
   - Create `app/api/admin/customers/[id]/route.ts` aggregating customer data, documents, and compliance metrics.
   - Create `app/api/admin/customers/[id]/status/route.ts` with permission verification.
2. **Customer Detail Drawer**:
   - Build `components/admin/customers/CustomerDetailDrawer.tsx` with tabs for company profile, document breakdown, and status controls.
3. **Table Enhancement**:
   - Update `CustomerOverviewTable.tsx` so clicking on any row opens the detailed inspection drawer.
4. **Localization**:
   - Synchronize all labels in Arabic, English, French, German, Italian, Chinese, and Bulgarian.

---

## Small Tasks

- [x] Create `app/api/admin/customers/[id]/route.ts` to return customer profile and all related documents.
- [x] Create `app/api/admin/customers/[id]/status/route.ts` for updating account status with audit logging.
- [x] Build `components/admin/customers/CustomerDetailDrawer.tsx` with compliance charts and document lists.
- [x] Enhance `components/admin/customers/CustomerOverviewTable.tsx` with row click handlers, status chips, and search.
- [x] Add account status toggle buttons (Active, Warning, Restricted) inside drawer with permission check.
- [x] Connect document preview and review action modals directly from within the customer drawer.
- [x] Add translation keys for customer governance in `messages/*.json`.
- [x] Test customer status change updates client dashboard view in real time.

---

## Edge Cases

- Customer with 0 documents uploaded (empty states inside drawer).
- Staff member without `canManageCustomers` attempting to change account status (button disabled with tooltip).
- Account restricted while client is actively navigating portal (portal immediately restricts sensitive operations).

---

## Testing Checklist

- [ ] Verify clicking any customer row opens the 360° inspection drawer.
- [ ] Verify drawer lists all documents uploaded by the customer with correct statuses and countdowns.
- [ ] Verify authorized staff can switch status between `active`, `warning`, and `inactive`.
- [ ] Verify client portal reflects updated account status immediately upon page refresh.
- [ ] Verify drawer renders properly in RTL mode on Arabic locale.

---

## Acceptance Criteria

- Staff can search, filter, and deeply inspect any customer account and all its compliance documents in a single view.
- Account status changes persist in MongoDB and immediately govern customer access permissions.

---

## Dependencies

Depends on:
- Task 01 (Staff RBAC & Permissions)
