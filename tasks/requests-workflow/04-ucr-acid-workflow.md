## Objective
Formalize the document collection process for UCR (Imports) and ACID (Exports/Transit), blocking the request workflow until the customer uploads the required document and the employee approves it.

## Current Implementation
The portal has a generic `MultiFileUploadZone` that uploads documents. However, these documents are not tied to a specific workflow gate (e.g., "We are waiting for your ACID document").

## Problem
Customers don't know *what* document is required or *when* they must upload it. The request doesn't halt to enforce document collection.

## Proposed Solution
1. Introduce a derived "Action Required" state. If `operationType === 'import'` and no approved UCR document exists, the status should indicate `document_required` (UI: "Please upload your UCR document").
2. When the customer uploads the document, it is assigned a `category` (e.g., `ucr` or `acid`) and linked to the `CustomerRequest` via `entityId`.
3. The request state becomes `document_under_review`.
4. The Admin portal gets a "Review Documents" section for the request. The employee approves the document and manually enters the obtained UCR/ACID reference number into the request details.
5. The request status moves forward.

## Files To Modify
- `app/[locale]/portal/requests/[id]/page.tsx`
- `app/[locale]/admin/requests/[id]/page.tsx`
- `app/api/portal/documents/route.ts`

## Acceptance Criteria
- [ ] UI prompts for specific document (UCR for import, ACID for export/transit).
- [ ] Customer upload links the document to the request.
- [ ] Employee can approve/reject the document.
- [ ] Employee can input the final UCR/ACID number.

## Dependencies
- `02-request-state-machine`
