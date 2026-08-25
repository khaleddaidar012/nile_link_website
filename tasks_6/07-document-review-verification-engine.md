# Task: Employee Document Verification Engine & Customer Health Calculator
# Task: Document Review, Verification Engine & Account Health

Status: in_progress
Priority: high

## 1. Overview & Scope

Build the Employee Document Review Queue and Verification Engine allowing NileLink inspectors to examine uploaded documents, set Start Date and Expiry Date, approve or reject with reason codes, add reviewer notes, and trigger automated recalculation of Customer Account Status (`Active`, `Warning`, `Inactive`).

---

## 2. Master Subtask Checklist

- [x] Subtask 01 — Document Verification API Route (`/api/admin/documents/[id]/verify`)
- [x] Subtask 02 — Document Review Queue API Route (`/api/admin/documents/review`)
- [x] Subtask 03 — Customer Account Health Calculation Engine (`account-health-engine.ts`)
- [x] Subtask 04 — Document Activity & Audit Log Service (`activity-log-service.ts`)
- [x] Subtask 05 — Document Review Modal Component (`DocumentReviewModal.tsx`)
- [x] Subtask 06 — Document Review Queue Page (`/[locale]/admin/documents/review/page.tsx`)
- [ ] Subtask 07 — Document Review & Verification Inspection Modal
- [ ] Subtask 08 — Start Date & Expiry Date Verification Form
- [ ] Subtask 09 — Rejection Workflow & Reason Management
- [ ] Subtask 10 — Localization Strings for Document Verification

---

## 3. Subtask Details

### Subtask 01 — Employee Document Review Queue (`/[locale]/admin/documents/review`)

#### Objective
Build the dedicated document triage queue where staff view all documents awaiting review (`status: "pending_review"`), ordered by upload time with client details, category, and quick inspect buttons.

#### Why it is needed
Centralizes pending verification tasks so employees can process customer submissions without missing any files.

#### Where it should be implemented
- `app/[locale]/admin/documents/review/page.tsx`
- `app/api/admin/documents/review/route.ts`
- `components/admin/review/ReviewQueueTable.tsx`

#### Expected Result
- Filterable queue table displaying:
  1. **Upload Time** (e.g., "15 minutes ago").
  2. **Customer / Company Name** (clickable link to customer profile).
  3. **Document Category** (Commercial Register, Tax Card, License, etc.).
  4. **File Name & Size** (PDF/Image icon, e.g. `commercial_reg_2026.pdf`).
  5. **Uploaded By** (User name & email).
  6. **Action Button**: `Review & Verify` (opens inspection modal).
- Bulk selection options: Filter by Category, Customer, or Upload Date.

#### Dependencies
- `01-database-schema-models.md` (`Document`, `Customer`)
- `06-employee-admin-portal-core.md`

#### Acceptance Criteria
- Queue updates in real-time or via manual refresh button.
- Processed documents are removed from the queue immediately upon approval/rejection.

---

### Subtask 02 — Document Review & Verification Inspection Modal

#### Objective
Create a full-featured side-by-side or split inspection modal that displays the uploaded document file (in-browser PDF/image viewer with zoom, rotate, and pan) on the left, and the verification editing form on the right.

#### Why it is needed
Allows employees to visually inspect the physical document while simultaneously keying in and verifying legal dates and metadata without leaving the screen.

#### Where it should be implemented
- `components/admin/review/DocumentReviewModal.tsx`
- `components/admin/review/DocumentViewerPanel.tsx`

#### Expected Result
- **Left Panel (Viewer)**: High-resolution PDF/image canvas with zoom in/out, fit-to-width, rotate, and full-screen preview.
- **Right Panel (Form)**:
  - Document Title & Category selector.
  - Customer Name & Commercial ID (read-only verification).
  - Validity Start Date picker (`startDate`).
  - Expiration Date picker (`expiryDate`).
  - Verification Status radio selector: `Approved` 🟢 | `Rejected` 🔴 | `Keep Pending` 🔵.
  - Employee Review Notes (internal remarks).
  - Submit Verification button.

#### Dependencies
- `lucide-react`
- `framer-motion`

#### Acceptance Criteria
- Supports PDF rendering and image rendering smoothly.
- Keyboard shortcuts for rapid review (`Alt+A` to Approve, `Alt+R` to Reject).

---

### Subtask 03 — Start Date & Expiry Date Verification Form

#### Objective
Implement the date validation and input logic requiring the employee to set the valid start date and expiration date before approving a document.

#### Why it is needed
Accurate start and expiry dates are mandatory for the downstream Expiry Detection Engine and Automated Warning System.

#### Where it should be implemented
`components/admin/review/VerificationForm.tsx`

#### Expected Result
- Start Date: Default to today or user-selected issue date.
- Expiration Date: Must be strictly after Start Date (`expiryDate > startDate`).
- Date picker supports Egyptian calendar format (`DD/MM/YYYY`) and ISO format.
- Quick duration presets: `+1 Year`, `+2 Years`, `+5 Years`, `+6 Months`.
- Real-time calculation of days remaining (e.g., "Valid for 365 days").

#### Dependencies
- `react-hook-form` + `zod`

#### Acceptance Criteria
- Disallows approval if `expiryDate` is missing or in the past (unless deliberately marked expired).
- Visual feedback on validity span.

---

### Subtask 04 — Document Status Transition API (`/api/admin/documents/[id]/verify`)

#### Objective
Create the backend API endpoint to apply employee verification decisions, update document status, record reviewer identity and timestamp, and invoke the customer account health calculator.

#### Why it is needed
Enforces transactional integrity and audit logging on document verification events.

#### Where it should be implemented
`app/api/admin/documents/[id]/verify/route.ts`

#### Expected Result
- Validates payload: `{ status, startDate, expiryDate, rejectionReason, reviewNotes }`.
- Validates staff permissions from session cookie.
- Updates `Document`:
  - `status = payload.status` (`approved` | `rejected` | `pending_review`).
  - `startDate = payload.startDate`.
  - `expiryDate = payload.expiryDate`.
  - `rejectionReason = payload.rejectionReason`.
  - `reviewNotes = payload.reviewNotes`.
  - `reviewedBy = staffUserId`.
  - `reviewedAt = new Date()`.
- Dispatches DocumentActivityLog (`action: "approve"` or `"reject"`).
- Triggers Subtask 06 (`recalculateCustomerAccountStatus(customerId)`).
- Triggers notification to customer user (In-app + Email notification on approval/rejection).
- Returns HTTP 200 with updated document and customer status.

#### Dependencies
- `01-database-schema-models.md`
- `02-auth-backend-security.md`

#### Acceptance Criteria
- Only users with `staff` or `super_admin` role can call this endpoint.
- Rejection requires non-empty `rejectionReason`.

---

### Subtask 05 — Rejection Workflow & Reason Management

#### Objective
Implement a structured rejection workflow offering standardized rejection reason presets and custom guidance notes for the customer.

#### Why it is needed
Helps the customer understand exactly why their document was rejected (e.g. illegible copy, expired stamp) so they can correct and re-upload quickly.

#### Where it should be implemented
- `components/admin/review/RejectionReasonSelector.tsx`
- `constants/rejection-reasons.ts`

#### Expected Result
- Standard Rejection Reason Presets:
  1. `Illegible or Low Quality Copy`
  2. `Document Expired or Invalid Date`
  3. `Missing Official Stamps or Signature`
  4. `Incorrect Company Details / Mismatch`
  5. `Wrong Document Category Uploaded`
  6. `Other (Specify Below)`
- Custom feedback text area where employee can provide specific instructions to the client.
- Sends an instant In-App and Email alert to the customer with the rejection reason and a direct "Re-upload Document" link.

#### Dependencies
- `09-notification-system-email-whatsapp.md`

#### Acceptance Criteria
- Customer dashboard highlights rejected documents in red with the rejection reason clearly displayed.

---

### Subtask 06 — Automated Customer Account Health Engine (`Active` / `Warning` / `Inactive`)

#### Objective
Build a deterministic business logic engine that evaluates all documents for a customer and calculates their global `accountStatus` (`Active` 🟢, `Warning` 🟡, `Inactive` 🔴).

#### Why it is needed
Fulfills the core requirement to automatically reflect account health based on document validity without manual status guessing.

#### Where it should be implemented
`lib/engine/account-health-engine.ts`

#### Expected Result
- `calculateCustomerAccountStatus(customerId: string): Promise<{ status: "active" | "warning" | "inactive", reason: string }>`:
  1. Fetches all active non-archived documents for the customer.
  2. Identifies required mandatory documents (Commercial Register, Tax Card, License).
  3. **Rule 1 (Inactive)**: If any required document is `Expired`, `Rejected`, or missing past deadline → `accountStatus = "inactive"`, `reason = "Required document (Tax Card) is expired/rejected"`.
  4. **Rule 2 (Warning)**: If all required documents are `Approved`, but at least one document has `DaysRemaining <= 10` or is in `pending_review` → `accountStatus = "warning"`, `reason = "Commercial Registration expires in 8 days"`.
  5. **Rule 3 (Active)**: If all required documents are `Approved` and `DaysRemaining > 10` → `accountStatus = "active"`, `reason = "All documents verified and up to date"`.
- Updates `Customer.accountStatus` and `Customer.statusReason` in MongoDB.
- Logs status transition in `DocumentActivityLog` if status changed.

#### Dependencies
- `01-database-schema-models.md` (`Customer`, `Document`)

#### Acceptance Criteria
- Unit-tested logic covers all 3 status transitions.
- Status updates automatically whenever a document is approved, rejected, renewed, or flagged as expired by the background cron.

---

### Subtask 07 — Document Activity Audit Logger Service

#### Objective
Build the helper service that creates immutable audit trail entries in `DocumentActivityLog` for every document event (upload, view, approve, reject, edit dates, manual email warning, manual whatsapp warning).

#### Why it is needed
Guarantees enterprise-level traceability and regulatory compliance for shipping documentation.

#### Where it should be implemented
`lib/services/activity-log-service.ts`

#### Expected Result
- `logDocumentActivity({ documentId, customerId, actorId, actorType, action, previousState, newState, notes, ipAddress, userAgent }): Promise<void>`.
- Client and Admin UI component (`components/shared/ActivityTimeline.tsx`) to display the event history of any document in chronological order.

#### Dependencies
- `01-database-schema-models.md` (`DocumentActivityLog`)

#### Acceptance Criteria
- Activity entries cannot be edited or deleted once written.
- Displays Actor Name (e.g. "Ahmed Staff", "NileLink Engine", "Client Admin") and relative timestamp.

---

### Subtask 08 — Localization Strings for Document Verification

#### Objective
Add all Arabic and English translations for verification queue, modal controls, rejection reasons, and account health statuses in `messages/ar.json` and `messages/en.json`.

#### Why it is needed
Ensures staff and clients experience native language clarity during review and rejection flows.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- `verification` namespace containing:
  - `queueTitle`, `pendingBadge`, `inspectBtn`, `approveBtn`, `rejectBtn`, `startDate`, `expiryDate`, `validityDuration`.
  - `rejectionReasons`: illegible, expired, missingStamps, mismatch, wrongCategory, custom.
  - `accountHealth`: active, warning, inactive, healthReasonText.

#### Dependencies
- `next-intl`

#### Acceptance Criteria
- Accurate Arabic legal and administrative terms used throughout.

---

## 4. Edge Cases & Handling

1. **Simultaneous Staff Review Conflict**: If two staff members open the same document concurrently, the second review submission is prevented with an optimistic lock / concurrency check ("Document was already reviewed by Staff Member X").
2. **Missing Expiry Date on Permanent Documents**: For documents that do not expire (e.g. permanent tax registration certificate), support a "Does Not Expire" checkbox that sets `expiryDate = null` and treats the document as permanently valid.
3. **Customer Re-upload While In Review**: If a customer uploads a replacement while the original is pending, the previous draft is superseded cleanly.

---

## 5. Regression Requirements

- Must NOT affect the existing public contact or quotation form handlers.
- Document storage files must not be deleted upon rejection (must remain for audit evidence).

---

## 6. Acceptance Criteria Summary

- [ ] Employee Review Queue lists all pending documents with inspect triggers.
- [ ] Document Inspection Modal displays side-by-side file viewer and metadata verification form.
- [ ] Start Date and Expiry Date validation enforced before approval.
- [ ] Rejection workflow with preset reasons and client notifications functional.
- [ ] Customer Account Health Engine dynamically calculates `Active`, `Warning`, and `Inactive`.
- [ ] Full activity audit log recorded for every review action.
