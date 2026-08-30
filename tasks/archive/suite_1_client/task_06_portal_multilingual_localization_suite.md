# Task 06 — Customer Portal Multilingual Localization Suite (7 Languages)

## Overview

- **What this feature does**:
  1. Achieves complete, 100% multilingual translation coverage across the entire Customer Portal (`/portal`, `/portal/documents`, `/portal/profile`, `/portal/verification`) in all **7 supported platform languages**:
     - 🇸🇦 Arabic (`ar`) — Native RTL
     - 🇬🇧 English (`en`) — LTR
     - 🇫🇷 French (`fr`) — LTR
     - 🇩🇪 German (`de`) — LTR
     - 🇮🇹 Italian (`it`) — LTR
     - 🇨🇳 Chinese Simplified (`zh`) — LTR
     - 🇧🇬 Bulgarian (`bg`) — LTR
  2. Implements exact, professional maritime logistics terminology for:
     - Communication Channels status card ("قنوات التواصل", "بانتظار التوثيق", "Action Needed", "Email & WhatsApp Pending").
     - Account Legal Standing ("حالة الحساب", "بانتظار استكمال التوثيق", "Review", "Pending document upload and verification").
     - Storage Quota Card ("إجمالي المستندات المرفوعة", "Storage", "available upload slots").
     - Approved Compliance Card ("المستندات المعتمدة / السارية", "Active", "Verified & Accepted by Staff").
     - In-Review Card ("مستندات قيد المراجعة", "In Review", "Awaiting NileLink inspection").
     - Expiry Warning Card ("قاربت على الانتهاء (≤ 10 أيام)", "Good", "No immediate expirations").
     - Quick Upload Dropzone ("رفع مستند سريع", "اسحب وأفلت ملفاتك المجددة هنا").
     - Recent Activity Feed ("سجل النشاط الأخير").
     - Document Management Actions ("Manage & Upload Documents").
- **What problem it solves**: Fulfills Requirement 13 of `needs.md`. Eliminates untranslated English strings, placeholder labels, and broken i18n keys on the customer dashboard for international trade partners.
- **Why it is needed**: NileLink operates as an international shipping line servicing multinational clients in the Mediterranean, Red Sea, Europe, and Asia. Corporate shipping directors expect native localization in their primary business language.
- **How it fits into the existing system**: Directly synchronizes the 7 JSON locale dictionaries in `messages/` (`ar.json`, `en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json`) and binds them to `DashboardMetricsCards.tsx`, `QuickUploadWidget.tsx`, `AccountHealthAlertBanner.tsx`, `DocumentTable.tsx`, and `RecentActivityFeed.tsx`.

---

## Requirements

- **REQ-13**: "في صفحة العميل عاوز في كروت الاحصائاات بتاعت المستندات تترجم: قنوات التواصل، بانتظار التوثيق، Action Needed، Email & WhatsApp Pending، حالة الحساب، بانتظار استكمال التوثيق، Review، Pending document upload and verification، إجمالي المستندات المرفوعة، Storage، available upload slots، المستندات المعتمدة / السارية، Active، Verified & Accepted by Staff، مستندات قيد المراجعة، In Review، Awaiting NileLink inspection، قاربت على الانتهاء (≤ 10 أيام)، Good، No immediate expirations، رفع مستند سريع، اسحب وأفلت ملفاتك المجددة هنا، Manage & Upload Documents، سجل النشاط الأخير. كل دا يكون مترجم" (In the client portal, all metrics cards, channel status, account health, quick upload dropzone, and activity logs must be translated across all languages).

---

## Current Implementation

- **Translation Architecture**:
  - Built with `next-intl`.
  - Locale message catalogs located in `messages/{locale}.json`.
  - `components/portal/DashboardMetricsCards.tsx` and `QuickUploadWidget.tsx` call `useTranslations()`.
- **Gaps to Address**:
  - Several cards previously used hardcoded fallback text like `"Action Needed"` or `"Pending document upload and verification"`.
  - In `fr.json`, `de.json`, `it.json`, `zh.json`, and `bg.json`, specific keys for portal KPIs and quick upload widgets were missing or incomplete, causing runtime fallback to English.
- **Reference Documentation**:
  - `API_INVENTORY.md` Section 6 (Frontend -> API Mapping Matrix).
  - `PROJECT_TASKS.md` Multilingual & Localization Track.

---

## Files / Modules Affected

- **Localization Dictionaries**:
  - `messages/ar.json`
  - `messages/en.json`
  - `messages/fr.json`
  - `messages/de.json`
  - `messages/it.json`
  - `messages/zh.json`
  - `messages/bg.json`
- **Dashboard & Portal Components**:
  - `components/portal/DashboardMetricsCards.tsx`
  - `components/portal/QuickUploadWidget.tsx`
  - `components/portal/AccountHealthAlertBanner.tsx`
  - `components/portal/RecentActivityFeed.tsx`
  - `components/portal/documents/DocumentTable.tsx`
  - `components/portal/documents/MultiFileUploadZone.tsx`

---

## Data / Architecture Changes

- **Translation Key Taxonomy**:
  - Add standardized sub-keys under `portal.dashboard.kpi.*`:
    ```json
    {
      "portal": {
        "dashboard": {
          "kpi": {
            "channels": "قنوات التواصل",
            "channelsPending": "Email & WhatsApp Pending",
            "channelsConnected": "WhatsApp & Email Connected",
            "actionRequired": "Action Needed",
            "accountStatus": "حالة الحساب",
            "awaitingVerification": "بانتظار استكمال التوثيق",
            "pendingUploadDesc": "Pending document upload and verification",
            "review": "Review",
            "storage": "Storage",
            "slotsAvailable": "available upload slots",
            "verifiedStaff": "Verified & Accepted by Staff",
            "awaitingInspection": "Awaiting NileLink inspection",
            "good": "Good",
            "noExpirations": "No immediate expirations",
            "quickUpload": "رفع مستند سريع",
            "dragDropRenew": "اسحب وأفلت ملفاتك المجددة هنا",
            "manageDocs": "Manage & Upload Documents",
            "recentActivity": "سجل النشاط الأخير"
          }
        }
      }
    }
    ```
- Ensure full key parity across all 7 locale files to prevent missing-key warnings or hydrations errors.

---

## UI / UX Changes

- **Arabic (`/ar/portal`)**:
  - Every card displays authentic, formal Arabic phrasing with right-to-left alignment:
    - Card 1: "قنوات التواصل" / "بانتظار التوثيق" / "إجراء مطلوب" / "البريد والواتساب بانتظار التفعيل".
    - Card 2: "حالة الحساب" / "بانتظار استكمال التوثيق" / "قيد المراجعة" / "بانتظار رفع المستندات والتحقق".
    - Card 3: "إجمالي المستندات المرفوعة" / "مساحة التخزين" / "خانة متاحة للرفع".
    - Card 4: "المستندات المعتمدة / السارية" / "معتمد" / "تم التدقيق والقبول من فريق العمل".
    - Card 5: "مستندات قيد المراجعة" / "قيد المراجعة" / "بانتظار فحص نايل لينك".
    - Card 6: "قاربت على الانتهاء (≤ 10 أيام)" / "مطمئن" / "لا توجد مستندات قاربت على الانتهاء".
    - Quick Upload: "رفع مستند سريع" / "اسحب وأفلت ملفاتك المجددة هنا".
    - Activity Feed: "سجل النشاط الأخير".
- **English & European/Asian Locales**:
  - Consistent internationalized strings across English, French, German, Italian, Chinese, and Bulgarian.
  - Number and date formats adapt dynamically according to the active locale.

---

## Implementation Plan

1. **Audit Existing Translation Keys in `messages/ar.json` and `messages/en.json`**:
   - Verify that all 24 required phrases from REQ-13 are present with accurate Arabic and English phrasing.
2. **Translate and Propagate to All 5 Additional Languages**:
   - Provide accurate translations in `messages/fr.json` (French).
   - Provide accurate translations in `messages/de.json` (German).
   - Provide accurate translations in `messages/it.json` (Italian).
   - Provide accurate translations in `messages/zh.json` (Chinese Simplified).
   - Provide accurate translations in `messages/bg.json` (Bulgarian).
3. **Bind Components to Dynamic Translation Keys**:
   - In `DashboardMetricsCards.tsx`, replace any remaining hardcoded strings with `t("portal.dashboard.kpi.*")`.
   - In `QuickUploadWidget.tsx`, bind title and description to `t("portal.dashboard.kpi.quickUpload")` and `t("portal.dashboard.kpi.dragDropRenew")`.
   - In `AccountHealthAlertBanner.tsx`, ensure alert titles and button text consume translated keys.

---

## Small Tasks

- [x] Audit `components/portal/documents/MultiFileUploadZone.tsx` for hardcoded English strings (dropzone labels, size limits, file category labels, progress messages) and replace with `t('documents.upload.*')`.
- [x] Audit `components/portal/documents/DocumentTable.tsx` for hardcoded column headers, status badges, action buttons, and replace with `t('documents.table.*')`.
- [x] Audit `components/portal/documents/DocumentPreviewModal.tsx` / `LiveDocumentViewerModal.tsx` and `RejectionReasonModal.tsx` for modal titles, metadata labels, and close buttons.
- [x] Audit `components/portal/AccountHealthAlertBanner.tsx` for alert headings, action buttons, and instructions.
- [x] Audit `components/portal/PortalHeader.tsx` for title fallbacks and dropdown items.
- [x] Audit `components/portal/NotificationBellPopover.tsx` for popover titles, empty states, and dismiss buttons.
- [x] Verify `messages/ar.json` has complete coverage for all audited portal keys.
- [x] Populate audited keys in `messages/en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json`.
- [x] Verify switcher works cleanly across all 7 locales in `/portal` and `/portal/documents`.
- [x] Test language switcher across all 7 languages on `/portal` and confirm 0 missing translation warnings.

---

## Edge Cases

- **Missing Translation Key Fallback**:
  - If an unexpected locale is requested, `next-intl` configuration must cleanly fall back to `en.json` without throwing runtime exceptions.
- **RTL Number Order**:
  - Ratios such as `10 / 20` or `8 / 10` in Arabic must render logically from left to right as numbers (`٨ / ١٠` or `8 / 10`) without punctuation inversion.

---

## Testing Checklist

- [ ] Open `/ar/portal` and verify all 6 metric cards display Arabic text matching REQ-13.
- [ ] Verify the quick upload widget displays "رفع مستند سريع" and "اسحب وأفلت ملفاتك المجددة هنا".
- [ ] Verify the activity feed header displays "سجل النشاط الأخير".
- [ ] Switch to English (`/en/portal`): verify all cards display English equivalents.
- [ ] Switch to French (`/fr/portal`): verify all cards display French equivalents.
- [ ] Switch to German (`/de/portal`): verify all cards display German equivalents.
- [ ] Switch to Italian (`/it/portal`): verify all cards display Italian equivalents.
- [ ] Switch to Chinese (`/zh/portal`): verify all cards display Chinese equivalents.
- [ ] Switch to Bulgarian (`/bg/portal`): verify all cards display Bulgarian equivalents.

---

## Acceptance Criteria

- 100% of text across customer portal metrics cards, channels status, compliance indicators, quick upload dropzone, and activity timeline is fully translated across all 7 platform languages.
- Zero untranslated or hardcoded English strings appear when browsing in Arabic, French, German, Italian, Chinese, or Bulgarian.
- Zero TypeScript or Next.js localization warnings (`npx tsc --noEmit`).

---

## Dependencies

- Depends on:
  - Task 04 (Portal Light Theme Baseline & Shell).
  - Task 05 (Client Metrics Ratio Engine & Activity Stream).

---

## AI_MAP Impact

- `PROJECT_TASKS.md` (Multilingual & i18n Milestones).
- `TEST_GUIDE.md` (Localization Testing Protocols).
