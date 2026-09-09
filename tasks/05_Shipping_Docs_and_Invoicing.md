# Task 05 — Shipping Documents & Invoicing

## 1. Objective
Establish the final release stages of a shipment where final documents are generated and invoicing gates the final completion status.

## 2. Current Implementation Analysis
- **Documents:** The system handles polymorphic document uploads.
- **Invoicing:** The `Invoice` and `Payment` models exist, but the deep workflow integration is currently stubbed/incomplete.
- **Status:** The `CustomerRequest` status transitions from `processing` to `completed`.

## 3. Gap Analysis
### Missing
- The intermediate status representing "Shipment done, waiting for documentation / financials".
- An API to officially mark a shipment as "Ready for Final Documents".

## 4. Functional Requirements
- After Customs Clearance and Freight Arrival, the status should transition to `pending_documents`.
- Once final shipping documents (e.g., Final BoL, Customs Release Certificate) are uploaded and approved, the status transitions to `pending_invoicing`.
- (Because Invoicing is stubbed) We will halt the fully-automated workflow at `pending_invoicing` and require a manual Admin override to transition to `completed` for now.

## 5. Technical Requirements
### Backend
- Add `pending_documents` and `pending_invoicing` to the `CustomerRequest.status` enum list.
- Modify the completion APIs to respect these gates.

### Frontend
- Add UI indicators for these states.

## 6. Files To Reuse
- `lib/models/CustomerRequest.ts`
- `app/[locale]/admin/requests/[id]/page.tsx`

## 7. Files To Create
None.

## 8. Files To Modify
- `lib/models/CustomerRequest.ts`
- `messages/ar.json` (Translation keys).

## 9. Dependencies
- Depends on Epic 04.
- High dependency on future Financials Module.

## 10. Subtasks
### 10.1 Status Enum Update
- [ ] Add `pending_documents` and `pending_invoicing` to `CustomerRequest` model schema.
- [ ] Add i18n translations.

### 10.2 Workflow APIs
- [ ] Create an Admin endpoint `POST /api/admin/requests/[id]/status` to manually progress the request through these final gates until the invoicing system is automated.

## 11. Business Rules
- A shipment **cannot** be marked as `completed` unless the financial obligations (Invoices) are cleared. Since invoicing is stubbed, we enforce a strict `pending_invoicing` state as the endpoint of this specific shipping workflow.
