Status: COMPLETED

- [x] Task created
- [x] Implementation started
- [x] Implementation completed
- [x] Testing completed
- [x] Acceptance criteria verified
- [x] Task completed

# Task 06 — Bookings / Operational Services

## Overview
Once a quote is accepted by a customer, the related services transition from pending review into active operational state ("Bookings"). This task focuses on that transition and the Employee Operations UI to manage individual service statuses.

## Requirements
- REQ-017: Implement logic to lock in `RequestService` as an active "Booking" upon Quote acceptance.
- REQ-018: Build Employee Operations UI to manage individual service statuses independently.

## Current Implementation
### Existing
- None for independent service management in this new architecture.

### Reusable
- Existing Data Tables.
- Existing `ServiceConfig` which contains the dynamic statuses for a given service.

### Required Changes
- Trigger a state change when a Quote is accepted.
- Build an Employee dashboard view for active operations.

### Missing
- Operations Dashboard UI.
- Service status update API.

## Files / Modules Affected
- `app/api/admin/services/[id]/status/route.ts`
- `app/(admin)/admin/operations/page.tsx`

## Data / Architecture Changes
- Update `RequestService` status.
- Insert a record into the `timeline` array of `RequestService`.

## UI / UX Changes
- New Employee UI: Operations Kanban board or Table to manage active services.
- Modal/Form to update status, which reads allowed statuses from `ServiceConfig`.

## Implementation Plan
1. Hook into Quote Acceptance API to update service statuses.
2. Build Employee Operations UI.
3. Build API to update service statuses individually.

## Small Tasks
- [ ] Update `POST /api/portal/quotes/[id]/accept` to update associated `RequestService`s to an active status.
- [ ] Build `app/(admin)/admin/operations/page.tsx` displaying all active `RequestService`s.
- [ ] Create `PUT /api/admin/services/[id]/status` to allow status updates.
- [ ] Build a modal to change service status, pulling available options from `ServiceConfig`.
- [ ] Ensure status updates write to the `timeline` history.
- [ ] Add loading and error states.
- [ ] Verify existing functionality for regressions.

## Edge Cases
- Updating a status to a terminal state (Completed, Cancelled).
- Attempting to update a service linked to an unaccepted quote.

## Testing Checklist
- [ ] Normal flow
- [ ] Invalid input
- [ ] API errors
- [ ] Mobile layout
- [ ] Desktop layout
- [ ] Authentication/permissions when applicable

## Acceptance Criteria
- Accepted quotes successfully transition their services to active bookings.
- Employees can update statuses for individual services independent of the overall request.
- Status history is maintained.

## Dependencies
Depends on:
- Task 01
- Task 05
