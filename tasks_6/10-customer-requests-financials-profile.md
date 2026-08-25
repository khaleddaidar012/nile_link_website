# Task: Customer Requests, Financials & Company Profile Management

Status: pending
Priority: high

## 1. Overview & Scope

Design and implement the secondary business operations modules of the Customer Portal: Customer Requests/Orders Management with an interactive progress timeline, Financial Invoices & Billing History with PDF download capabilities, and the Company & Personal Profile settings management interface.

---

## 2. Master Subtask Checklist

- [ ] Subtask 01 — Customer Requests List & Filter Page (`/[locale]/portal/requests`)
- [ ] Subtask 02 — New Service Request Creation Modal & Attachment Upload
- [ ] Subtask 03 — Request Details View & Interactive Status Timeline
- [ ] Subtask 04 — Financials & Invoices Registry Page (`/[locale]/portal/financials`)
- [ ] Subtask 05 — Invoice Download API & Receipt Viewer
- [ ] Subtask 06 — Customer & Company Profile Management Page (`/[locale]/portal/profile`)
- [ ] Subtask 07 — Security & Password Update Tab
- [ ] Subtask 08 — Localization Strings for Requests, Financials & Profile

---

## 3. Subtask Details

### Subtask 01 — Customer Requests List & Filter Page (`/[locale]/portal/requests`)

#### Objective
Build the Customer Requests page displaying shipping orders, customs clearance requests, and operational inquiries in a responsive table/card list with search, status filters, and priority tags.

#### Why it is needed
Allows clients to monitor their active shipping consignments, customs requests, and support tickets in one centralized place.

#### Where it should be implemented
- `app/[locale]/portal/requests/page.tsx`
- `app/api/portal/requests/route.ts`
- `components/portal/requests/RequestsTable.tsx`

#### Expected Result
- Filter tabs: `All`, `Submitted`, `Under Review`, `In Progress`, `Completed`, `Cancelled`.
- Search bar (by Tracking Number e.g. `NL-REQ-2026-0012` or Subject).
- Table columns:
  1. **Tracking Number & Service Type** (Freight Booking, Customs Clearance, Warehousing).
  2. **Subject & Summary**.
  3. **Priority** (`Low`, `Medium`, `High`, `Urgent`).
  4. **Status Badge** (`Submitted` 🔵, `Under Review` 🟡, `In Progress` 🟣, `Completed` 🟢, `Cancelled` 🔴).
  5. **Created Date** & **Last Updated**.
  6. **Action**: `View Details & Timeline`.

#### Dependencies
- `01-database-schema-models.md` (`CustomerRequest`)
- `04-customer-portal-layout-dashboard.md`

#### Acceptance Criteria
- Instant search and filtering.
- Responsive mobile card view for small screens.

---

### Subtask 02 — New Service Request Creation Modal & Attachment Upload

#### Objective
Create the request submission form allowing customers to specify service type, description, cargo details, priority, and attach relevant operational files (e.g. Bill of Lading, Packing List, Invoice).

#### Why it is needed
Enables clients to initiate new shipping orders and inquiries directly through the portal.

#### Where it should be implemented
- `components/portal/requests/NewRequestModal.tsx`
- `app/api/portal/requests/create/route.ts`

#### Expected Result
- Fields: Service Type (Dropdown), Subject, Cargo/Shipment Description, Priority, Destination Port / Location.
- File attachment dropzone (supports PDF, PNG, JPG up to 10MB).
- Submits payload, generates unique tracking number (`NL-REQ-YYYY-XXXX`), inserts timeline entry ("Request submitted by client"), and dispatches notification to staff.
- Displays success toast with generated tracking ID.

#### Dependencies
- `01-database-schema-models.md`
- `05-customer-document-upload-management.md` (Storage adapter)

#### Acceptance Criteria
- Form validation via Zod requires valid service type and subject.
- Auto-generates sequential tracking number.

---

### Subtask 03 — Request Details View & Interactive Status Timeline

#### Objective
Create the request detail screen featuring consignment summary, attached documents, staff assigned, and a vertical animated progress timeline showing each status transition.

#### Why it is needed
Provides complete transparency into shipping and clearance progress for the client.

#### Where it should be implemented
- `app/[locale]/portal/requests/[id]/page.tsx`
- `components/portal/requests/RequestTimeline.tsx`

#### Expected Result
- Header with tracking number, status badge, and print summary button.
- Vertical interactive timeline displaying:
  - Step 1: `Request Submitted` (Date, User Name).
  - Step 2: `Under Review by NileLink Operations` (Date, Assigned Staff).
  - Step 3: `Customs Clearance in Progress` (Date, Notes).
  - Step 4: `Dispatched / Completed` (Date).
- Attachments list with download buttons.
- Customer comment box for communicating updates with assigned staff.

#### Dependencies
- `framer-motion`
- `lucide-react`

#### Acceptance Criteria
- Timeline highlights completed steps in green, current step in pulsing blue, and future steps in gray.

---

### Subtask 04 — Financials & Invoices Registry Page (`/[locale]/portal/financials`)

#### Objective
Build the client financial overview page displaying billing statements, outstanding balances, paid invoices, and payment statuses.

#### Why it is needed
Allows corporate clients to track invoices, download tax-compliant receipts, and review billing statements.

#### Where it should be implemented
- `app/[locale]/portal/financials/page.tsx`
- `app/api/portal/financials/route.ts`
- `components/portal/financials/InvoicesTable.tsx`
- `components/portal/financials/FinancialSummaryCards.tsx`

#### Expected Result
- 3 Financial Metric Cards:
  1. `Total Invoiced (YTD)`
  2. `Paid Amount`
  3. `Outstanding / Due Balance` (highlighted in red if overdue).
- Filterable Invoices Table:
  1. **Invoice Number** (e.g. `INV-2026-0819`).
  2. **Issue Date** & **Due Date**.
  3. **Amount & Currency** (e.g. `24,500 EGP` / `$1,200 USD`).
  4. **Status Badge** (`Paid` 🟢, `Pending` 🟡, `Overdue` 🔴, `Cancelled` ⚪).
  5. **Actions**: `Download PDF Invoice`, `View Breakdown`.

#### Dependencies
- `01-database-schema-models.md` (`Invoice`)

#### Acceptance Criteria
- Overdue invoices are visually emphasized with warning badges.
- Formats currency accurately according to locale.

---

### Subtask 05 — Invoice Download API & Receipt Viewer

#### Objective
Create the authenticated PDF download endpoint and in-browser invoice viewer modal for client invoices.

#### Why it is needed
Enables clients to download official PDF invoices for their accounting and tax audits.

#### Where it should be implemented
- `app/api/portal/financials/[id]/download/route.ts`
- `components/portal/financials/InvoiceViewerModal.tsx`

#### Expected Result
- Verifies that invoice belongs to authenticated customer's `customerId`.
- Streams generated or stored PDF file with correct headers (`Content-Type: application/pdf`).
- Modal offers print shortcut and direct download button.

#### Dependencies
- Subtask 04

#### Acceptance Criteria
- Unauthorized requests return 403 Forbidden.
- Download initiates with clean filename (`NileLink-Invoice-INV-2026-0819.pdf`).

---

### Subtask 06 — Customer & Company Profile Management Page (`/[locale]/portal/profile`)

#### Objective
Build the comprehensive company and personal profile settings page allowing clients to update contact details, corporate address, billing details, and manage authorized company representatives.

#### Why it is needed
Allows clients to keep corporate registration data, tax numbers, and contact persons up to date.

#### Where it should be implemented
- `app/[locale]/portal/profile/page.tsx`
- `app/api/portal/profile/route.ts`
- `components/portal/profile/CompanyProfileForm.tsx`
- `components/portal/profile/PersonalProfileForm.tsx`

#### Expected Result
- **Tab 1: Company Profile**:
  - Legal Company Name, Commercial Registration No., Tax Card No.
  - Industry, Corporate Address, City, Country.
  - Primary Billing Email & Phone.
- **Tab 2: Personal Profile**:
  - First Name, Last Name, Email, Mobile Phone, Job Title.
  - Profile Avatar upload.
- Submits updates to `/api/portal/profile` and displays success toast.

#### Dependencies
- `01-database-schema-models.md` (`Customer`, `User`)
- `react-hook-form` + `zod`

#### Acceptance Criteria
- CR Number and Tax Card Number changes require confirmation or trigger review flag.
- Validates phone and email formats.

---

### Subtask 07 — Security & Password Update Tab

#### Objective
Create the Security & Credentials management tab allowing users to change their account password, view active session history, and toggle security preferences.

#### Why it is needed
Ensures users have direct self-service control over account security.

#### Where it should be implemented
`components/portal/profile/SecuritySettingsTab.tsx`

#### Expected Result
- Fields: Current Password, New Password, Confirm New Password.
- Real-time password strength meter.
- Submits to `/api/auth/change-password`.
- On success: clears form and shows confirmation toast.

#### Dependencies
- `02-auth-backend-security.md`

#### Acceptance Criteria
- Rejects new password if current password is incorrect.
- Requires standard password complexity.

---

### Subtask 08 — Localization Strings for Requests, Financials & Profile

#### Objective
Add all Arabic and English translations for request creation, timeline steps, invoice tables, and profile fields in `messages/ar.json` and `messages/en.json`.

#### Why it is needed
Ensures Arabic and English language support across all business operations.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- `requests` namespace: listTitle, newRequest, serviceType, subject, description, priority, trackingNo, timelineTitle.
- `financials` namespace: billingTitle, totalInvoiced, paidAmount, outstandingBalance, invoiceNo, dueDate, amount, payStatus, downloadInvoice.
- `profile` namespace: companyDetails, personalDetails, securityTab, changePassword, saveChanges, updateSuccess.

#### Dependencies
- `next-intl`

#### Acceptance Criteria
- Matching keys in both AR and EN files.

---

## 4. Edge Cases & Handling

1. **Simultaneous Profile Updates**: Handle concurrent edits from multiple company admins gracefully.
2. **Missing Invoices**: Show empty state illustration with message: "No invoices currently on file. New billing statements will appear here after shipping clearance."
3. **Large Request Attachments**: Validate file sizes on the client before upload to prevent slow failure timeouts.

---

## 5. Regression Requirements

- Must NOT affect the existing public `/request-quote` marketing page.
- Profile changes must not break existing user session claims without token refresh.

---

## 6. Acceptance Criteria Summary

- [ ] Requests list, creation modal, and interactive timeline fully functional.
- [ ] Financials page displays summary cards, invoice table, and PDF download.
- [ ] Company profile and personal profile editing operational.
- [ ] Security password change tab verified.
- [ ] Arabic RTL and English LTR alignment verified across all forms.
