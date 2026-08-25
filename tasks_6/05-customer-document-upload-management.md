# Task: Customer Document Upload Engine & Management Dashboard
# Task: Document Upload, Management & Lifecycle

Status: in_progress
Priority: high

## 1. Overview & Scope

Develop the customer document management module supporting up to 20 files, multi-file drag-and-drop uploads, individual and aggregate progress bars, retry logic for failed files, document status indicators (🟢 Valid, 🟡 Expiring Soon, 🔴 Critical/Expired, 🔵 Pending Review, ❌ Rejected), search and filter capabilities, document downloading, and renewal workflows.

---

## 2. Master Subtask Checklist

- [x] Subtask 01 — Storage Adapter & Secure File System Manager
- [x] Subtask 02 — Batch Multi-File Upload API Route (`/api/portal/documents/upload`)
- [x] Subtask 03 — Customer Documents List & Filter API (`/api/portal/documents`)
- [x] Subtask 04 — Secure Document Download API Route (`/api/portal/documents/[id]/download`)
- [x] Subtask 05 — Multi-File Animated Upload Zone (`MultiFileUploadZone.tsx`)
- [x] Subtask 06 — Document Expiry & Status Badges (`ExpiryStatusBadge.tsx`)
- [x] Subtask 07 — Interactive Document Data Table (`DocumentTable.tsx`)
- [x] Subtask 08 — Master Customer Documents Page (`/[locale]/portal/documents/page.tsx`)
- [ ] Subtask 08 — Document Preview, Download & Renewal Workflows
- [ ] Subtask 09 — Localization Strings for Document Management

---

## 3. Subtask Details

### Subtask 01 — Document Upload API Route (`/api/portal/documents/upload`)

#### Objective
Create the Next.js API route handler to process multi-part form data uploads for customer documents, verifying authentication, customer ownership, quota limits, file sizes, and MIME types.

#### Why it is needed
Receives and securely stores document files while recording metadata and initial `pending_review` status in MongoDB.

#### Where it should be implemented
`app/api/portal/documents/upload/route.ts`

#### Expected Result
- Authenticates session and extracts `customerId` and `userId`.
- Checks current active document count against the 20-document limit; rejects upload if limit would be exceeded with HTTP 400 (`"Document quota of 20 exceeded"`).
- For each uploaded file:
  - Validates MIME type against whitelist (`application/pdf`, `image/jpeg`, `image/png`, `image/webp`).
  - Validates file size (max 10MB per file).
  - Calculates SHA-256 hash to detect duplicates.
  - Generates unique filename (UUID + sanitized original name).
  - Stores file on storage disk/bucket.
  - Inserts `Document` record in MongoDB with `status: "pending_review"`.
  - Creates a `DocumentActivityLog` entry (`action: "upload"`).
- Returns HTTP 201 with created document records.

#### Dependencies
- `01-database-schema-models.md` (`Document`, `DocumentActivityLog`)
- `02-auth-backend-security.md` (Session extraction)

#### Acceptance Criteria
- Uploads exceeding 10MB or containing unwhitelisted extensions (.exe, .sh, .bat, .zip) are rejected immediately with descriptive errors.
- Correctly assigns `status: "pending_review"`.

---

### Subtask 02 — File Storage Adapter & Security Validation Service

#### Objective
Create a modular storage service that abstracts local filesystem and cloud object storage (e.g. S3 / Cloudflare R2), enforces customer directory isolation, and generates secure temporary download URLs.

#### Why it is needed
Prevents insecure direct object references (IDOR) and allows switching between local disk storage and cloud S3/R2 storage seamlessly.

#### Where it should be implemented
`lib/storage/document-storage.ts`

#### Expected Result
- `saveDocumentFile(fileBuffer: Buffer, fileName: string, customerId: string): Promise<{ fileUrl: string, storedFileName: string, fileHash: string }>`.
- `deleteDocumentFile(storedFileName: string, customerId: string): Promise<boolean>`.
- `getDocumentStream(storedFileName: string, customerId: string): Promise<ReadableStream>`.
- Storage directory structure: `storage/documents/{customerId}/{storedFileName}`.
- Sanitizes file names to remove path traversal sequences (`../`, `..\\`).

#### Dependencies
- Node.js `fs/promises`, `path`, `crypto`

#### Acceptance Criteria
- Customer A cannot access Customer B's files via URL manipulation.
- Path traversal exploits are neutralized by strict filename sanitization.

---

### Subtask 03 — Drag & Drop Multi-File Upload Component (Up to 20 Files)

#### Objective
Build a professional React upload component supporting drag-and-drop, multi-file selection from filesystem, document category tagging (e.g. Commercial Register, Tax Card), and batch staging.

#### Why it is needed
Offers a modern, intuitive upload experience for clients uploading multiple business documents simultaneously.

#### Where it should be implemented
- `components/portal/documents/MultiFileUploadZone.tsx`
- `components/portal/documents/UploadModal.tsx`

#### Expected Result
- Interactive dropzone with smooth hover/drag-over animations.
- File selector dialog supporting multi-select (`multiple` attribute).
- Category assignment dropdown per staged file (or auto-detection by filename keywords like "Tax", "Commercial", "CR").
- Staging queue showing staged files before triggering upload.

#### Dependencies
- `framer-motion`
- `lucide-react`

#### Acceptance Criteria
- Dropping files outside the dropzone does not trigger browser default file opening.
- Prevents staging more than the available slot quota (e.g. if user already has 18 documents, only allows staging 2 more).

---

### Subtask 04 — Individual & Aggregate Animated Progress Loaders

#### Objective
Implement real-time visual progress tracking with individual animated progress bars per file and an aggregate batch progress bar during multi-file upload.

#### Why it is needed
Delivers immediate visual feedback during large file transfers, preventing user drop-off or accidental page refresh.

#### Where it should be implemented
`components/portal/documents/UploadProgressList.tsx`

#### Expected Result
- Individual file item: File icon, truncated file name, file size (e.g., `3.4 MB`), progress percentage (`0%` → `100%`), animated progress bar, status icon (spinning loader → green checkmark / red warning).
- Top aggregate bar: "Uploading 4 of 6 files... 68% complete" with smooth linear gradient animation.
- Uses `XMLHttpRequest.upload.onprogress` or `fetch` chunk streaming for accurate byte-level tracking.

#### Dependencies
- `framer-motion`

#### Acceptance Criteria
- Progress bars transition smoothly from 0 to 100%.
- Once all files complete, displays confetti/success banner and auto-refreshes document table.

---

### Subtask 05 — File Counter Indicator & Quota Warning (`12 / 20`)

#### Objective
Display a prominent badge and progress gauge indicating the total number of documents uploaded against the customer account limit (e.g., `12 / 20 Documents Used`).

#### Why it is needed
Keeps the customer aware of their 20-document ceiling and prevents quota overflow surprises.

#### Where it should be implemented
`components/portal/documents/DocumentQuotaGauge.tsx`

#### Expected Result
- Badge showing: `12 / 20 Documents`.
- Visual progress bar:
  - Green when `< 15 / 20`
  - Amber when `15 - 18 / 20`
  - Red when `19 - 20 / 20` with alert: "Document limit reached. Please archive or delete older files to upload new ones."
- "Upload New Documents" button disabled when quota is 20/20.

#### Dependencies
- `components/ui/progress.tsx`

#### Acceptance Criteria
- Automatically recalculates after uploads or deletions.

---

### Subtask 06 — Failed File Retry & Cancellation Mechanisms

#### Objective
Add ability to cancel an ongoing file upload or individually retry a failed file (e.g., due to temporary network failure or server timeout) without restarting the entire batch.

#### Why it is needed
Prevents user frustration on unstable internet connections.

#### Where it should be implemented
`components/portal/documents/UploadFileItem.tsx`

#### Expected Result
- Abort button (`X` icon) triggering `AbortController.abort()` to halt active upload.
- On error: Item turns red, displays error reason (e.g., "Network Timeout"), and shows a "Retry" button.
- Clicking "Retry" re-initiates upload only for that specific file.

#### Dependencies
- Subtask 04

#### Acceptance Criteria
- Aborting an upload stops network transmission immediately and removes partial state.
- Retrying succeeds without re-uploading completed files in the batch.

---

### Subtask 07 — Customer Documents Registry Page (`/[locale]/portal/documents`)

#### Objective
Build the master Documents page displaying all client documents in a filterable table and grid view with status badges, validity dates, and search.

#### Why it is needed
Serves as the primary hub where clients inspect the verification status, validity periods, and expiration dates of their corporate documents.

#### Where it should be implemented
- `app/[locale]/portal/documents/page.tsx`
- `components/portal/documents/DocumentTable.tsx`
- `components/portal/documents/DocumentFilters.tsx`

#### Expected Result
- Search bar (filtering by document title or file name).
- Category filter tabs: `All`, `Commercial Register`, `Tax Card`, `Import License`, `Contracts`, `Others`.
- Status filter: `All`, `Approved`, `Expiring Soon`, `Expired`, `Pending Review`, `Rejected`.
- Data table columns:
  1. **Document Name & Category** (with file icon).
  2. **File Size & Type** (e.g., `PDF • 2.4 MB`).
  3. **Start Date** (e.g. `01/01/2026` or `-` if pending).
  4. **Expiry Date** (e.g. `01/01/2027` with days remaining indicator).
  5. **Status Badge** (`Approved` 🟢, `Expiring Soon` 🟡, `Expired` 🔴, `Pending Review` 🔵, `Rejected` ⛔).
  6. **Actions**: Preview, Download, Renew / Re-upload, View Notes.

#### Dependencies
- `01-database-schema-models.md`
- `08-expiry-detection-progressive-warnings.md` (Badge styles)

#### Acceptance Criteria
- Empty state displayed when 0 documents match search/filters.
- Table sorting by Expiry Date (ascending/descending) and Upload Date.

---

### Subtask 08 — Document Preview, Download & Renewal Workflows

#### Objective
Implement secure document preview in modal (for PDFs and images), direct authenticated download handler, and a one-click "Renew / Replace Document" action.

#### Why it is needed
Allows clients to inspect uploaded copies and replace expiring/rejected documents easily.

#### Where it should be implemented
- `components/portal/documents/DocumentPreviewModal.tsx`
- `app/api/portal/documents/[id]/download/route.ts`
- `components/portal/documents/RenewDocumentModal.tsx`

#### Expected Result
- **Preview Modal**: In-browser PDF renderer or high-res image viewer with zoom controls.
- **Download API**: Streams file with `Content-Disposition: attachment; filename="..."` after verifying customer authorization.
- **Renew Modal**: Pre-selects document category and title, uploads replacement file, sets status to `pending_review`, and archives/replaces previous version.

#### Dependencies
- Subtask 02 (`document-storage.ts`)

#### Acceptance Criteria
- Unauthorized users cannot download documents belonging to other customers.
- PDF preview renders smoothly across Chrome, Safari, Firefox, and Edge.

---

### Subtask 09 — Localization Strings for Document Management

#### Objective
Add all Arabic and English translations for upload states, progress bars, document categories, status badges, and table headers in `messages/ar.json` and `messages/en.json`.

#### Why it is needed
Ensures Arabic and English language support across all document operations.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- `documents` namespace containing:
  - `upload`: title, dropzoneHint, supportedFormats, maxSize, selectFiles, uploadingBatch, progressText, uploadSuccess, uploadFailed, retry, cancel, quotaUsed, limitReached.
  - `table`: colName, colCategory, colSize, colStartDate, colExpiryDate, colStatus, colActions, searchPlaceholder, allCategories, allStatuses.
  - `status`: pendingReview, approved, expiringSoon, expired, rejected, daysLeft.
  - `actions`: preview, download, renew, delete, viewNotes.

#### Dependencies
- `next-intl`

#### Acceptance Criteria
- Matching keys in both AR and EN files with zero untranslated UI labels.

---

## 4. Edge Cases & Handling

1. **Large Multi-File Memory Spike**: Process uploaded files using streams to avoid Node.js buffer exhaustion when uploading 20 large PDFs simultaneously.
2. **Corrupted File Detection**: Validate file buffer magic numbers against declared MIME type to reject renamed malicious files (.exe renamed to .pdf).
3. **Expired Document Replacement**: When a client renews an expired document, the existing document ID is archived and the new file enters `pending_review` while preserving historical audit logs.

---

## 5. Regression Requirements

- Must NOT break any existing public file download routes.
- Must preserve database connection pool stability during high-throughput uploads.

---

## 6. Acceptance Criteria Summary

- [ ] Up to 20 documents supported with active quota tracker (`12 / 20`).
- [ ] Drag-and-drop zone with animated progress bars (individual & aggregate).
- [ ] Individual retry mechanism for failed file transfers.
- [ ] Document registry table with search, category tabs, and status badges.
- [ ] Secure preview and download API route operational.
