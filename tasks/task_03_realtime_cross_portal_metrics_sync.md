# Task 03 — Real-Time Cross-Portal Metric Synchronization

## Overview

Ensures that whenever a staff member approves, rejects, or adjusts a document, the resulting counters (`approvedDocs`, `pendingDocs`, `expiringDocs`, `accountStatus`) update immediately across both the Staff Customer Management views (`/admin/customers`) and the Customer Portal dashboard (`/portal`, `/api/auth/me`).

---

## Requirements

- **REQ-03**: `3- لو وافقت او رفضت ملف يسمع في صفحة حساب العميل عند الموظف الارقام يعني وفي صفحة العميل` (Document approval or rejection must immediately reflect on customer account metrics for both staff and client).

---

## Current Implementation

- In [app/api/auth/me/route.ts](file:///d:/khaled/nile_link_website-main/app/api/auth/me/route.ts):
  - Document counts query `user.customerId`. If `customerId` was created on the fly or detached, queries can be out of sync.
- In [components/admin/customers/CustomerOverviewTable.tsx](file:///d:/khaled/nile_link_website-main/components/admin/customers/CustomerOverviewTable.tsx) and [CustomerDetailDrawer.tsx](file:///d:/khaled/nile_link_website-main/components/admin/customers/CustomerDetailDrawer.tsx):
  - When `DocumentReviewModal` triggers `onSuccess`, the customer list refetches, but the active customer drawer counters do not always re-render the refreshed metrics immediately without a full page reload.
- In [components/portal/PortalContext.tsx](file:///d:/khaled/nile_link_website-main/components/portal/PortalContext.tsx):
  - `refreshData()` must be invoked whenever document status changes occur so that dashboard ratios (`5 / 10`, `8 / 10`) immediately recalculate.

---

## Files / Modules Affected

- [app/api/auth/me/route.ts](file:///d:/khaled/nile_link_website-main/app/api/auth/me/route.ts)
- [app/api/admin/customers/route.ts](file:///d:/khaled/nile_link_website-main/app/api/admin/customers/route.ts)
- [components/admin/customers/CustomerOverviewTable.tsx](file:///d:/khaled/nile_link_website-main/components/admin/customers/CustomerOverviewTable.tsx)
- [components/admin/customers/CustomerDetailDrawer.tsx](file:///d:/khaled/nile_link_website-main/components/admin/customers/CustomerDetailDrawer.tsx)
- [components/portal/PortalContext.tsx](file:///d:/khaled/nile_link_website-main/components/portal/PortalContext.tsx)
- [components/portal/DashboardMetricsCards.tsx](file:///d:/khaled/nile_link_website-main/components/portal/DashboardMetricsCards.tsx)

---

## Data / Architecture Changes

- Ensure `recalculateCustomerAccountStatus` recalculates and saves `customer.accountStatus` and `customer.statusReason` in the database immediately upon document review.
- In `app/api/auth/me/route.ts`, bind the aggregation queries to the resolved `customerId` variable rather than the raw in-memory `user.customerId`.

---

## UI / UX Changes

- When staff approves a document in `DocumentReviewModal`:
  - `onSuccess` triggers both `fetchCustomers()` and `fetchCustomerDetails(selectedCustomerId)`.
  - The drawer's compliance pills and document badge counts update smoothly with animated counter transitions.
- In the Customer Portal:
  - On navigation or window focus, `PortalContext` silently refreshes `/api/auth/me` to update ratios without requiring the user to hard-refresh.

---

## Implementation Plan

1. In [app/api/auth/me/route.ts](file:///d:/khaled/nile_link_website-main/app/api/auth/me/route.ts):
   - Fix lines 48–76 to query using `customerId` (the resolved `Types.ObjectId`).
2. In [components/admin/customers/CustomerDetailDrawer.tsx](file:///d:/khaled/nile_link_website-main/components/admin/customers/CustomerDetailDrawer.tsx):
   - Expose a `refreshCustomerDetails` callback to the parent table and review modal.
3. In [components/admin/customers/CustomerOverviewTable.tsx](file:///d:/khaled/nile_link_website-main/components/admin/customers/CustomerOverviewTable.tsx):
   - Pass the refresh handler to `DocumentReviewModal.onSuccess`.
4. In [components/portal/PortalContext.tsx](file:///d:/khaled/nile_link_website-main/components/portal/PortalContext.tsx):
   - Add focus/visibility event listener to refresh stats when returning to the portal tab.

---

## Small Tasks

- [x] Inspect `app/api/auth/me/route.ts` document count query bindings.
- [x] Ensure `customerId` is consistently passed as `Types.ObjectId` across all count queries.
- [x] Add reactive state refresh in `CustomerDetailDrawer.tsx`.
- [x] Connect `DocumentReviewModal.onSuccess` to invalidate cached customer drawer data.
- [x] Verify that approving a pending document decreases pending count by 1 and increases approved count by 1 on staff screen.
- [x] Verify that approving a pending document updates client dashboard ratio (e.g. `0 / 1` -> `1 / 1`).
- [x] Verify that rejecting a document updates status and flags compliance warnings.

---

## Edge Cases

- **Multiple Tabs Open**: If a client is on `/portal` and staff approves their document in another tab, focus listeners trigger an automatic background fetch to show updated ratios.

---

## Testing Checklist

- [x] Staff approves a document -> Staff customer list shows updated counts immediately.
- [x] Staff customer drawer shows updated status badge immediately.
- [x] Client portal reflects the updated ratio immediately.
- [x] Staff rejects a document -> Client portal displays updated review status and warning banners.

---

## Acceptance Criteria

- Document approvals and rejections reflect in real-time across both staff management views and client portal metrics without requiring manual page reload.

---

## Dependencies

- [Task 01 — Document Review Engine Resilience & Error 500 Fixes](file:///d:/khaled/nile_link_website-main/tasks/task_01_document_review_resilience_and_error_fixes.md)
- [Task 02 — Live Document Viewer & In-Modal Date Adjustment Engine](file:///d:/khaled/nile_link_website-main/tasks/task_02_live_document_viewer_and_date_adjustment.md)

---

## AI_MAP Impact

- `AI_MAP/08_BUSINESS_LOGIC.md`
- `AI_MAP/07_FEATURES.md`
