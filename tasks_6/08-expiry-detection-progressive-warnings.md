# Task: Dynamic Expiry Detection Engine & Progressive Warning System

Status: in_progress
Priority: high

## 1. Overview & Scope

Design and implement the automated Expiry Detection Engine and the 5-tier progressive warning escalation system: 🟢 Normal (>30d), 🟡 Warning (10–30d), 🟠 Urgent (3–9d), 🔴 Critical (0–2d), ⛔ Expired. Features automated cron job scanning (`/api/cron/check-expiries`), anti-spam deduplication, 10-day advance notice triggers, and manual staff warning actions.

---

## 2. Master Subtask Checklist

- [x] Subtask 01 — Expiry Detection & Escalation Engine Service (`/api/cron/check-expiries`)
- [x] Subtask 02 — 5-Tier Progressive Expiry Warning Classification (`expiry-calculator.ts`)
- [x] Subtask 03 — Automated 10-Day Advance Expiry Notice
- [x] Subtask 04 — Notification Anti-Spam & Deduplication System
- [x] Subtask 05 — Manual Expiry Warning Trigger API (`/api/admin/documents/[id]/send-warning`)
- [x] Subtask 06 — Staff Manual Warning Modal Component (`ManualWarningModal.tsx`)
- [ ] Subtask 07 — Document Status Auto-Transition Engine (`expiring_soon` & `expired`)
- [ ] Subtask 08 — Localization Strings for Expiry Warnings & Horizons

---

## 3. Subtask Details

### Subtask 01 — Document Expiry Detection Background Engine (`/api/cron/check-expiries`)

#### Objective
Create an automated background job endpoint (secured by a cron secret token e.g. `CRON_SECRET`) that scans all approved documents daily (or on-demand), calculates remaining days, updates warning tiers, triggers status transitions, and schedules notification dispatches.

#### Why it is needed
Guarantees that document statuses and warning tiers stay accurate without requiring user login or manual database manipulation.

#### Where it should be implemented
- `app/api/cron/check-expiries/route.ts`
- `lib/engine/expiry-detection-engine.ts`

#### Expected Result
- Secured endpoint: Rejects requests missing `Authorization: Bearer <CRON_SECRET>`.
- Query: Fetches all active non-archived documents where `status IN ['approved', 'expiring_soon']`.
- Calculates `daysRemaining = Math.ceil((doc.expiryDate - now) / (1000 * 60 * 60 * 24))`.
- Classifies each document into an expiry horizon:
  - `daysRemaining < 0` → Marks status as `expired`, recalculates customer status to `inactive`.
  - `0 <= daysRemaining <= 10` → Marks status as `expiring_soon`, updates warning tier.
- Dispatches queued notifications via Subtask in `09-notification-system-email-whatsapp.md`.
- Returns JSON summary: `{ processed: 320, updated: 14, expired: 2, expiringSoon: 12, executionTimeMs: 142 }`.

#### Dependencies
- `01-database-schema-models.md` (`Document`, `Customer`)
- `07-document-review-verification-engine.md` (Account Health Calculator)

#### Acceptance Criteria
- Processes 1,000 documents in under 2 seconds.
- Idempotent execution (running twice produces identical safe state).

---

### Subtask 02 — Expiry Horizon Calculation & Classification Service

#### Objective
Build a shared utility service to compute the precise expiry horizon, remaining days, human-readable time strings, and urgency severity levels for any document date.

#### Why it is needed
Provides consistent horizon calculations across backend cron jobs, API responses, and client UI components.

#### Where it should be implemented
`lib/utils/expiry-calculator.ts`

#### Expected Result
- `calculateExpiryTier(expiryDate: Date | string | null): ExpiryClassification`:
  - `tier`: `"normal"` | `"warning"` | `"urgent"` | `"critical"` | `"expired"`
  - `daysRemaining`: number
  - `horizonCategory`: `">30_days"` | `"10-30_days"` | `"3-9_days"` | `"0-2_days"` | `"expired"`
  - `isActionRequired`: boolean
  - `labelKey`: translation string key (e.g. `"expiresInDays"`, `"expiredDaysAgo"`)
  - `formattedRemaining`: localized relative string (e.g. `"Expires in 8 days"`, `"ينتهي خلال 8 أيام"`).

#### Dependencies
- `date-fns` or native JavaScript `Intl.RelativeTimeFormat`

#### Acceptance Criteria
- Unit tests covering negative days (expired), 0 days (today), 1-2 days (critical), 3-9 days (urgent), 10-30 days (warning), and >30 days (normal).

---

### Subtask 03 — 5-Tier Progressive Warning UI Design Tokens & Badges

#### Objective
Design and implement a reusable Badge & Indicator component with distinct visual styles and color tokens matching the 5 progressive severity tiers.

#### Why it is needed
Visually conveys the urgency of document renewal at a glance with escalating color intensity.

#### Where it should be implemented
- `components/shared/ExpiryStatusBadge.tsx`
- `constants/expiry-tiers.ts`

#### Expected Result
1. **Tier 1: Normal (> 30 Days Remaining)**
   - Color: Emerald Green 🟢 (`bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400`)
   - Icon: `CheckCircle2`
   - Animation: None.
2. **Tier 2: Warning (10 – 30 Days Remaining)**
   - Color: Amber Yellow 🟡 (`bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400`)
   - Icon: `Clock`
   - Animation: None.
3. **Tier 3: Urgent (3 – 9 Days Remaining)**
   - Color: Deep Orange 🟠 (`bg-orange-500/10 text-orange-600 border-orange-500/30 dark:text-orange-400`)
   - Icon: `AlertTriangle`
   - Animation: Subtle border glow.
4. **Tier 4: Critical (0 – 2 Days Remaining)**
   - Color: Crimson Red 🔴 (`bg-rose-500/15 text-rose-600 border-rose-500/40 dark:text-rose-400`)
   - Icon: `AlertOctagon`
   - Animation: Pulsing indicator (`animate-pulse`).
5. **Tier 5: Expired (Past Expiration Date)**
   - Color: Dark Slate Red ⛔ (`bg-red-950/20 text-red-600 border-red-700 dark:text-red-400 font-bold`)
   - Icon: `XCircle`
   - Animation: High-contrast static alert.

#### Dependencies
- `lucide-react`
- Tailwind CSS

#### Acceptance Criteria
- Badges render with crisp typography and contrast ratio ≥ 4.5:1 for accessibility.
- Works in both light and dark mode.

---

### Subtask 04 — Dynamic Color Escalation & Pulsing Animation Helpers

#### Objective
Create CSS utility classes and Tailwind plugin configurations for progressive intensity glows and smooth pulsing animations tailored for urgent document warnings.

#### Why it is needed
Enhances user attention on critical documents nearing expiration without being visually jarring.

#### Where it should be implemented
- `app/globals.css`
- `lib/utils/style-utils.ts`

#### Expected Result
- Custom CSS keyframes: `@keyframes gentle-pulse`, `@keyframes alert-glow`.
- Utility functions: `getExpiryBadgeStyle(daysRemaining)`, `getExpiryRowHighlight(daysRemaining)`.
- Table rows for critical/expired documents apply subtle background tinting (`bg-rose-500/5` or `bg-amber-500/5`).

#### Dependencies
- `app/globals.css`

#### Acceptance Criteria
- Animations respect `prefers-reduced-motion` media queries.
- Zero layout shift during animation cycles.

---

### Subtask 05 — Customer In-Portal Urgency Escalation Banners

#### Objective
Implement the progressive warning banner component embedded on Customer Portal views that intensifies in wording, color, and prominence as expiry draws closer.

#### Why it is needed
Guarantees the client cannot miss approaching document deadlines and provides an instant 1-click renewal action.

#### Where it should be implemented
`components/portal/ProgressiveWarningBanner.tsx`

#### Expected Result
- **10 Days Warning**: Amber box: `"Your [Commercial Registration] will expire in 10 days. Please arrange renewal to maintain active service."` + `[Upload Renewal]`.
- **3 Days Urgent**: Orange box with countdown: `"Urgent: [Tax Card] expires in 3 days. Account features will be restricted upon expiration."` + `[Upload Now]`.
- **0 Days Critical (Today)**: Red pulsing box: `"Critical: [Import License] expires TODAY. Immediate action required."` + `[Upload Replacement]`.
- **Expired**: Dark red banner: `"Service Suspended: [Commercial Registration] has expired. Upload updated document to restore active status."` + `[Resolve Immediately]`.

#### Dependencies
- Subtask 02 (`expiry-calculator.ts`)

#### Acceptance Criteria
- Clicking the CTA button immediately opens the upload drawer pre-configured for that specific document category.

---

### Subtask 06 — Employee Dashboard Expiry Horizon Breakdown Filter

#### Objective
Add an interactive Expiry Horizon Filter Bar to the Employee Admin Dashboard and Document List allowing staff to filter documents by specific urgency windows.

#### Why it is needed
Enables staff to triage documents by expiration horizon: `All`, `Expired`, `Today`, `≤ 3 Days`, `≤ 7 Days`, `≤ 10 Days`, `≤ 30 Days`.

#### Where it should be implemented
- `components/admin/documents/ExpiryHorizonFilterBar.tsx`
- `app/[locale]/admin/documents/page.tsx`

#### Expected Result
- Segmented filter buttons with badge counts:
  - `All Active` (e.g. `240`)
  - `Expired` ⛔ (`4`)
  - `Expires ≤ 3 Days` 🔴 (`3`)
  - `Expires ≤ 7 Days` 🟠 (`5`)
  - `Expires ≤ 10 Days` 🟡 (`8`)
  - `Valid > 30 Days` 🟢 (`220`)
- Selecting a filter immediately refreshes the table showing only documents in that horizon.

#### Dependencies
- `06-employee-admin-portal-core.md`

#### Acceptance Criteria
- Filtering applies instantly with client-side or fast API query.
- Badge counts reflect true database counts for each horizon.

---

### Subtask 07 — Document Status Auto-Transition Engine (`expiring_soon` & `expired`)

#### Objective
Build the state machine rules that transition document status automatically from `approved` → `expiring_soon` → `expired` and trigger customer account health recalculation.

#### Why it is needed
Ensures the document status reflects reality at all times without manual staff intervention.

#### Where it should be implemented
`lib/engine/document-state-machine.ts`

#### Expected Result
- Transition rule:
  - If `status === "approved"` and `daysRemaining <= 10` → Transition to `expiring_soon`, log activity.
  - If `status IN ["approved", "expiring_soon"]` and `daysRemaining < 0` → Transition to `expired`, log activity, recalculate customer status to `inactive`.
  - If new replacement document is approved → Transition previous document to `archived`.

#### Dependencies
- `01-database-schema-models.md`
- `07-document-review-verification-engine.md`

#### Acceptance Criteria
- State transitions are logged in `DocumentActivityLog`.
- Customer status transitions to `inactive` automatically on the exact expiration day.

---

### Subtask 08 — Localization Strings for Expiry Warnings & Horizons

#### Objective
Add all Arabic and English localization keys for the 5-tier warning levels, countdown phrases, urgency badges, and banner messages in `messages/ar.json` and `messages/en.json`.

#### Why it is needed
Ensures Arabic and English language accuracy for time countdowns and warning escalations.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- `expiry` namespace containing:
  - `tiers`: normal, warning, urgent, critical, expired.
  - `horizons`: today, within3Days, within7Days, within10Days, within30Days, expiredDaysAgo.
  - `banners`: warningTitle, urgentTitle, criticalTitle, expiredTitle, renewCta, uploadCta.
  - `countdowns`: daysLeft, hoursLeft, expiredOn.

#### Dependencies
- `next-intl`

#### Acceptance Criteria
- Natural Arabic pluralization rules handled cleanly (يوم / يومان / أيام / يوماً).

---

## 4. Edge Cases & Handling

1. **Leap Years & Daylight Saving Shifts**: Use UTC midnight normalization (`startOfUtcDay`) for all date difference calculations to avoid 23-hour or 25-hour day skew.
2. **Same-Day Expirations (0 Days)**: Ensure documents expiring on the current calendar day are treated as `Critical` until 23:59:59 UTC, then transition to `Expired` at 00:00:00 UTC next day.
3. **Repeated State Transitions**: Prevent redundant activity log creation if a document has already transitioned to `expiring_soon`.

---

## 5. Regression Requirements

- Must NOT modify or interfere with any marketing page cache headers.
- Background cron endpoint must not cause memory leaks or unbounded connection pool growth.

---

## 6. Acceptance Criteria Summary

- [ ] Background expiry detection cron endpoint `/api/cron/check-expiries` operational.
- [ ] 5 progressive warning tiers (🟢, 🟡, 🟠, 🔴, ⛔) visually defined and functional.
- [ ] In-portal warning banners adapt dynamically as expiration approaches.
- [ ] Employee horizon filter displays document counts across 10d, 7d, 3d, and expired buckets.
- [ ] Auto-transition to `expired` status and customer `inactive` standing verified.
