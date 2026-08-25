# Task: Database Architecture & Data Models

Status: in_progress
Priority: high

## 1. Overview & Scope

Define and implement the complete MongoDB schema architecture using Mongoose for the NileLink Portal. This includes user identities, customer organizations, multi-file documents with verification states, document activity audit trails, multi-channel notifications, customer service requests with timelines, and billing invoices.

---

## 2. Master Subtask Checklist

- [x] Subtask 01 — User Model & Role Architecture
- [x] Subtask 02 — Customer (Company) Organization Model
- [x] Subtask 03 — Document Model with Expiry & Verification Metadata
- [x] Subtask 04 — Document Activity & Audit Log Model
- [x] Subtask 05 — Multi-Channel Notification Model
- [x] Subtask 06 — Customer Service Request & Timeline Model
- [x] Subtask 07 — Financial Invoice & Payment Model
- [x] Subtask 08 — Database Indexes, Relations & Export Registry

---

## 3. Subtask Details

### Subtask 01 — User Model & Role Architecture

#### Objective
Create the `User` Mongoose schema and TypeScript interface supporting multi-role authentication, password hashing, verification tokens, password reset lifecycles, and association with customer accounts.

#### Why it is needed
Required to manage identity and access control for Customers, Customer Admins, Staff/Employees, and Super Admins.

#### Where it should be implemented
`lib/models/User.ts`

#### Expected Result
A robust Mongoose model containing:
- `email`: string (unique, indexed, lowercase, trimmed)
- `username`: string (unique, sparse, lowercase)
- `passwordHash`: string (bcrypt/argon2 hash)
- `role`: enum (`"customer"`, `"customer_admin"`, `"staff"`, `"super_admin"`) default `"customer"`
- `customerId`: ObjectId referencing `Customer` (nullable for staff/admins)
- `firstName`: string
- `lastName`: string
- `phone`: string
- `avatarUrl`: string (optional)
- `status`: enum (`"active"`, `"inactive"`, `"suspended"`, `"pending_verification"`) default `"pending_verification"`
- `emailVerified`: boolean (default false)
- `emailVerificationToken`: string (optional)
- `emailVerificationExpires`: Date (optional)
- `passwordResetToken`: string (optional)
- `passwordResetExpires`: Date (optional)
- `lastLoginAt`: Date
- `timestamps`: `{ createdAt, updatedAt }`

#### Dependencies
- `mongoose`
- `lib/mongodb.ts`

#### Acceptance Criteria
- User model compiles with full TypeScript typing.
- Unique indexes on `email` and `username`.
- Password hash field excluded by default in JSON serializations (`select: false` or sanitized in toJSON).

---

### Subtask 02 — Customer (Company) Organization Model

#### Objective
Create the `Customer` Mongoose schema representing client companies, their legal registration numbers, dynamic account health status, and assigned staff inspector.

#### Why it is needed
To group users under commercial accounts and track corporate legal compliance, commercial registration, tax status, and overall account validity.

#### Where it should be implemented
`lib/models/Customer.ts`

#### Expected Result
A Mongoose model containing:
- `companyName`: string (required, trimmed)
- `commercialRegisterNumber`: string (required, indexed)
- `taxCardNumber`: string (required, indexed)
- `industry`: string
- `country`: string default `"Egypt"`
- `city`: string
- `address`: string
- `contactPhone`: string (required)
- `contactEmail`: string (required)
- `accountStatus`: enum (`"active"`, `"warning"`, `"inactive"`) default `"warning"`
- `statusReason`: string (explaining why status is warning/inactive)
- `assignedStaffId`: ObjectId referencing `User` (staff inspector)
- `maxAllowedDocuments`: number default `20`
- `notes`: string
- `timestamps`: `{ createdAt, updatedAt }`

#### Dependencies
- Subtask 01 (`User` model)

#### Acceptance Criteria
- Schema supports indexing by `commercialRegisterNumber`, `taxCardNumber`, and `accountStatus`.
- Schema supports automated status changes by the Account Health Engine.

---

### Subtask 03 — Document Model with Expiry & Verification Metadata

#### Objective
Create the `Document` Mongoose schema supporting multi-file uploads (up to 20 documents), verification states, validity dates (start date & expiration date), inspector metadata, rejection reasons, and file storage links.

#### Why it is needed
Core data store for the entire Document Management and Expiry Tracking Workflow.

#### Where it should be implemented
`lib/models/Document.ts`

#### Expected Result
A Mongoose model containing:
- `customerId`: ObjectId referencing `Customer` (required, indexed)
- `uploadedBy`: ObjectId referencing `User` (required)
- `title`: string (e.g. "Commercial Registration", "Tax Card", "Import License")
- `category`: enum (`"commercial_register"`, `"tax_card"`, `"license"`, `"customs_certificate"`, `"contract"`, `"other"`)
- `fileName`: string (original file name)
- `storedFileName`: string (unique storage identifier)
- `fileUrl`: string (relative path or cloud storage URL)
- `fileSize`: number (in bytes)
- `mimeType`: string (`application/pdf`, `image/jpeg`, `image/png`, etc.)
- `fileHash`: string (SHA-256 for duplicate detection)
- `status`: enum (`"pending_review"`, `"approved"`, `"expiring_soon"`, `"expired"`, `"rejected"`) default `"pending_review"`
- `startDate`: Date (set by employee during verification)
- `expiryDate`: Date (indexed, set by employee during verification)
- `daysUntilExpiry`: number (virtual or computed field)
- `rejectionReason`: string (required if status is rejected)
- `reviewNotes`: string (notes entered by reviewing employee)
- `reviewedBy`: ObjectId referencing `User` (staff member)
- `reviewedAt`: Date
- `warningEscalationTier`: enum (`"none"`, `"warning"`, `"urgent"`, `"critical"`, `"expired"`) default `"none"`
- `lastNotificationSentAt`: Date
- `isArchived`: boolean default false
- `timestamps`: `{ createdAt, updatedAt }`

#### Dependencies
- Subtask 01 (`User` model)
- Subtask 02 (`Customer` model)

#### Acceptance Criteria
- Compound index on `{ customerId: 1, status: 1 }`.
- Index on `expiryDate` for fast background expiry scans.
- Index on `fileHash` to prevent duplicate uploads.

---

### Subtask 04 — Document Activity & Audit Log Model

#### Objective
Create the `DocumentActivityLog` Mongoose schema to maintain a comprehensive, immutable audit trail of every document event.

#### Why it is needed
Ensures enterprise accountability by recording when documents are uploaded, previewed, approved, rejected, edited, or when manual/automated warnings are dispatched.

#### Where it should be implemented
`lib/models/DocumentActivityLog.ts`

#### Expected Result
A Mongoose model containing:
- `documentId`: ObjectId referencing `Document` (required, indexed)
- `customerId`: ObjectId referencing `Customer` (required, indexed)
- `actorId`: ObjectId referencing `User` (required)
- `actorType`: enum (`"customer"`, `"staff"`, `"system"`)
- `action`: enum (
    `"upload"`,
    `"view"`,
    `"download"`,
    `"approve"`,
    `"reject"`,
    `"update_dates"`,
    `"send_email_warning"`,
    `"send_whatsapp_warning"`,
    `"status_transition"`,
    `"delete"`
  )
- `previousState`: mongoose.Schema.Types.Mixed (snapshot of previous values)
- `newState`: mongoose.Schema.Types.Mixed (snapshot of new values)
- `notes`: string
- `ipAddress`: string
- `userAgent`: string
- `createdAt`: Date default `Date.now` (indexed)

#### Dependencies
- Subtask 03 (`Document` model)

#### Acceptance Criteria
- Records can be queried by `documentId`, `customerId`, and `action` in descending chronological order.
- Document history retrieval latency is optimized through indexing.

---

### Subtask 05 — Multi-Channel Notification Model

#### Objective
Create the `Notification` Mongoose schema to store in-app notifications and track delivery status for Email and WhatsApp dispatches.

#### Why it is needed
Required to power the Customer and Employee notification centers and track automated/manual communication delivery.

#### Where it should be implemented
`lib/models/Notification.ts`

#### Expected Result
A Mongoose model containing:
- `recipientUserId`: ObjectId referencing `User` (indexed)
- `recipientCustomerId`: ObjectId referencing `Customer` (indexed)
- `targetAudience`: enum (`"customer"`, `"staff"`, `"all_staff"`, `"super_admin"`)
- `title`: string (bilingual support or key)
- `message`: string
- `channel`: enum (`"in_app"`, `"email"`, `"whatsapp"`, `"multi"`) default `"in_app"`
- `type`: enum (
    `"document_uploaded"`,
    `"document_approved"`,
    `"document_rejected"`,
    `"document_expiring_10d"`,
    `"document_expiring_7d"`,
    `"document_expiring_3d"`,
    `"document_expiring_1d"`,
    `"document_expired"`,
    `"manual_staff_warning"`,
    `"account_status_change"`,
    `"request_update"`
  )
- `severity`: enum (`"normal"`, `"warning"`, `"urgent"`, `"critical"`) default `"normal"`
- `relatedDocumentId`: ObjectId referencing `Document` (optional)
- `isRead`: boolean default false
- `readAt`: Date
- `emailStatus`: enum (`"not_applicable"`, `"pending"`, `"sent"`, `"failed"`) default `"not_applicable"`
- `emailDeliveredAt`: Date
- `whatsappStatus`: enum (`"not_applicable"`, `"pending"`, `"sent"`, `"delivered"`, `"failed"`) default `"not_applicable"`
- `whatsappMessageId`: string
- `whatsappDeliveredAt`: Date
- `dispatchedBy`: ObjectId referencing `User` (null if system automated)
- `createdAt`: Date default `Date.now` (indexed)

#### Dependencies
- Subtask 01 (`User` model)
- Subtask 03 (`Document` model)

#### Acceptance Criteria
- Efficient querying for unread notifications per user (`{ recipientUserId: 1, isRead: 1 }`).
- Deduplication indexing on `{ relatedDocumentId: 1, type: 1, createdAt: -1 }` to prevent duplicate alerts within the same notification window.

---

### Subtask 06 — Customer Service Request & Timeline Model

#### Objective
Create the `CustomerRequest` Mongoose schema to track inquiries, shipping orders, and custom service requests with an event timeline.

#### Why it is needed
Enables clients to submit operational requests from their portal and track status progress transparently.

#### Where it should be implemented
`lib/models/CustomerRequest.ts`

#### Expected Result
A Mongoose model containing:
- `customerId`: ObjectId referencing `Customer` (required, indexed)
- `requestedBy`: ObjectId referencing `User` (required)
- `trackingNumber`: string (unique, e.g. "NL-REQ-2026-0012")
- `serviceType`: enum (`"freight_booking"`, `"customs_clearance"`, `"warehousing"`, `"transportation"`, `"general_inquiry"`)
- `subject`: string (required)
- `description`: string (required)
- `priority`: enum (`"low"`, `"medium"`, `"high"`, `"urgent"`) default `"medium"`
- `status`: enum (`"submitted"`, `"under_review"`, `"in_progress"`, `"waiting_customer"`, `"completed"`, `"cancelled"`) default `"submitted"`
- `assignedStaffId`: ObjectId referencing `User`
- `timeline`: Array of `{ status: string, title: string, comment: string, updatedBy: ObjectId, createdAt: Date }`
- `attachments`: Array of `{ fileName: string, fileUrl: string, fileSize: number, uploadedAt: Date }`
- `timestamps`: `{ createdAt, updatedAt }`

#### Dependencies
- Subtask 01 (`User` model)
- Subtask 02 (`Customer` model)

#### Acceptance Criteria
- Auto-generation or custom sequence for `trackingNumber`.
- Timeline array automatically captures status changes with timestamp and user ID.

---

### Subtask 07 — Financial Invoice & Payment Model

#### Objective
Create the `Invoice` Mongoose schema to store client billing statements, payment statuses, and downloadable invoice files.

#### Why it is needed
Required for the financial/payments section of the Customer Portal.

#### Where it should be implemented
`lib/models/Invoice.ts`

#### Expected Result
A Mongoose model containing:
- `customerId`: ObjectId referencing `Customer` (required, indexed)
- `invoiceNumber`: string (unique, indexed, e.g. "INV-2026-0481")
- `relatedRequestId`: ObjectId referencing `CustomerRequest` (optional)
- `amount`: number (required)
- `currency`: string default `"EGP"`
- `status`: enum (`"pending"`, `"paid"`, `"overdue"`, `"cancelled"`) default `"pending"`
- `issueDate`: Date (required)
- `dueDate`: Date (required)
- `paidAt`: Date
- `paymentMethod`: string (optional)
- `paymentReference`: string (optional)
- `pdfUrl`: string
- `notes`: string
- `timestamps`: `{ createdAt, updatedAt }`

#### Dependencies
- Subtask 02 (`Customer` model)
- Subtask 06 (`CustomerRequest` model)

#### Acceptance Criteria
- Fast filtering of invoices by `customerId` and `status`.
- Support for multiple currencies (`EGP`, `USD`, `EUR`).

---

### Subtask 08 — Database Indexes, Relations & Export Registry

#### Objective
Consolidate all data models into a central exports barrel file with Mongoose connection verification, hot-reload safety, and automated index creation.

#### Why it is needed
Prevents Mongoose `OverwriteModelError` in Next.js development hot-reloading and guarantees optimal query performance in production.

#### Where it should be implemented
`lib/models/index.ts`

#### Expected Result
A centralized barrel file exporting:
- `User`, `Customer`, `Document`, `DocumentActivityLog`, `Notification`, `CustomerRequest`, `Invoice`
- Exported TypeScript types and interfaces for each model.

#### Dependencies
- Subtasks 01 through 07

#### Acceptance Criteria
- Model initialization handles `mongoose.models[ModelName] || mongoose.model(...)` pattern cleanly.
- Export file is fully typed with zero circular dependency warnings.

---

## 4. Edge Cases & Handling

1. **Duplicate Document Uploads**: Prevent accidental duplicate uploads by hashing file contents (SHA-256) and warning the user if an identical file hash already exists under their customer account.
2. **Missing Customer Reference**: Staff users must have nullable `customerId`, whereas Customer users must require a valid `customerId`.
3. **Mongoose Hot Reload in Next.js**: Ensure all models check `mongoose.models.ModelName` before compilation to avoid Next.js dev server runtime crashes.
4. **Timezone Normalization**: All dates (`startDate`, `expiryDate`, `createdAt`) must be normalized and stored as UTC timestamps in MongoDB.

---

## 5. Regression Requirements

- Must NOT modify or alter existing `lib/models/AnalyticsEvent.ts`.
- Must NOT break the existing `connectDB()` helper in `lib/mongodb.ts`.

---

## 6. Acceptance Criteria Summary

- [ ] All 7 Mongoose model files created with complete TypeScript interfaces.
- [ ] Central `lib/models/index.ts` barrel file created.
- [ ] Indexes defined for `email`, `commercialRegisterNumber`, `expiryDate`, `customerId`, `status`, and `fileHash`.
- [ ] No regression on existing analytics database functionality.
