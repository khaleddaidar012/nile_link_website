Status: COMPLETED

- [x] Task created
- [x] Implementation started
- [x] Implementation completed
- [x] Testing completed
- [x] Acceptance criteria verified
- [x] Task completed

# Task 01 — Domain & Database Foundation

## Overview
This feature establishes the core database structures required for multi-service requests, quoting, and flexible pricing. It solves the limitation where a single request could only have one service type.

## Requirements
- REQ-001: Create `RequestService` model.
- REQ-002: Update `CustomerRequest` model.
- REQ-003: Create `PricingRule`, `Quote`, and `QuoteItem` models.
- REQ-004: Update `Document` model schema.

## Current Implementation

### Existing
- `CustomerRequest.ts` exists but uses a single string `serviceType` field.
- `Document.ts` exists and uses `entityType` and `entityId` for generic linking.

### Reusable
- Existing `Document` model polymorphism is reusable.

### Required Changes
- Extract service specifics from `CustomerRequest` into `RequestService`.
- Build new models for Quotes and Pricing.

### Missing
- `RequestService`, `PricingRule`, `Quote`, `QuoteItem`.

## Files / Modules Affected
- `lib/models/CustomerRequest.ts`
- `lib/models/Document.ts`
- `lib/models/RequestService.ts`
- `lib/models/PricingRule.ts`
- `lib/models/Quote.ts`
- `lib/models/QuoteItem.ts`

## Data / Architecture Changes
- `CustomerRequest` gets a `services` array (ObjectIds referring to `RequestService`).
- Legacy data compatibility: Ensure backward compatibility for requests with the old `serviceType` field if they exist.

## UI / UX Changes
- None (Backend only).

## Implementation Plan
1. Create new models.
2. Update existing models.
3. Add MongoDB indexes.

## Small Tasks
- [ ] Inspect `lib/models/CustomerRequest.ts` and `Document.ts`.
- [ ] Create `RequestService.ts` schema and export it.
- [ ] Create `PricingRule.ts` schema (fixed, route-based, manual).
- [ ] Create `Quote.ts` and `QuoteItem.ts` schemas.
- [ ] Update `CustomerRequest` to reference multiple `RequestService`s.
- [ ] Verify backward compatibility for `CustomerRequest`.

## Edge Cases
- Existing legacy requests missing the `services` array.

## Testing Checklist
- [ ] Normal flow (models compile and instantiate correctly).
- [ ] Existing data compatibility.
- [ ] Related feature regression.

## Acceptance Criteria
- Database compiles correctly.
- Legacy `CustomerRequest` models can still be read.
- New models successfully support the creation of linked Request -> Service -> Quote documents.

## Dependencies
Depends on:
- None
