## Objective
Define a clear, consistent state machine for `CustomerRequest.status` and how it maps to customer-friendly UI terminology.

## Current Implementation
The `CustomerRequest` schema defines `status` as a flexible string (`RequestStatus`), defaulting to `submitted`. Different services have dynamic statuses, leading to fragmentation and confusing raw keys like `portal.requests.status_quote_provided`.

## Problem
No centralized source of truth for the primary request state. The customer cannot easily trace the high-level progress of the request.

## Proposed Solution
Define a strict set of high-level statuses for the request lifecycle, decoupling internal states from the UI representation.

**Proposed High-Level States:**
1. `submitted` -> UI: "Under Review"
2. `document_required` -> UI: "Action Required" (e.g., waiting for UCR/ACID document)
3. `document_under_review` -> UI: "Document Under Review"
4. `quote_pending` -> UI: "Preparing Quotation"
5. `quote_provided` -> UI: "Quotation Ready"
6. `quote_accepted` -> UI: "Quotation Accepted"
7. `processing` -> UI: "Processing"
8. `completed` -> UI: "Completed"
9. `cancelled` -> UI: "Cancelled"

## Files To Modify
- `lib/models/CustomerRequest.ts`
- `app/[locale]/portal/requests/[id]/page.tsx`
- Translation files (`messages/ar.json`, `messages/en.json`)

## Backend Changes
- Enforce the new high-level statuses in `CustomerRequest` controllers.

## UI/UX Changes
- Build a generic `RequestStatusBadge` component that maps these internal keys to friendly translations and corresponding colors.

## Acceptance Criteria
- [ ] High-level statuses defined and documented.
- [ ] Backend controllers updated to use consistent status strings.
- [ ] UI correctly maps internal statuses to friendly localized strings.

## Dependencies
- `01-project-analysis`
