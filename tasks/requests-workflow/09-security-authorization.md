## Objective
Ensure the new workflow features strictly enforce data boundaries so customers cannot access or mutate unauthorized requests, quotes, or documents.

## Current Implementation
The application uses session-based auth (likely NextAuth or similar) and verifies `customerId`.

## Problem
Adding new routes (e.g., `POST /api/portal/quotes/[id]/action` or passing `entityId` to documents) introduces vulnerabilities if ownership isn't validated.

## Proposed Solution
In every portal API route dealing with Requests, Quotes, or Documents:
1. Extract `customerId` from the session.
2. Query the resource using `{ _id: resourceId, customerId: session.customerId }`.
3. If not found, return 404 or 403.

## Files To Modify
- All new/modified `app/api/portal/**/route.ts` files.

## Acceptance Criteria
- [ ] Attempting to accept a quote belonging to another customer fails.
- [ ] Attempting to upload a document to another customer's request fails.

## Dependencies
- All preceding API tasks.
