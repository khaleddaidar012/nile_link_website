# Task 02 — Documents and UCR

## 1. Objective
Formalize the UCR/ACID compliance tracking and shipment documentation utilizing the existing infrastructure.

## 2. Current Implementation Analysis
- **Documents:** The system uses a centralized `Document` model that supports polymorphic attachments via `entityType` and `entityId`. Upload mechanisms, storage keys, and review queues (`pending_review`, `approved`) are already implemented.
- **UCR/ACID:** The fields `complianceType` (Enum: "UCR" | "ACID") and `complianceNumber` (String) were recently integrated into the `CustomerRequest` schema. 
- The Customer UI has a button to explicitly request the UCR/ACID.
- The Admin UI has a panel to provide this number, and it strictly blocks quotation generation until provided.

## 3. Gap Analysis
### Already Implemented
- UCR/ACID data structure, API updates, and quotation generation blockers.
- Core document upload and categorization mechanism.

### Missing
- Defining specific mandatory Document categories for Shipments (e.g., `commercial_invoice`, `packing_list`, `certificate_of_origin`).

## 4. Functional Requirements
- Ensure that the final/ongoing shipment documents can be attached directly to the `CustomerRequest` utilizing standard `Document` categories.
- (Optional Business Logic) Restrict progression to Customs Clearance until mandatory initial documents are marked as `approved`.

## 5. Technical Requirements
### Backend
- Extend the `DocumentCategory` type (or frontend select options) to include specific shipping document types.

## 6. Files To Reuse
- `lib/models/Document.ts`
- `app/api/portal/documents/route.ts`

## 7. Files To Create
None.

## 8. Files To Modify
- `messages/ar.json` & `messages/en.json` (to add translations for the new document categories).

## 9. Dependencies
- Depends on Epic 01.

## 10. Subtasks
### 10.1 Extend Categories
- [ ] Update frontend document upload components to include specific `shipping_document`, `commercial_invoice`, `packing_list` categories if not already present.
- [ ] Add translation keys for these new categories.

## 11. Business Rules
- UCR/ACID is immutable once generated for the quote process, unless a strict reset protocol is requested.
