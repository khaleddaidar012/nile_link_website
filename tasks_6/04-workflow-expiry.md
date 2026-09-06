# Task: Document Workflow & Expiry Engine

Status: pending
Priority: high

## Objective
Build the employee workflow for reviewing documents and the automated background engine for tracking document expiry and updating customer statuses.

## Dependencies
- Requires `03-document-management.md`

## Acceptance Criteria
- [ ] Employees can review, approve, or reject uploaded documents.
- [ ] Approved documents have a Start Date and Expiry Date.
- [ ] Automated job correctly identifies documents expiring within 10, 7, 3, and 1 days, and marks them accordingly.
- [ ] Customer account status is automatically calculated based on document statuses (Active, Warning, Inactive).

---

### Subtask 4.1 — Employee Document Review UI
- [ ] Build `Admin Document Review` page.
- [ ] Display list of documents pending review.
- [ ] Implement a modal/form for the employee to verify a document.
- [ ] Form fields: Start Date, Expiry Date, Status (Approved, Rejected), and Notes.
- [ ] Record the employee ID and review date automatically.

### Subtask 4.2 — Document Status Workflow
- [ ] Create API endpoint `PUT /api/admin/documents/:id/status`.
- [ ] Define document state machine: `Pending Review -> Approved -> Expiring Soon -> Expired -> Rejected`.
- [ ] Log status changes in the `Activity Log`.

### Subtask 4.3 — Document Expiry Detection Engine
- [ ] Create a background job (cron or equivalent serverless function) to run daily.
- [ ] Query for documents expiring in exactly 10, 7, 3, 1, and 0 days.
- [ ] Update document statuses to `Expiring Soon` or `Expired` as appropriate.
- [ ] Trigger appropriate notification events based on the days remaining.

### Subtask 4.4 — Customer Account Status Engine
- [ ] Create logic to evaluate overall Customer status based on mandatory documents.
- [ ] Rule: All required valid -> `Active`.
- [ ] Rule: Any required expiring soon -> `Warning`.
- [ ] Rule: Any required expired -> `Inactive`.
- [ ] Update `Customer` model status automatically when a document status changes.
