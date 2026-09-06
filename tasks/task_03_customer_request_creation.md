Status: COMPLETED

- [x] Task created
- [x] Implementation started
- [x] Implementation completed
- [x] Testing completed
- [x] Acceptance criteria verified
- [x] Task completed

# Task 03 — Customer Request Creation (Service Selection)

## Overview
This feature revamps the customer request submission flow. Customers will now see services as selectable cards and can choose multiple services for a single request. 

## Requirements
- REQ-007: Build UI components for visual Service Cards selection.
- REQ-008: Implement dynamic form rendering based on selected services.
- REQ-009: Update request submission API to handle multiple services.
- REQ-010: Update Document Upload UI to support multiple service requirements.

## Current Implementation
### Existing
- Existing `POST /api/portal/requests` expects a single `serviceType`.
- Existing request creation page uses a single form.

### Reusable
- Existing form inputs and validation schemas.
- Existing `ServiceConfig` which dictates what fields/documents are required per service.

### Required Changes
- Transform the creation page into a wizard or multi-step form supporting multiple service states.
- API must be updated to insert a `CustomerRequest` and multiple `RequestService` entries transactionally.

### Missing
- Visual Service Cards component.

## Files / Modules Affected
- `app/(portal)/portal/requests/new/page.tsx`
- `app/api/portal/requests/route.ts`

## Data / Architecture Changes
- API transaction logic to create `CustomerRequest` and its associated `RequestService` children.

## UI / UX Changes
- Step 1: Select multiple Service Cards.
- Step 2: Fill out dynamic fields for each selected service.
- Step 3: Upload required documents for all selected services.

## Implementation Plan
1. Update API first to accept the new payload structure.
2. Build the visual Service Cards UI.
3. Build the dynamic form builder.
4. Integrate the existing document upload to handle the aggregated required documents.

## Small Tasks
- [ ] Update `POST /api/portal/requests` to handle an array of services.
- [ ] Create transaction logic to insert `CustomerRequest` and `RequestService`s.
- [ ] Build the `ServiceSelectionCards` UI component.
- [ ] Build a dynamic form engine that renders fields based on selected services.
- [ ] Update the Document Upload step to combine requirements from `ServiceConfig`.
- [ ] Add loading and error states.
- [ ] Verify existing functionality for regressions.

## Edge Cases
- Customer selects zero services.
- Network failure during submission (handle transaction rollback).
- Document upload fails.

## Testing Checklist
- [ ] Normal flow
- [ ] Empty state
- [ ] Invalid input
- [ ] API errors
- [ ] Persistence
- [ ] Mobile layout
- [ ] Desktop layout
- [ ] Related feature regression

## Acceptance Criteria
- Customer can select multiple services.
- API successfully creates multiple `RequestService` records linked to one `CustomerRequest`.
- Document requirements are properly aggregated.

## Dependencies
Depends on:
- Task 01
