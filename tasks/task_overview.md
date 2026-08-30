# Task Overview — Document Review, Live Viewer, Metric Sync & Admin Governance

## Project Goal

Transform the 10 operational and UI requirements from `needs.md` into an implementation-ready task suite focusing on staff document verification resilience, embedded live document inspection, cross-portal metric synchronization, manager-level account governance, dark mode remediation, and multilingual admin localization.

---

## AI Map

Project architectural knowledge map:

`AI_MAP/` (and root architectural specifications `API_INVENTORY.md`, `PROJECT_TASKS.md`, `TEST_GUIDE.md`)

---

## Requirements Coverage

All 10 requirements from `needs.md` are rigorously mapped to Major Tasks:

| Requirement ID | Original Requirement in `needs.md` | Assigned Major Task |
| :--- | :--- | :--- |
| **REQ-01** | `1- بدل فتح الملف بدقه كامله عاوز يتعرض live سواء كان pdf or photo` | [Task 02 — Live Document Viewer & In-Modal Date Adjustment Engine](file:///d:/khaled/nile_link_website-main/tasks/task_02_live_document_viewer_and_date_adjustment.md) |
| **REQ-02** | `2- صفحة مراجعة وتحميل المستند في الدارك مود بايظه` | [Task 05 — Terminology Shift, Dark Mode Remediation & Admin Multilingual Suite](file:///d:/khaled/nile_link_website-main/tasks/task_05_terminology_dark_mode_and_admin_localization.md) |
| **REQ-03** | `3- لو وافقت او رفضت ملف يسمع في صفحة حساب العميل عند الموظف الارقام يعني وفي صفحة العميل` | [Task 03 — Real-Time Cross-Portal Metric Synchronization](file:///d:/khaled/nile_link_website-main/tasks/task_03_realtime_cross_portal_metrics_sync.md) |
| **REQ-04** | `4- خطا ايروور 500 اثناء توثيق مستند` | [Task 01 — Document Review Engine Resilience & Error 500 Fixes](file:///d:/khaled/nile_link_website-main/tasks/task_01_document_review_resilience_and_error_fixes.md) |
| **REQ-05** | `5- خطا اثناء رفض مستند` | [Task 01 — Document Review Engine Resilience & Error 500 Fixes](file:///d:/khaled/nile_link_website-main/tasks/task_01_document_review_resilience_and_error_fixes.md) |
| **REQ-06** | `6- سبب الرفض لازم يترجم` | [Task 05 — Terminology Shift, Dark Mode Remediation & Admin Multilingual Suite](file:///d:/khaled/nile_link_website-main/tasks/task_05_terminology_dark_mode_and_admin_localization.md) |
| **REQ-07** | `7- اضافه عاوز زرار تعديل وانا بعمل استعراض للمستند اقدر اعدرا التواريخ او ارفضه` | [Task 02 — Live Document Viewer & In-Modal Date Adjustment Engine](file:///d:/khaled/nile_link_website-main/tasks/task_02_live_document_viewer_and_date_adjustment.md) |
| **REQ-08** | `8- بدل كلمه فحص مستندات خليها مراجعه مستندات` | [Task 05 — Terminology Shift, Dark Mode Remediation & Admin Multilingual Suite](file:///d:/khaled/nile_link_website-main/tasks/task_05_terminology_dark_mode_and_admin_localization.md) |
| **REQ-09** | `9- عاوز حساب مانجير عشان اعمل انشاء حساب للموظفين` | [Task 04 — Manager Super-Admin Account & Staff Governance System](file:///d:/khaled/nile_link_website-main/tasks/task_04_manager_superadmin_and_staff_governance.md) |
| **REQ-10** | `11- خانه اعدادات الادمن عاوزة تترجم صح` | [Task 05 — Terminology Shift, Dark Mode Remediation & Admin Multilingual Suite](file:///d:/khaled/nile_link_website-main/tasks/task_05_terminology_dark_mode_and_admin_localization.md) |

---

## Execution Order

- [x] **Task 01 — Document Review Engine Resilience & Error 500 Fixes** (`task_01_document_review_resilience_and_error_fixes.md`)
- [x] **Task 02 — Live Document Viewer & In-Modal Date Adjustment Engine** (`task_02_live_document_viewer_and_date_adjustment.md`)
- [x] **Task 03 — Real-Time Cross-Portal Metric Synchronization** (`task_03_realtime_cross_portal_metrics_sync.md`)
- [x] **Task 04 — Manager Super-Admin Account & Staff Governance System** (`task_04_manager_superadmin_and_staff_governance.md`)
- [x] **Task 05 — Terminology Shift, Dark Mode Remediation & Admin Multilingual Suite** (`task_05_terminology_dark_mode_and_admin_localization.md`)

---

## Dependencies Graph

```text
Task 01 (Document Review Stability & 500 Error Fixes)
  │
  ├──► Task 02 (Live Document Viewer & Modal Date Editing)
  │      │
  │      └──► Task 03 (Real-Time Cross-Portal Metric Synchronization)
  │
  └──► Task 04 (Manager Account & Staff Governance)

Task 05 (Terminology, Dark Mode Remediation & Admin Translations)
  (Executed in parallel with Tasks 02–04, final visual wrap)
```

---

## Recommended Implementation Sequence

1. **Task 01 First**: Resolving the backend 500 error in `/api/admin/documents/[id]/verify` ensures the review and rejection actions succeed reliably before improving the UI.
2. **Task 02 Second**: Upgrades `DocumentReviewModal.tsx` from static links to a live, embedded interactive canvas with date adjustment and rejection controls.
3. **Task 03 Third**: Hooks the verified document status changes directly into reactive metric updates across both staff customer views and customer portal dashboards.
4. **Task 04 Fourth**: Seeds and configures the Manager (`super_admin`) role to allow self-serve employee creation and permission governance.
5. **Task 05 Fifth**: Standardizes terminology from "فحص" to "مراجعة", polishes dark mode styling for review pages, and provides 100% complete multilingual localization for admin settings.

---

## Global Acceptance Criteria

- [x] Approving a document via the staff portal never throws HTTP 500; status transitions smoothly to `approved`.
- [x] Rejecting a document via the staff portal works without error and persists standard rejection reasons.
- [x] Previewing a PDF or image inside `DocumentReviewModal` displays a live, embedded rendered canvas rather than an external download link.
- [x] Staff can adjust validity dates or reject documents directly while reviewing.
- [x] Approving or rejecting a document immediately updates the metrics counters in both `/admin/customers/[id]` and the client's `/portal`.
- [x] Manager account (`manager@nilelink.com` / `Manager2026!`) can sign in and create new employee accounts with granular permissions.
- [x] "فحص مستندات" is replaced with "مراجعة مستندات" across Arabic navigation, badges, and headers.
- [x] Document review queue and customer detail pages render with high-contrast text and crisp card backgrounds in Dark Mode.
- [x] Admin settings and rejection reasons are fully translated into all 7 languages without raw English fallbacks.
- [x] Unverified user accounts are locked to `/portal/verification` with sidebar tabs disabled, preventing email verification bypass.

---

## Final Testing Checklist

- [x] Staff document approval API test (`POST /api/admin/documents/[id]/verify`) returns 200.
- [x] Staff document rejection API test returns 200.
- [x] Embedded live PDF iframe and image viewer render properly in modal.
- [x] Customer Overview metrics update upon review action.
- [x] Client Portal metrics update upon review action.
- [x] Manager login and employee creation test (`manager@nilelink.com` seeded and verified).
- [x] Dark Mode toggle test on `/admin/documents/review`.
- [x] Arabic terminology check for "مراجعة المستندات" (0 matches for "فحص المستندات").
- [x] Multilingual switcher test on `/admin/settings` across all 7 locales.

