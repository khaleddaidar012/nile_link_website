Status: COMPLETED

- [x] Task created
- [x] Implementation started
- [x] Implementation completed
- [x] Testing completed
- [x] Acceptance criteria verified
- [x] Task completed

# Task 07 — Final Dashboard Refinements & Communication

## Overview
This task ensures that the Customer and Employee dashboards accurately reflect the new multi-service architecture, and it integrates the existing messaging system to work at the Request/Service level.

## Requirements
- REQ-011: Integrate existing messaging/notes system to tie into the Request/Service level.
- REQ-019: Update Customer Dashboard to track overall Request and sub-services.
- REQ-020: Update Employee Dashboard filters and views.

## Current Implementation
### Existing
- Basic Dashboards exist.
- Basic messaging/notification models exist (`Notification.ts`, `DocumentActivityLog.ts`).

### Reusable
- Existing Dashboard Layouts.
- Existing Messaging/Notes UI components.

### Required Changes
- Modify Dashboard queries to aggregate data accurately.
- Ensure messages can be linked to a specific `CustomerRequest` or `RequestService`.

### Missing
- Aggregated data views for multi-service requests.

## Files / Modules Affected
- `app/(portal)/portal/dashboard/page.tsx`
- `app/(admin)/admin/dashboard/page.tsx`
- `app/api/portal/dashboard/route.ts`
- `app/api/admin/dashboard/route.ts`

## Data / Architecture Changes
- Dashboard aggregation logic (MongoDB aggregations) must be updated to account for the new models.

## UI / UX Changes
- Customer Dashboard: Show overall Request status, and expandable rows showing individual service statuses.
- Employee Dashboard: New filters (e.g., filter by specific service type across all requests).

## Implementation Plan
1. Update backend aggregation queries.
2. Update Frontend Dashboard UIs.
3. Integrate messaging system.

## Small Tasks
- [ ] Update Customer Dashboard API aggregations.
- [ ] Update Employee Dashboard API aggregations to include new filters.
- [ ] Update existing UI data tables to reflect multi-service data.
- [ ] Verify existing messaging backend can link to `CustomerRequest` and `RequestService` IDs.
- [ ] Update messaging UI to allow context-specific conversations.
- [ ] Add loading and error states.
- [ ] Verify existing functionality for regressions.

## Edge Cases
- Customers with a mix of legacy requests and new multi-service requests.
- Messaging on a cancelled service.

## Testing Checklist
- [ ] Normal flow
- [ ] Empty state
- [ ] Existing data
- [ ] API errors
- [ ] Mobile layout
- [ ] Desktop layout
- [ ] Authentication/permissions when applicable

## Acceptance Criteria
- Customer dashboard correctly displays both legacy requests and new multi-service requests.
- Messaging works correctly within the context of a request.
- Employee dashboard can filter operations correctly.

## Dependencies
Depends on:
- Task 01
- Task 03
- Task 04
- Task 05
- Task 06
