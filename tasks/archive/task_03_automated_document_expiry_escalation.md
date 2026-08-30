# Task 03 — Multi-Tier Document Expiry Tracking & Automated Client Alert Escalation (30, 20, 10, 5 Days)

## Overview

- **What this feature does**: Automatically monitors the expiration dates of all approved customer legal documents and dispatches progressive, multi-tier notification alerts to customers as their documents approach expiration (at 30 days, 20 days, 10 days, and 5 days remaining).
- **What problem it solves**: Fulfills Requirement 3 of `needs.md`: guarantees that clients are proactively warned well ahead of document expirations to prevent customs clearance halts or regulatory compliance blocks.
- **Why it is needed**: In maritime shipping and Egyptian customs clearance (Nafeza / MTS), expired tax cards or commercial registrations result in immediate port container detention and severe demurrage fines.
- **How it fits into the existing system**: Leverages `Document.expiryDate` and `Notification` models, introduces an automated cron/trigger engine (`/api/cron/check-expiries`), and connects with the staff Notification Center (`/admin/notifications`).

---

## Requirements

1. **Multi-Tier Progressive Notification Logic**:
   - **Tier 1 — 30 Days Warning**:
     - Triggered when `20 < daysRemaining <= 30`.
     - Alert Type: Gentle advisory reminder to begin renewal procedures.
   - **Tier 2 — 20 Days Urgent**:
     - Triggered when `10 < daysRemaining <= 20`.
     - Alert Type: Urgent reminder highlighting potential shipment delays.
   - **Tier 3 — 10 Days Critical**:
     - Triggered when `5 < daysRemaining <= 10`.
     - Alert Type: High-priority alert with direct renewal upload link.
   - **Tier 4 — 5 Days Imminent**:
     - Triggered when `0 <= daysRemaining <= 5`.
     - Alert Type: Critical imminent warning stating account service restriction will occur upon expiration.
   - **Tier 5 — Expired (<= 0 Days)**:
     - Document status automatically flags as `expired` and customer account status sets to `warning`/`restricted`.
2. **De-duplication & Cooldown Control**:
   - Ensures each notification tier is triggered at most once per document cycle to avoid spamming the customer.
   - Updates `Document.warningEscalationTier` and `Document.lastNotificationSentAt`.
3. **Automated & Manual Execution Triggers**:
   - Automated: Background scheduled API endpoint `/api/cron/check-expiries` (can be triggered by cron or on admin dashboard visit).
   - Manual: Staff can click "Run Expiry Check & Alert Broadcast" from the staff Notification Center (`/admin/notifications`).
4. **Multi-Channel Notification Dispatch**:
   - Writes persistent notification records to the MongoDB `Notification` collection (appears in client portal header bell).
   - Generates simulated/live email & WhatsApp notification payloads for delivery.

---

## Current Implementation

- `lib/models/Document.ts` contains `warningEscalationTier` and `lastNotificationSentAt`.
- `lib/models/Notification.ts` exists with notification schema.
- `app/api/admin/notifications/route.ts` has basic listing, but lacked automated 30/20/10/5 day calculation and scheduled dispatch engine.

---

## Files / Modules Affected

- **Services & Automation**:
  - `lib/services/expiry-escalation-service.ts` (Core engine evaluating dates and dispatching tier notifications)
- **Backend APIs**:
  - `app/api/cron/check-expiries/route.ts` (Protected cron execution endpoint)
  - `app/api/admin/notifications/run-escalation/route.ts` (Manual trigger for staff with `canSendAlerts` permission)
  - `app/api/admin/notifications/broadcast/route.ts` (Manual broadcast notification endpoint)
- **Frontend Pages & Components**:
  - `app/[locale]/admin/notifications/page.tsx` (Staff Notification & Expiry Center)
  - `components/admin/notifications/ExpiryEscalationTable.tsx` (Live expiring documents radar)
  - `components/admin/notifications/BroadcastNotificationModal.tsx` (Manual alert composer)
- **Client Side Receiver**:
  - `components/portal/NotificationBellPopover.tsx` (Displays received expiry alerts in real time)

---

## Data / Architecture Changes

### Escalation Notification Schema Payload
```typescript
interface ExpiryAlertPayload {
  customerId: string
  documentId: string
  documentTitle: string
  category: string
  daysRemaining: number
  tier: "30_days" | "20_days" | "10_days" | "5_days" | "expired"
  title: string
  message: string
}
```

---

## UI / UX Changes

- **Staff Notification Radar (`/admin/notifications`)**:
  - Live filterable grid of all documents in the 30d, 20d, 10d, and 5d danger zones.
  - Action button: "Trigger Automated Expiry Alerts Now" (displays summary modal of how many alerts were dispatched).
  - Broadcast composer to send targeted WhatsApp/Email alert to a specific company or all companies.
- **Client Notification Popover**:
  - Unread badge counter turns orange/red when critical 10d/5d alerts are received.
  - Clicking the notification routes directly to `/portal/documents` with upload area pre-opened for fast renewal.

---

## Implementation Plan

1. **Build Expiry Escalation Service**:
   - Create `lib/services/expiry-escalation-service.ts` querying approved documents with `expiryDate` in danger intervals.
   - Implement tier transition checks and `Notification` generation in MongoDB.
2. **Expose Automated & Manual Routes**:
   - Build `app/api/cron/check-expiries/route.ts` and `app/api/admin/notifications/run-escalation/route.ts`.
3. **Build Notification Center UI**:
   - Build `ExpiryEscalationTable.tsx` and `BroadcastNotificationModal.tsx`.
   - Update `app/[locale]/admin/notifications/page.tsx`.
4. **Translations**:
   - Add localized notification templates (Arabic & English) for 30d, 20d, 10d, 5d notices.

---

## Small Tasks

- [x] Create `lib/services/expiry-escalation-service.ts` with 30, 20, 10, and 5-day warning tier logic.
- [x] Create `app/api/cron/check-expiries/route.ts` with secure token validation.
- [x] Create `app/api/admin/notifications/run-escalation/route.ts` with `canSendAlerts` permission check.
- [x] Create `app/api/admin/notifications/broadcast/route.ts` for custom manual company notifications.
- [x] Build `components/admin/notifications/ExpiryEscalationTable.tsx` showing documents approaching expiry.
- [x] Build `components/admin/notifications/BroadcastNotificationModal.tsx` for sending direct notifications.
- [x] Update `app/[locale]/admin/notifications/page.tsx` with metrics cards, manual trigger button, and radar table.
- [x] Update client-side notification bell to display direct links to renew expiring documents.
- [x] Add translation strings for all 4 notification tiers in `messages/*.json`.

---

## Edge Cases

- Documents with no expiry date set (ignored by expiry calculator).
- Document already renewed by customer before alert triggers (alert cancelled/reset).
- Multiple documents expiring on same day for single customer (consolidated clean notices).
- Leap years and timezone offset calculations handled reliably using UTC timestamps.

---

## Testing Checklist

- [ ] Verify documents with 30, 20, 10, and 5 days remaining trigger the exact corresponding alert tiers.
- [ ] Verify duplicate alerts are prevented within the same tier window.
- [ ] Verify manual escalation trigger from staff portal dispatches notifications and returns count.
- [ ] Verify client notification bell updates in real time and links to document renewal.
- [ ] Verify Arabic templates render properly formatted Arabic text and dates.

---

## Acceptance Criteria

- System automatically detects documents at 30, 20, 10, and 5 days before expiration.
- Client receives targeted multi-tier notifications with clear escalation urgency.
- Staff can monitor and manually trigger escalation runs from `/admin/notifications`.

---

## Dependencies

Depends on:
- Task 01 (Staff Permissions)
- Task 02 (Customer Directory)
