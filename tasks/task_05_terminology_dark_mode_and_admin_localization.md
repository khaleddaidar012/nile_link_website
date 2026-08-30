# Task 05 — Terminology Shift, Dark Mode Remediation & Admin Multilingual Suite

## Overview

Executes three vital visual and linguistic improvements across the portal:
1. **Terminology Shift**: Changes all occurrences of "فحص مستندات" (Document Inspection) to "مراجعة مستندات" (Document Review) across Arabic navigation, headers, tooltips, and badges.
2. **Dark Mode Remediation**: Fixes broken/unstyled backgrounds and contrast clashes in the document review queue and upload areas when Dark Mode is active.
3. **Multilingual Localization Suite**: Translates all admin settings (`admin.settings.*`), review queue labels (`admin.review.*`), customer management titles, and document rejection reasons across all 7 platform languages.

---

## Requirements

- **REQ-02**: `2- صفحة مراجعة وتحميل المستند في الدارك مود بايظه` (Document review and upload pages are broken in Dark Mode).
- **REQ-06**: `6- سبب الرفض لازم يترجم` (Document rejection reasons must be translated into all languages).
- **REQ-08**: `8- بدل كلمه فحص مستندات خليها مراجعه مستندات` (Change terminology from "فحص مستندات" to "مراجعة مستندات").
- **REQ-10**: `11- خانه اعدادات الادمن عاوزة تترجم صح` (Admin settings section must be properly translated).

---

## Current Implementation

- In [messages/ar.json](file:///d:/khaled/nile_link_website-main/messages/ar.json):
  - Line 700 contains `"inspect": "فحص المستندات"`.
  - Line 705 contains `"فحص الحالة القانونية للشركات"`.
  - The `"admin"` translation section is missing, causing `t("admin.settings.*")` and `t("admin.review.*")` to fall back to raw English.
- In [DocumentReviewModal.tsx](file:///d:/khaled/nile_link_website-main/components/admin/review/DocumentReviewModal.tsx):
  - Rejection reasons are hardcoded in English (`"Illegible or Low Quality Copy"`, `"Missing Official Stamps"`, etc.).
  - Dark mode styles contain light container backgrounds (`bg-white` without proper dark overrides) causing harsh visual breaks.
- In [DocumentCategoriesManager.tsx](file:///d:/khaled/nile_link_website-main/components/admin/settings/DocumentCategoriesManager.tsx):
  - Category modal and table labels lack localized Arabic keys.

---

## Files / Modules Affected

- [messages/ar.json](file:///d:/khaled/nile_link_website-main/messages/ar.json)
- [messages/en.json](file:///d:/khaled/nile_link_website-main/messages/en.json)
- [messages/fr.json](file:///d:/khaled/nile_link_website-main/messages/fr.json)
- [messages/de.json](file:///d:/khaled/nile_link_website-main/messages/de.json)
- [messages/it.json](file:///d:/khaled/nile_link_website-main/messages/it.json)
- [messages/zh.json](file:///d:/khaled/nile_link_website-main/messages/zh.json)
- [messages/bg.json](file:///d:/khaled/nile_link_website-main/messages/bg.json)
- [components/admin/AdminSidebar.tsx](file:///d:/khaled/nile_link_website-main/components/admin/AdminSidebar.tsx)
- [components/admin/review/DocumentReviewModal.tsx](file:///d:/khaled/nile_link_website-main/components/admin/review/DocumentReviewModal.tsx)
- [components/admin/settings/DocumentCategoriesManager.tsx](file:///d:/khaled/nile_link_website-main/components/admin/settings/DocumentCategoriesManager.tsx)
- [app/[locale]/admin/documents/review/page.tsx](file:///d:/khaled/nile_link_website-main/app/%5Blocale%5D/admin/documents/review/page.tsx)
- [app/[locale]/admin/settings/page.tsx](file:///d:/khaled/nile_link_website-main/app/%5Blocale%5D/admin/settings/page.tsx)

---

## Data / Architecture Changes

- Add structured `"admin"` and `"rejectionReasons"` dictionaries to all 7 language files.
- Store rejection reasons in database as standardized semantic keys (e.g. `illegible_copy`, `expired_date`, `missing_stamps`, `invalid_data`, `other`) with dynamic localization on render.

---

## UI / UX Changes

- **Terminology**:
  - Replace "فحص المستندات" with "مراجعة المستندات" across Arabic navigation, page headers, action buttons, and status descriptions.
- **Dark Mode Remediation**:
  - Audit `DocumentReviewModal.tsx`:
    - Container: `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800`
    - Preview canvas: `bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800`
    - Form inputs and select dropdowns: `dark:bg-slate-800 dark:border-slate-700 dark:text-white`
    - Text: `text-slate-900 dark:text-white` and `text-slate-500 dark:text-slate-400`
  - Audit `app/[locale]/admin/documents/review/page.tsx` table and action buttons for seamless Dark Mode rendering.
- **Admin Settings Translations**:
  - Title, subtitle, column headers, "Add Category" modal, and validation messages fully localized.

---

## Implementation Plan

1. In [messages/ar.json](file:///d:/khaled/nile_link_website-main/messages/ar.json):
   - Replace "فحص" with "مراجعة" in navigation and customer inspection descriptions.
   - Add full `"admin"` section covering `settings`, `review`, `customers`, and `sidebar`.
   - Add standardized `"rejectionReasons"` dictionary.
2. In [messages/en.json](file:///d:/khaled/nile_link_website-main/messages/en.json) and European/Asian locale files (`fr`, `de`, `it`, `zh`, `bg`):
   - Add matching `"admin"` and `"rejectionReasons"` translation trees.
3. In [components/admin/review/DocumentReviewModal.tsx](file:///d:/khaled/nile_link_website-main/components/admin/review/DocumentReviewModal.tsx):
   - Map rejection reasons to translation keys: `t("rejectionReasons." + reasonKey)`.
   - Polish dark mode CSS classes.
4. In [components/admin/settings/DocumentCategoriesManager.tsx](file:///d:/khaled/nile_link_website-main/components/admin/settings/DocumentCategoriesManager.tsx):
   - Connect all static labels to `t("admin.settings.*")`.

---

## Small Tasks

- [x] Search and replace "فحص المستندات" with "مراجعة المستندات" in `messages/ar.json`.
- [x] Add `"admin"` translation section to `messages/ar.json`.
- [x] Add `"admin"` translation section to `en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json`.
- [x] Add `"rejectionReasons"` translation tree to all 7 language files.
- [x] Update `DocumentReviewModal.tsx` rejection dropdown to use localized strings.
- [x] Apply dark mode classes (`dark:bg-slate-900`, `dark:border-slate-800`, `dark:text-white`) to `DocumentReviewModal.tsx`.
- [x] Apply dark mode classes to `app/[locale]/admin/documents/review/page.tsx`.
- [x] Apply dark mode classes to `DocumentCategoriesManager.tsx`.
- [x] Validate JSON syntax across all 7 language files.
- [x] Run `npx tsc --noEmit` to confirm 0 type errors.

---

## Edge Cases

- **Custom Rejection Reasons**: If staff writes custom review notes, preserve custom text alongside the localized reason.
- **RTL Alignment**: Ensure Arabic dropdowns and date pickers align correctly in RTL mode.

---

## Testing Checklist

- [x] Arabic navigation displays "مراجعة المستندات".
- [x] Dark mode toggle on `/admin/documents/review` looks clean and readable with zero white-card clash.
- [x] Rejection reasons dropdown displays translated text in Arabic, English, and French.
- [x] `/admin/settings` displays translated headings, buttons, and table columns in all 7 languages.
- [x] All 7 JSON files pass validation.

---

## Acceptance Criteria

- "مراجعة المستندات" is uniformly used instead of "فحص المستندات".
- Rejection reasons are translated across all 7 languages.
- Document review queue and modal are fully styled and readable in Dark Mode.
- Admin settings section is 100% translated across all languages.

---

## Dependencies

- None (Can be implemented alongside or after Tasks 01–04)

---

## AI_MAP Impact

- `AI_MAP/07_FEATURES.md`
- `AI_MAP/05_FRONTEND.md`
