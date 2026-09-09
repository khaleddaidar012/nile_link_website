## Objective
Make the Quotation a first-class feature of the Customer Request portal. The customer must be able to view, approve, or reject the quotation explicitly.

## Current Implementation
Quotations are generated on the backend (Admin) side and stored in the `Quote` model. The frontend portal attempts to render quote details by looking at `request.details.quote`, which is legacy. The proper `Quote` data is not fetched or displayed interactively for the customer.

## Problem
Customers cannot clearly see the quotation breakdown, nor can they explicitly Accept/Reject the quotation. The quotation appears as a passive timeline event instead of an interactive business document.

## Proposed Solution
1. **API**: Create an endpoint `GET /api/portal/requests/[id]/quotes` to fetch the associated active `Quote` and its `QuoteItem` breakdown.
2. **UI**: Add a dedicated "Quotation & Offer" section to the customer request page `app/[locale]/portal/requests/[id]/page.tsx`.
3. **Actions**: Add "Accept Quotation" and "Reject/Clarify" buttons.
4. **Backend Action**: Create `POST /api/portal/quotes/[id]/action` to handle customer approval, which will change the quote status to `accepted` and update the `CustomerRequest` status to `quote_accepted`.

## Files To Modify
- `app/api/portal/quotes/route.ts` (New/Modify)
- `app/api/portal/quotes/[id]/action/route.ts` (New)
- `app/[locale]/portal/requests/[id]/page.tsx`
- `messages/ar.json`, `messages/en.json`

## Acceptance Criteria
- [ ] Customer can see the full quotation breakdown.
- [ ] Customer can accept or reject the quotation.
- [ ] Status updates properly across `Quote` and `CustomerRequest`.
- [ ] Timeline event is recorded for the quotation action.

## Dependencies
- `02-request-state-machine`
