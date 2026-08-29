# Task 04 — Document Review Metadata Live Editing & Dynamic System Categories Management

## Overview

- **What this feature does**: 
  1. Empowers staff during document verification to modify document metadata (Title, Category, Issue/Start Date, Expiry Date, Review Notes, or Rejection Reason) prior to approval, with changes immediately updating MongoDB and reflecting in real time on the customer's portal.
  2. Enables Admin Managers to dynamically configure, add, and manage allowed corporate document categories from a dedicated **System Settings** (`/admin/settings`) page, which are dynamically consumed by the client upload dropzone.
- **What problem it solves**: Satisfies Requirements 4 & 5 of `needs.md`: fixes rigid hardcoded document types and allows staff to correct client typos or date discrepancies during verification.
- **Why it is needed**: Freight compliance documents vary by jurisdiction (e.g. Free Zone licenses, phytosanitary certificates, EUR.1 certificates). Managers need agility to add new document categories without code redeployments.
- **How it fits into the existing system**: Enhances `DocumentReviewModal.tsx` and `/api/admin/documents/[id]/verify`, creates a `SystemCategory` model, and provides a new `/admin/settings` management page.

---

## Requirements

1. **Enhanced Document Review & Metadata Editing**:
   - In `DocumentReviewModal.tsx`, staff can edit:
     - **Document Title / Name**: e.g., Correcting "Scan001.pdf" to "Commercial Registration Cairo Branch 2026".
     - **Document Category**: Select from all dynamically configured active system categories.
     - **Issue / Validity Start Date**: Date picker (required for approval).
     - **Expiry Date**: Date picker (required for approval, calculates validity period).
     - **Review Notes & Rejection Reason**: Form inputs for staff observations.
   - When verified, the document in MongoDB updates with the edited title, category, dates, reviewer ID, timestamp, and status.
   - The client portal table and dashboard instantly display the updated title, category badge, and countdown.
2. **Dynamic Document Categories Management (`/admin/settings`)**:
   - Admin Manager can view all active and archived document categories.
   - Admin Manager can add new document categories:
     - Name (Arabic & English)
     - Unique Key (e.g., `customs_certificate`, `phytosanitary_certificate`)
     - Default Validity Days (e.g., 365 days)
     - Is Mandatory (boolean)
     - Description
   - Admin Manager can edit or toggle status (`active` / `archived`) of categories.
3. **Client Upload Zone Integration**:
   - `MultiFileUploadZone.tsx` and `DocumentTable.tsx` fetch the active document categories dynamically from `/api/settings/document-categories` with fallback to default types.

---

## Current Implementation

- `components/admin/review/DocumentReviewModal.tsx` supports status and date selection, but lacks dynamic category selection and editable document title input.
- Document categories in `Document.ts` were statically hardcoded into an enum.
- No `/admin/settings` page currently exists.

---

## Files / Modules Affected

- **Models**:
  - `lib/models/SystemSetting.ts` (New model storing configurable document categories and system parameters)
  - `lib/models/Document.ts` (Ensure category accepts dynamic strings alongside default enums)
- **Backend APIs**:
  - `app/api/admin/documents/[id]/verify/route.ts` (Update to accept `title`, `category`, `startDate`, `expiryDate`, `reviewNotes`, `rejectionReason`)
  - `app/api/admin/settings/categories/route.ts` (GET, POST manage categories)
  - `app/api/admin/settings/categories/[id]/route.ts` (PATCH, DELETE category)
  - `app/api/settings/document-categories/route.ts` (Public/Customer endpoint for fetching active categories)
- **Frontend Pages & Components**:
  - `components/admin/review/DocumentReviewModal.tsx` (Enhanced review modal with editable title, category selector, and date inputs)
  - `app/[locale]/admin/settings/page.tsx` (System Settings & Category Management Page)
  - `components/admin/settings/DocumentCategoriesManager.tsx` (Interactive categories table and modal)
  - `components/portal/documents/MultiFileUploadZone.tsx` (Connect to dynamic categories API)
  - `components/portal/documents/DocumentTable.tsx` (Connect category filter to dynamic categories)

---

## Data / Architecture Changes

### New MongoDB Model (`SystemSetting.ts`)
```typescript
export interface IDocumentCategorySetting {
  id: string
  key: string
  nameEn: string
  nameAr: string
  description?: string
  defaultValidityDays: number
  isMandatory: boolean
  isActive: boolean
  createdAt: Date
}
```

### Updated Verification API Payload
```json
{
  "status": "approved" | "rejected",
  "title": "Commercial Registration 2026-2027",
  "category": "commercial_register",
  "startDate": "2026-08-25",
  "expiryDate": "2027-08-25",
  "reviewNotes": "Original seal verified with Alexandria Chamber of Commerce",
  "rejectionReason": null
}
```

---

## UI / UX Changes

- **Enhanced Review Modal (`DocumentReviewModal.tsx`)**:
  - Split-pane layout: Document PDF/Image preview on left, editable metadata and verification form on right.
  - Interactive inputs: Editable Document Title, Category Dropdown, Date pickers for Issue and Expiry Dates.
- **System Settings Page (`/admin/settings`)**:
  - Clean settings tabs: "Document Types & Categories", "Notification Defaults", "System Quotas".
  - "Add New Document Category" modal with Arabic and English name inputs and default validity presets.

---

## Implementation Plan

1. **Database Model Creation**:
   - Build `lib/models/SystemSetting.ts` with seeded default document categories.
2. **Verification API Enhancement**:
   - Update `app/api/admin/documents/[id]/verify/route.ts` to accept updated `title` and `category` along with dates.
   - Enforce `canReviewDocuments` staff permission.
3. **Review Modal Refactor**:
   - Update `DocumentReviewModal.tsx` with title text input, category selector, and date controls.
4. **Settings API & Frontend**:
   - Build `app/api/admin/settings/categories/route.ts` and `app/api/settings/document-categories/route.ts`.
   - Build `components/admin/settings/DocumentCategoriesManager.tsx` and `app/[locale]/admin/settings/page.tsx`.
   - Add "System Settings" to `AdminSidebar.tsx`.
5. **Client Portal Integration**:
   - Update `MultiFileUploadZone.tsx` to read categories dynamically from API.

---

## Small Tasks

- [x] Create `lib/models/SystemSetting.ts` schema and seed with default 6 logistics document categories.
- [x] Create `app/api/settings/document-categories/route.ts` for client and staff retrieval.
- [x] Create `app/api/admin/settings/categories/route.ts` and `[id]/route.ts` with CRUD operations.
- [x] Update `app/api/admin/documents/[id]/verify/route.ts` to save edited `title`, `category`, `startDate`, `expiryDate`.
- [x] Update `components/admin/review/DocumentReviewModal.tsx` to include editable Title, Category, and Date fields.
- [x] Build `components/admin/settings/DocumentCategoriesManager.tsx` with Add/Edit/Archive modal.
- [x] Build `app/[locale]/admin/settings/page.tsx` integrating category manager and system preferences.
- [x] Add "System Settings" (`إعدادات النظام`) item in `components/admin/AdminSidebar.tsx`.
- [x] Update `MultiFileUploadZone.tsx` and `DocumentTable.tsx` to consume dynamic document categories.
- [x] Add translation strings in all 7 message files (`messages/*.json`).

---

## Edge Cases

- Staff edits document title to empty string (validation falls back to original filename).
- Setting expiry date prior to start date (client-side and server-side date validation error).
- Archiving a document category currently in use by existing customer documents (existing documents preserve their category key without data loss).

---

## Testing Checklist

- [ ] Verify staff can edit document title, category, start date, and expiry date during approval.
- [ ] Verify approved document updates in MongoDB and appears with new title/dates on customer portal.
- [ ] Verify manager can add a new document type in `/admin/settings` (e.g. "EUR.1 Certificate").
- [ ] Verify newly created document type appears immediately in client upload dropzone category selector.
- [ ] Verify validation blocks non-manager staff from modifying system settings.

---

## Acceptance Criteria

- Staff can adjust document title, category, and validity dates during review with instant client-side reflection.
- Managers can add, modify, and manage custom document categories from `/admin/settings`.

---

## Dependencies

Depends on:
- Task 01 (Staff RBAC)
- Task 02 (Customer Directory)
