## Objective
Redesign the customer-facing request details page (`/portal/requests/[id]`) to act as an actionable workflow dashboard rather than a static summary.

## Current Implementation
The page currently displays a static list of requested services, a timeline, and a generic file upload zone. It is difficult to know what the current overarching status is and what is required next.

## Problem
Customers have to guess their next step.

## Proposed Solution
Restructure the page into clear, hierarchical components:
1. **Request Header**: Status Badge + Request Number + Core Details.
2. **Action Required Card**: A highly visible alert-style card (e.g., "Quotation Ready -> Review Now" or "Document Required -> Upload UCR").
3. **Quotation Section**: Display the itemized quotation breakdown when available.
4. **Documents Section**: Display required vs. uploaded documents.
5. **Timeline**: Keep the existing timeline for historical context.

## Files To Modify
- `app/[locale]/portal/requests/[id]/page.tsx`
- Create new components in `components/portal/requests/` (e.g., `ActionRequiredCard.tsx`, `QuotationCard.tsx`).

## Acceptance Criteria
- [ ] UI cleanly separates Action Required from History.
- [ ] Responsive and follows the existing design system.
- [ ] Friendly localized terminology used everywhere.

## Dependencies
- `02-request-state-machine`
- `03-quotation-workflow`
- `04-ucr-acid-workflow`
