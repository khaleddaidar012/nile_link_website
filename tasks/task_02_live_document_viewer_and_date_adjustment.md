# Task 02 — Live Document Viewer & In-Modal Date Adjustment Engine

## Overview

Replaces the static document icon and external download link inside the staff `DocumentReviewModal.tsx` with an interactive, embedded **Live Document Viewer** (supporting inline PDF rendering with controls and high-resolution image zoom). Adds an explicit in-modal edit panel allowing staff to inspect the document and directly adjust validity dates or trigger immediate rejection without leaving the viewer canvas.

---

## Requirements

- **REQ-01**: `1- بدل فتح الملف بدقه كامله عاوز يتعرض live سواء كان pdf or photo` (Live embedded document viewer instead of opening external high-res files).
- **REQ-07**: `7- اضافه عاوز زرار تعديل وانا بعمل استعراض للمستند اقدر اعدرا التواريخ او ارفضه` (Add an Edit button while previewing the document to modify dates or reject it).

---

## Current Implementation

In [components/admin/review/DocumentReviewModal.tsx](file:///d:/khaled/nile_link_website-main/components/admin/review/DocumentReviewModal.tsx):
- The left column currently displays a static icon (`<FileText className="h-10 w-10" />`) with file size and an external link button: `"Open High-Resolution File"`.
- Staff must open an external browser tab to actually view the PDF or certificate image before deciding whether to approve or reject it.
- There is no unified live viewer canvas that integrates side-by-side date editing and rejection.

---

## Files / Modules Affected

- [components/admin/review/DocumentReviewModal.tsx](file:///d:/khaled/nile_link_website-main/components/admin/review/DocumentReviewModal.tsx)
- [components/shared/LiveDocumentViewerModal.tsx](file:///d:/khaled/nile_link_website-main/components/shared/LiveDocumentViewerModal.tsx)
- [app/[locale]/admin/documents/review/page.tsx](file:///d:/khaled/nile_link_website-main/app/%5Blocale%5D/admin/documents/review/page.tsx)

---

## Data / Architecture Changes

- No database schema changes needed.
- Utilize existing `/api/portal/documents/[id]/download` or direct cloud `fileUrl` as the stream source for the iframe / image element.

---

## UI / UX Changes

- **Live Embedded Viewer Canvas**:
  - For PDF files: Embed an inline `<iframe src="{fileUrl}#toolbar=1&navpanes=0" />` with zoom controls and page navigation.
  - For Image files (PNG, JPG, WEBP): Embed an interactive high-resolution image canvas with zoom-on-click or smooth pan.
  - Provide a quick toggle between "Embedded Preview" and "Fullscreen Modal".
- **Interactive In-Modal Edit Panel**:
  - Add an "Edit / Modify Details" toggle button right next to the viewer.
  - When toggled, staff can adjust `startDate`, `expiryDate`, and `title` with live calculation of remaining days.
  - Add quick action buttons: **Approve Document** (with adjusted dates) and **Reject Document** (opening rejection reason selector).

---

## Implementation Plan

1. In [components/admin/review/DocumentReviewModal.tsx](file:///d:/khaled/nile_link_website-main/components/admin/review/DocumentReviewModal.tsx):
   - Replace lines 183–200 with a reactive embedded preview container.
   - Detect MIME type: render `<iframe />` for PDF and `<img />` for images.
   - Add loading skeleton while document stream buffers.
   - Add an "Edit Metadata & Dates" interactive toggle.
   - Bind date picker inputs directly to the submission payload.

---

## Small Tasks

- [x] Inspect MIME type detection and URL construction in `DocumentReviewModal.tsx`.
- [x] Implement inline `<iframe />` for PDF files with zoom and toolbar parameters.
- [x] Implement inline `<img />` container for image files with proper aspect ratio and max-height constraints.
- [x] Add loading spinner while iframe/image loads.
- [x] Add "Edit Dates / تعديل التواريخ" button in the inspection view.
- [x] Add direct "Reject Document / رفض المستند" action button with rejection reason dropdown.
- [x] Test viewing multi-page PDF documents.
- [x] Test viewing high-resolution scanned certificate photos.

---

## Edge Cases

- **Mixed MIME Types**: Documents uploaded without explicit MIME types should fall back to file extension detection (`.pdf`, `.png`, `.jpg`).
- **Mobile / Small Screens**: On small screens, provide a tabbed switcher between "Live Preview" and "Verification Decision Form".

---

## Testing Checklist

- [ ] Live preview renders PDF without opening a new tab.
- [ ] Live preview renders PNG/JPG images clearly.
- [ ] Clicking "Edit Dates" enables date modification.
- [ ] Submitting approval persists newly adjusted dates.
- [ ] Submitting rejection works directly from the inspection view.

---

## Acceptance Criteria

- Staff can view both PDF and photo documents directly inside the review modal in real-time.
- Staff can adjust validity dates and submit approvals or rejections without leaving the viewer.

---

## Dependencies

- [Task 01 — Document Review Engine Resilience & Error 500 Fixes](file:///d:/khaled/nile_link_website-main/tasks/task_01_document_review_resilience_and_error_fixes.md)

---

## AI_MAP Impact

- `AI_MAP/07_FEATURES.md`
