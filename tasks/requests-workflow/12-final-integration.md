## Objective
Deploy and verify the system in its entirety, cleaning up any legacy status fields or unused components.

## Proposed Solution
- Remove legacy rendering paths in `app/[locale]/portal/requests/[id]/page.tsx` that relied on `request.details.quote` if they are fully superseded by the new `GET /api/portal/quotes` logic.
- Ensure the admin quote generator (`app/[locale]/admin/requests/[id]/quote/page.tsx`) correctly transitions the request state so the customer sees the new quote.

## Dependencies
- `11-testing`
