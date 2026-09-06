Status: NOT_STARTED — **التالي في الانتظار**

- [ ] Task created — يبدأ بعد إغلاق Task 04
- [ ] Implementation started
- [ ] Implementation completed
- [ ] Testing completed
- [ ] Acceptance criteria verified
- [ ] Task completed

# Task 05 — Quotes Workflow

## Overview
This feature allows employees to take the suggested prices, adjust them, and send a unified Quote to the customer for approval.

## Requirements
- REQ-014: Build Employee UI to adjust prices and issue a `Quote`.
- REQ-015: Build API endpoints for Customer Quote Accept/Reject.
- REQ-016: Build Customer UI to view and interact with Quotes.

## Current Implementation
### Existing
- None for Quote management.

### Reusable
- Notification/Email service to alert the customer when a quote is ready.

### Required Changes
- Backend APIs for Quote generation and state transition.
- UIs for both Employee and Customer.

### Missing
- Quote UI and APIs.

## Files / Modules Affected
- `app/api/admin/quotes/route.ts`
- `app/api/portal/quotes/[id]/accept/route.ts`
- `app/api/portal/quotes/[id]/reject/route.ts`
- `app/(admin)/admin/requests/[id]/quote/page.tsx`
- `app/(portal)/portal/quotes/[id]/page.tsx`

## Data / Architecture Changes
- Writes to `Quote` and `QuoteItem` models.
- Includes an audit trail of who changed the price and why.

## UI / UX Changes
- Employee: Form to modify base price, add discounts, or add extra charges.
- Customer: View quote summary with "Accept" and "Reject" buttons.

## Implementation Plan
1. Build Quote generation API.
2. Build Employee Quote UI.
3. Build Customer Quote View UI and Accept/Reject APIs.

## Small Tasks
- [ ] Create `POST /api/admin/quotes` to generate a Quote.
- [ ] Update API validation.
- [ ] Build Employee UI to review/adjust pricing and submit a Quote.
- [ ] Create `POST /api/portal/quotes/[id]/accept` and `reject`.
- [ ] Build Customer UI to view Quote and accept/reject it.
- [ ] Integrate email notifications when Quote is generated.
- [ ] Add required validation.
- [ ] Add loading and error states.
- [ ] Verify existing functionality for regressions.

## Edge Cases
- Employee sets a negative total price.
- Customer tries to accept an already rejected quote.
- Customer tries to accept an expired quote.

## Testing Checklist
- [ ] Normal flow
- [ ] Invalid input
- [ ] Duplicate operations
- [ ] API errors
- [ ] Persistence
- [ ] Mobile layout
- [ ] Desktop layout
- [ ] Authentication/permissions when applicable

## Acceptance Criteria
- Employee can successfully issue a quote with adjusted pricing.
- Customer can accept or reject the quote.
- Audit history of pricing changes is preserved.

## Dependencies
Depends on:
- Task 01
- Task 03
- Task 04
