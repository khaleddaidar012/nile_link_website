# Task 05 — Client Portal Metrics Ratio Engine & Localized Dynamic Activity Stream

## Overview

- **What this feature does**:
  1. Mathematically refactors the Customer Portal compliance overview cards on `/portal` to calculate compliance metrics **proportional to the total number of uploaded documents** rather than against the 20 maximum storage quota slots:
     - Total Uploaded Documents: Displayed as an absolute count (e.g. `10 Files` or `5 Files`, NOT `10 / 20` or `5 / 20`).
     - Approved Documents Ratio: `Verified / Total Uploaded` (e.g. `8 / 10` with percentage badge `80%`).
     - In-Review Documents Ratio: `Pending Review / Total Uploaded` (e.g. `2 / 10` with percentage badge `20%`).
     - Expiring Soon Documents Ratio: `Expiring Soon / Total Uploaded` (e.g. `1 / 10` with percentage badge `10%`).
     - Zero-State Protection: When total uploaded documents = `0`, displays `0 Files` and `0 / 0` or `0%` gracefully without causing `NaN` or division-by-zero errors.
  2. Localizes the Dynamic Activity Stream (`RecentActivityFeed.tsx`) across all 7 platform languages (`ar`, `en`, `fr`, `de`, `it`, `zh`, `bg`), translating all notification titles, descriptions, status badges, and relative timestamps into the active user language.
- **What problem it solves**: Fulfills Requirements 10 and 11 of `needs.md`. Prevents confusing fractions where clients believed their documents were pending out of 20 total slots, and delivers a fully localized audit log timeline for client compliance tracking.
- **Why it is needed**: Corporate compliance officers evaluating customs clearance eligibility need to know the exact proportion of their uploaded paperwork that is approved versus pending inspection. Hardcoded English activity logs degrade the user experience for non-English speakers.
- **How it fits into the existing system**: Directly refactors `components/portal/DashboardMetricsCards.tsx`, `components/portal/RecentActivityFeed.tsx`, and updates `app/api/auth/me/route.ts` and `messages/*.json`.

---

## Requirements

- **REQ-10**: "في صفحة العميل: 1- اجمالي المستندات المرفوعة تبقي مثلا 10 بس مش 10/20، 5 بس مش 5/20. 2- اجمالي المستندات المعتمدة = ال تم توثيقه / اجمالي المرفوع. 3- وال قيد المراجعه = ال قيد المراجعه / اجمالي المرفوع. 4- وكذلك ال قارب علي الانتهاء" (In client portal: 1. Total uploaded documents should show e.g. 10 files, not 10/20; 5 files, not 5/20. 2. Approved documents = verified / total uploaded. 3. In-review documents = in-review / total uploaded. 4. Same for expiring soon).
- **REQ-11**: "سجل النشاط يكون مترجم الي 7 لغات" (Recent activity log must be translated across all 7 platform languages).

---

## Current Implementation

- **Dashboard Metric Cards**:
  - `components/portal/DashboardMetricsCards.tsx` receives `documentStats` from `PortalContext`.
  - `documentStats` contains `{ totalDocs, approvedDocs, pendingDocs, expiringDocs, maxAllowed }`.
  - Earlier implementation calculated `totalUploaded / maxAllowed` (`10 / 20`).
  - Need to ensure cards strictly display:
    - Card 3: `value: `${totalUploaded} Files`` or localized translation string.
    - Card 4: `value: `${approvedCount} / ${totalUploaded}`` with percentage `Math.round((approvedCount / totalUploaded) * 100)`.
    - Card 5: `value: `${pendingCount} / ${totalUploaded}`` with percentage `Math.round((pendingCount / totalUploaded) * 100)`.
    - Card 6: `value: `${expiringCount} / ${totalUploaded}`` with percentage `Math.round((expiringCount / totalUploaded) * 100)`.
- **Activity Log Stream**:
  - `components/portal/RecentActivityFeed.tsx` fetches from `/api/portal/notifications?limit=6`.
  - Maps notification items to `{ id, title, description, timeAgo, type }`.
  - Helper `getLocalizedTitle()` currently maps some categories, but fallback sample activities and database messages must be translated using translation keys (`portal.dashboard.activity.*`).
- **Reference Documentation**:
  - `API_INVENTORY.md` Section 1.4 (`GET /api/auth/me` documentStats specification).
  - `PROJECT_TASKS.md` Customer Portal Dashboard Track.

---

## Files / Modules Affected

- **Components**:
  - `components/portal/DashboardMetricsCards.tsx`
  - `components/portal/RecentActivityFeed.tsx`
- **Context & Types**:
  - `components/portal/PortalContext.tsx`
  - `types/portal.ts` (if applicable)
- **API Endpoints**:
  - `app/api/auth/me/route.ts`
  - `app/api/portal/notifications/route.ts`
- **Localization Files**:
  - `messages/ar.json`
  - `messages/en.json`
  - `messages/fr.json`
  - `messages/de.json`
  - `messages/it.json`
  - `messages/zh.json`
  - `messages/bg.json`

---

## Data / Architecture Changes

- **Calculations & Math Safety**:
  - Total uploaded files: `const totalUploaded = documentStats?.totalDocs ?? 0;`
  - Approved ratio:
    ```typescript
    const approvedRatio = totalUploaded > 0 ? `${approvedCount} / ${totalUploaded}` : "0 / 0"
    const approvedPercent = totalUploaded > 0 ? Math.round((approvedCount / totalUploaded) * 100) : 0
    ```
  - In-Review ratio:
    ```typescript
    const pendingRatio = totalUploaded > 0 ? `${pendingCount} / ${totalUploaded}` : "0 / 0"
    const pendingPercent = totalUploaded > 0 ? Math.round((pendingCount / totalUploaded) * 100) : 0
    ```
  - Expiring ratio:
    ```typescript
    const expiringRatio = totalUploaded > 0 ? `${expiringCount} / ${totalUploaded}` : "0 / 0"
    const expiringPercent = totalUploaded > 0 ? Math.round((expiringCount / totalUploaded) * 100) : 0
    ```
- **Activity Log Localization Keys**:
  - Establish a standardized dictionary in `messages/*.json`:
    - `portal.dashboard.activity.uploadTitle`
    - `portal.dashboard.activity.uploadDesc`
    - `portal.dashboard.activity.approveTitle`
    - `portal.dashboard.activity.approveDesc`
    - `portal.dashboard.activity.warningTitle`
    - `portal.dashboard.activity.warningDesc`
    - `portal.dashboard.activity.verifyTitle`
    - `portal.dashboard.activity.verifyDesc`
    - `portal.dashboard.activity.accountCreatedTitle`
    - `portal.dashboard.activity.accountCreatedDesc`
    - `portal.dashboard.activity.uploadGuideTitle`
    - `portal.dashboard.activity.uploadGuideDesc`

---

## UI / UX Changes

- **Dashboard Metrics Cards**:
  - **Card 3 (Total Uploaded)**:
    - Primary value: `10 Files` (in English: `10 Files`, in Arabic: `10 ملفات`).
    - Subtitle: Mentions available quota slots: `10 slots remaining (20 max allowed)`.
    - No longer displays `10 / 20` as the headline value.
  - **Card 4 (Approved Ratio)**:
    - Primary value: `8 / 10`.
    - Badge: `80%`.
    - Subtitle: `80% of uploaded files verified and accepted`.
  - **Card 5 (In-Review Ratio)**:
    - Primary value: `2 / 10`.
    - Badge: `20%`.
    - Subtitle: `20% awaiting staff inspection`.
  - **Card 6 (Expiring Soon Ratio)**:
    - Primary value: `1 / 10`.
    - Badge: `10%` with warning color.
    - Subtitle: `Requires renewal before vessel clearance`.
- **Dynamic Activity Feed**:
  - Chronological timeline with localized dates formatted via `Intl.DateTimeFormat(locale)`.
  - Clean icons corresponding to action type (green check for approval, amber triangle for expiration warning, cyan shield for verification).
  - High-contrast text legible in both Light and Dark modes.

---

## Implementation Plan

1. **Update `DashboardMetricsCards.tsx` Ratios**:
   - Refactor Card 3 to display `totalUploaded` as a stand-alone integer formatted with localized unit ("ملفات" / "Files").
   - Update Card 4, Card 5, and Card 6 to display `${count} / ${totalUploaded}` with zero-check protection.
   - Set badges to show percentage values relative to `totalUploaded`.
2. **Refactor Activity Stream Localization**:
   - In `components/portal/RecentActivityFeed.tsx`, ensure `getLocalizedTitle()` and `getLocalizedDesc()` match against notification types.
   - Format timestamps using `date.toLocaleDateString(locale, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })`.
3. **Synchronize Translations Across All 7 Languages**:
   - Insert activity keys and ratio descriptions in `ar.json`, `en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json`.

---

## Small Tasks

- [x] Inspect `components/portal/DashboardMetricsCards.tsx` and verify `approvedPercentage`, `pendingPercentage`, and `expiringPercentage` calculations against `totalUploaded`.
- [x] Ensure cards show the ratio (e.g. `X / Y`) as the primary value and the percentage in the badge.
- [x] In `components/portal/RecentActivityFeed.tsx`, verify API fetch from `/api/portal/notifications` or dynamic activity endpoint.
- [x] Verify localized activity title mapping in `components/portal/RecentActivityFeed.tsx` for all 7 languages.
- [x] Ensure relative timestamps use `next-intl` formatting or localized date strings.
- [x] Add empty state and loading skeleton to `components/portal/RecentActivityFeed.tsx`.
- [x] Verify `messages/ar.json`, `en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json` have translation keys for `portal.dashboard.activity.*`.
- [x] Test with sample customer account having uploaded, approved, pending, and expiring documents.

---

## Edge Cases

- **0 Uploaded Documents**:
  - Ratio must display `0 / 0` with `0%` badge instead of `0 / 0 = NaN%`.
- **Arabic Pluralization of "Files"**:
  - Use appropriate translation string for single vs plural ("ملف واحد", "ملفان", "3 ملفات", "15 ملفاً") or concise notation (`10 مستند`).
- **All Documents Approved**:
  - Displays `10 / 10` with `100%` green badge.

---

## Testing Checklist

- [ ] Log in as a customer with 0 documents: verify cards display `0 Files`, `0 / 0` for approved, in-review, and expiring.
- [ ] Upload 5 documents: verify Card 3 displays `5 Files` (not `5 / 20`).
- [ ] Have staff approve 3 documents: verify Card 4 displays `3 / 5` with `60%` badge.
- [ ] Leave 2 documents pending: verify Card 5 displays `2 / 5` with `40%` badge.
- [ ] Set 1 document to expire in 5 days: verify Card 6 displays `1 / 5` with `20%` badge.
- [ ] Open `/ar/portal` and verify the activity timeline translates completely to Arabic with Arabic dates (`٠١ يناير` or formatted dates).
- [ ] Open `/en/portal`, `/fr/portal`, `/zh/portal`: verify activity titles translate accurately.

---

## Acceptance Criteria

- Total uploaded documents is displayed as an absolute number (e.g. `10 Files`), not out of 20.
- Approved, In-Review, and Expiring metrics display exact ratios over total uploaded files (`X / Total`).
- When total uploaded is 0, no division-by-zero or `NaN` occurs.
- Recent activity timeline is 100% localized across all 7 platform languages.
- Zero TypeScript errors (`npx tsc --noEmit`).

---

## Dependencies

- Depends on:
  - Task 04 (Portal Light Theme Baseline & Shell).

---

## AI_MAP Impact

- `API_INVENTORY.md` Section 1.4 (`documentStats` schema).
- `PROJECT_TASKS.md` (Customer Portal Metrics Track).
