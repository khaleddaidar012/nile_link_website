# Task 01 — Document Review Engine Resilience & Error 500 Fixes

## Overview

Fixes the server-side HTTP 500 crashes and validation exceptions encountered during staff document review and rejection actions in `app/api/admin/documents/[id]/verify/route.ts`. Ensures rock-solid document state transitions, robust notification creation, and safe account health status recalculation.

---

## Requirements

- **REQ-04**: `4- خطا ايروور 500 اثناء توثيق مستند` (HTTP 500 error during document verification/approval).
- **REQ-05**: `5- خطا اثناء رفض مستند` (Error during document rejection).

---

## Current Implementation

In [app/api/admin/documents/[id]/verify/route.ts](file:///d:/khaled/nile_link_website-main/app/api/admin/documents/%5Bid%5D/verify/route.ts):
- Document review handles approval (`status === "approved"`) and rejection (`status === "rejected"`).
- When a document is updated:
  1. `document.save()` runs.
  2. `logDocumentActivity({...})` runs.
  3. `recalculateCustomerAccountStatus(document.customerId, session.userId)` runs.
  4. `Notification.create({...})` runs.
- **Root Causes of Crashes**:
  - If `document.customerId` is null, unpopulated, or string-based, `Customer.findById` in `account-health-engine.ts` throws a CastError, triggering an unhandled catch block that returns 500.
  - In `Notification.create`, `recipientCustomerId` is required as an ObjectId; if `document.customerId` is missing, Mongoose validation crashes with 500.
  - When rejecting, if `rejectionReason` contains an empty string or unhandled payload, the endpoint returns a raw validation error or crashes without clear diagnostics.

---

## Files / Modules Affected

- [app/api/admin/documents/[id]/verify/route.ts](file:///d:/khaled/nile_link_website-main/app/api/admin/documents/%5Bid%5D/verify/route.ts)
- [lib/engine/account-health-engine.ts](file:///d:/khaled/nile_link_website-main/lib/engine/account-health-engine.ts)
- [components/admin/review/DocumentReviewModal.tsx](file:///d:/khaled/nile_link_website-main/components/admin/review/DocumentReviewModal.tsx)
- [lib/models/Notification.ts](file:///d:/khaled/nile_link_website-main/lib/models/Notification.ts)

---

## Data / Architecture Changes

- Add defensive guards in `app/api/admin/documents/[id]/verify/route.ts`:
  - Validate that `document.customerId` exists before invoking `recalculateCustomerAccountStatus` and `Notification.create`.
  - Wrap side-effects (activity log, account health recalculation, notification dispatch) in a resilient `try/catch` so that an auxiliary failure never blocks the primary document status persistence.
- Sanitize and standardize `rejectionReason` input: allow standard keys as well as custom strings, trimming empty values and defaulting to a localized fallback.

---

## UI / UX Changes

- In `DocumentReviewModal.tsx`, display clear, user-friendly error banners if a network or server validation issue occurs instead of generic "Verification failed".
- Ensure the rejection reason selector requires an option before enabling the submit action.

---

## Implementation Plan

1. In [app/api/admin/documents/[id]/verify/route.ts](file:///d:/khaled/nile_link_website-main/app/api/admin/documents/%5Bid%5D/verify/route.ts):
   - Add ObjectId validation on `id`.
   - Ensure `document.customerId` fallback to `uploadedBy.customerId` if document model lacks direct reference.
   - Wrap `logDocumentActivity`, `recalculateCustomerAccountStatus`, and `Notification.create` in a safe non-blocking execution block.
2. In [lib/engine/account-health-engine.ts](file:///d:/khaled/nile_link_website-main/lib/engine/account-health-engine.ts):
   - Add `if (!customerId) return { status: "inactive", reason: "No customer ID provided" }`.
   - Prevent null pointer exceptions when customer has 0 documents or missing fields.
3. In [components/admin/review/DocumentReviewModal.tsx](file:///d:/khaled/nile_link_website-main/components/admin/review/DocumentReviewModal.tsx):
   - Pass trimmed parameters, ensure `rejectionReason` is never empty when `status === "rejected"`.

---

## Small Tasks

- [x] Inspect `app/api/admin/documents/[id]/verify/route.ts` error handling and side-effect calls.
- [x] Add customerId existence and ObjectId format guards.
- [x] Guard `Notification.create` to ensure `recipientCustomerId` is valid before dispatching.
- [x] Update `account-health-engine.ts` with null-safety checks.
- [x] Verify approval flow returns 200 with updated document state.
- [x] Verify rejection flow returns 200 with persisted rejection reason.
- [x] Test edge case: reviewing a document with detached customer ID.

---

## Edge Cases

- **Detached Document**: Uploaded file with missing or deleted customer reference must still update document status without crashing account health engine.
- **Empty Rejection Reason**: Prevent submit button click when rejection reason dropdown is empty.

---

## Testing Checklist

- [ ] `POST /api/admin/documents/[id]/verify` with `status: "approved"` returns 200.
- [ ] `POST /api/admin/documents/[id]/verify` with `status: "rejected"` returns 200.
- [ ] Account status updates to `inactive` or `warning` upon rejection.
- [ ] Account status updates to `active` upon full approval.

---

## Acceptance Criteria

- Staff document approval completes with HTTP 200 and never returns HTTP 500.
- Staff document rejection completes with HTTP 200 and records the rejection reason.

---

## Dependencies

- None

---

## AI_MAP Impact

- `AI_MAP/06_API.md`
- `AI_MAP/08_BUSINESS_LOGIC.md`
