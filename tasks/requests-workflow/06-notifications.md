## Objective
Ensure notifications route the customer directly to the relevant action or section within the Request portal.

## Current Implementation
The `Notification` model exists and tracks `relatedRequestId` and `actionUrl`. However, notifications are generated passively (e.g. `request_update`) and the frontend does not heavily utilize `actionUrl` to scroll to specific sections or trigger modals.

## Problem
A notification says "Quote Provided" but when clicked, the customer lands on a generic request page and has to figure out where the quote is.

## Proposed Solution
1. Update backend endpoints (like `/api/admin/quotes`) to inject a robust `actionUrl` such as `/portal/requests/[id]?action=view_quote`.
2. Update the frontend `CustomerPortal` to parse the `action` query parameter and automatically scroll to the Quotation card or highlight the Action Required section.
3. Localize notification titles and bodies dynamically on the frontend instead of hardcoding Arabic/English strings into the database at creation time.

## Files To Modify
- `lib/models/Notification.ts` (if enum updates are needed)
- `app/api/admin/quotes/route.ts` (and other endpoints emitting notifications)
- `app/[locale]/portal/requests/[id]/page.tsx`
- `components/portal/notifications/` (if any component renders notifications)

## Acceptance Criteria
- [ ] Notifications have precise action URLs.
- [ ] Clicking a notification brings the user exactly to what they need to see.
- [ ] Notification strings are passed through `next-intl` rather than hardcoded in DB.

## Dependencies
- `05-customer-portal`
