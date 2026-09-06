Status: IN_PROGRESS

- [x] Task created
- [x] Implementation started
- [x] Implementation completed
- [ ] Testing completed (بيانات قديمة ناقصة serviceKey/status)
- [ ] Acceptance criteria verified
- [ ] Task completed

### ما تم إنجازه:
- [x] Admin Request Detail page مترجمة بالكامل AR/EN
- [x] Admin Sidebar مترجم بالكامل
- [x] إصلاح crash: `service.serviceKey` undefined
- [x] إصلاح crash: `priceMatch` undefined
- [x] إصلاح `portal.requests.status_undefined` display
- [x] ترجمة أسماء الخدمات باستخدام مفاتيح `portal.requests.new.*`

### ما تبقى:
- [ ] اختبار مع بيانات جديدة (الطلبات القديمة تفتقر لـ serviceKey)

# Task 04 — Employee Request Review & Pricing Engine

## Overview
Employees need an interface to review incoming multi-service requests and a backend engine to calculate default pricing based on the configured rules.

## Requirements
- REQ-012: Build Employee UI to view incoming Requests and nested Services.
- REQ-013: Implement Pricing Engine backend logic to calculate default prices based on `PricingRule`.

## Current Implementation
### Existing
- Employee dashboard may list requests, but only expects single services.

### Reusable
- Existing Data Table components.

### Required Changes
- Update the request detail view for employees to show all nested services.
- Implement the pricing calculation logic in the backend.

### Missing
- Pricing Engine service.

## Files / Modules Affected
- `app/(admin)/admin/requests/[id]/page.tsx`
- `lib/services/PricingEngine.ts` (To Be Determined)
- `app/api/admin/requests/[id]/price/route.ts` (To Be Determined)

## Data / Architecture Changes
- Create a PricingEngine service that takes a `RequestService` and matches it against active `PricingRule`s to return a suggested price.

## UI / UX Changes
- Employee Request Detail view shows a card for the overall request, and individual cards for each service.

## Implementation Plan
1. Build the PricingEngine utility.
2. Build API to expose the calculated price to the frontend.
3. Update the Employee Request Review UI to display nested services and suggested prices.

## Small Tasks
- [ ] Create `lib/services/PricingEngine.ts`.
- [ ] Implement logic to match fixed and route-based rules.
- [ ] Create API endpoint to expose calculated prices.
- [ ] Update the Employee Request details page to fetch and render nested `RequestService`s.
- [ ] Add loading and error states.
- [ ] Verify existing functionality for regressions.

## Edge Cases
- No pricing rule found (fallback to manual quoting).
- Corrupt route data.

## Testing Checklist
- [ ] Normal flow
- [ ] Empty state
- [ ] Invalid input
- [ ] API errors
- [ ] Mobile layout
- [ ] Desktop layout
- [ ] Authentication/permissions when applicable

## Acceptance Criteria
- Employee can see all services within a request.
- The system accurately suggests a price based on existing rules.

## Dependencies
Depends on:
- Task 01
- Task 02
- Task 03
