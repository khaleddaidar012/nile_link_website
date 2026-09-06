# Task: Document Management System

Status: pending
Priority: high

## Objective
Implement a highly professional, multi-file document upload and management system for the customer, complete with progress tracking and validations.

## Dependencies
- Requires `01-authentication.md`
- Requires `02-portals-ui.md`

## Acceptance Criteria
- [ ] Customer can upload up to 20 documents simultaneously.
- [ ] Upload interface supports drag & drop.
- [ ] Progress bars accurately reflect upload status.
- [ ] File validations (size, type, duplicates) block invalid uploads.
- [ ] Customer can view a dashboard of all uploaded documents with their statuses.

---

### Subtask 3.1 — Storage & API
- [ ] Configure secure file storage (e.g., AWS S3 / Cloudflare R2).
- [ ] Create `POST /api/portal/documents/upload` endpoint to handle multipart form data or pre-signed URLs.
- [ ] Create `GET /api/portal/documents` endpoint to fetch customer documents.
- [ ] Implement backend validation for file types, size limits, and max file count (20).

### Subtask 3.2 — Multi-File Upload UI
- [ ] Build a professional Drag & Drop upload component.
- [ ] Implement individual file progress bars and an overall progress indicator.
- [ ] Add visual loaders and animations during the upload process.
- [ ] Display upload success and failure states per file.
- [ ] Implement a "Retry" button for failed file uploads.
- [ ] Show a dynamic counter (e.g., `12 / 20 files`).

### Subtask 3.3 — Customer Documents Dashboard
- [ ] Build `Customer Documents` page in the portal.
- [ ] Implement a data table/card view displaying: Document Name, Start Date, Expiry Date, and Status.
- [ ] Include filters for document statuses (Active, Expiring Soon, Expired).
- [ ] Ensure the table handles empty states (no documents uploaded yet).
