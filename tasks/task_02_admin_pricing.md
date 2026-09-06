Status: COMPLETED

- [x] Task created
- [x] Implementation started
- [x] Implementation completed
- [x] Testing completed
- [x] Acceptance criteria verified
- [x] Task completed

# Task 02 — Admin Pricing Management

## Overview
This feature allows Admin users to configure base prices for various services (fixed, route-based, or manual).

## Requirements
- REQ-005: Build API routes for CRUD operations on `PricingRule`.
- REQ-006: Build Admin UI dashboard for managing pricing rules.

## Current Implementation
### Existing
- Basic Admin portal layout may exist.

### Reusable
- Admin portal layouts and authentication components.

### Required Changes
- Add new APIs and pages for pricing.

### Missing
- APIs for `PricingRule`.
- Admin Pricing UI.

## Files / Modules Affected
- `app/api/admin/pricing-rules/route.ts` (To Be Determined)
- `app/api/admin/pricing-rules/[id]/route.ts` (To Be Determined)
- `app/(admin)/admin/pricing/page.tsx` (To Be Determined)

## Data / Architecture Changes
- No database changes required here, relies on Task 01.

## UI / UX Changes
- New Admin page to list, create, and edit pricing rules.
- Forms with validation for different pricing types.

## Implementation Plan
1. Create API endpoints for `PricingRule`.
2. Build frontend data table to list rules.
3. Build forms to create/edit rules.

## Small Tasks
- [ ] Create `GET /api/admin/pricing-rules`.
- [ ] Create `POST /api/admin/pricing-rules`.
- [ ] Create `PUT /api/admin/pricing-rules/[id]`.
- [ ] Create `DELETE /api/admin/pricing-rules/[id]`.
- [ ] Build the Admin Pricing page UI.
- [ ] Build the create/edit form with react-hook-form.
- [ ] Hook UI to API with loading and error states.
- [ ] Verify existing functionality for regressions.

## Edge Cases
- Invalid route info.
- Negative pricing.
- Modifying a price that is already linked to an active quote.

## Testing Checklist
- [ ] Normal flow
- [ ] Empty state
- [ ] Invalid input
- [ ] Duplicate operations
- [ ] Existing data
- [ ] API errors
- [ ] Persistence
- [ ] Mobile layout
- [ ] Desktop layout
- [ ] Authentication/permissions when applicable

## Acceptance Criteria
- Admins can create and edit pricing rules.
- The UI reflects the correct pricing rules from the database.

## Dependencies
Depends on:
- Task 01
