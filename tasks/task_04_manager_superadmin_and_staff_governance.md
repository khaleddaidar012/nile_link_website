# Task 04 — Manager Super-Admin Account & Staff Governance System

## Overview

Implements the Manager / Super-Admin account role and UI governance system that allows authorized managers to create, view, activate/deactivate, and assign granular permissions (`canSendAlerts`, `canReviewDocuments`, `canManageCustomers`) to staff/employee accounts. Seeds a default manager account in the database and updates project credentials.

---

## Requirements

- **REQ-09**: `9- عاوز حساب مانجير عشان اعمل انشاء حساب للموظفين` (Need a Manager account to create employee/staff accounts).

---

## Current Implementation

- In [app/api/admin/staff/route.ts](file:///d:/khaled/nile_link_website-main/app/api/admin/staff/route.ts):
  - Line 68 requires `session.role === "super_admin"` to create staff.
- In [cred.md](file:///d:/khaled/nile_link_website-main/cred.md):
  - Only `staff@nilelink.com` with role `"staff"` is currently documented.
  - When users log in with `staff@nilelink.com`, they do not have the `"super_admin"` role, causing staff creation to return `403 Forbidden: "Access denied. Only managers can create employee accounts."`.
- In [app/[locale]/admin/staff/page.tsx](file:///d:/khaled/nile_link_website-main/app/%5Blocale%5D/admin/staff/page.tsx):
  - The staff creation modal and directory exist but need verification to ensure managers can easily add employees with custom permissions.

---

## Files / Modules Affected

- [app/api/auth/login/route.ts](file:///d:/khaled/nile_link_website-main/app/api/auth/login/route.ts)
- [app/api/admin/staff/route.ts](file:///d:/khaled/nile_link_website-main/app/api/admin/staff/route.ts)
- [app/[locale]/admin/staff/page.tsx](file:///d:/khaled/nile_link_website-main/app/%5Blocale%5D/admin/staff/page.tsx)
- [components/admin/staff/StaffManagementView.tsx](file:///d:/khaled/nile_link_website-main/components/admin/staff/StaffManagementView.tsx)
- [cred.md](file:///d:/khaled/nile_link_website-main/cred.md)

---

## Data / Architecture Changes

- Update `autoSeedIfEmpty()` in `app/api/auth/login/route.ts` and standalone seeding to guarantee a Manager Super-Admin user exists:
  - **Email**: `manager@nilelink.com`
  - **Password**: `Manager2026!`
  - **Role**: `super_admin`
  - **Permissions**: Full administrative privileges (`canManageCustomers: true`, `canReviewDocuments: true`, `canSendAlerts: true`).
- Ensure both `"super_admin"` and any role configured with manager capabilities can access `/admin/staff` and execute `POST /api/admin/staff`.

---

## UI / UX Changes

- In [StaffManagementView.tsx](file:///d:/khaled/nile_link_website-main/components/admin/staff/StaffManagementView.tsx):
  - Provide a clear "Add New Employee / إضافة موظف جديد" CTA button.
  - Modal with form inputs: First Name, Last Name, Work Email, Phone Number, Password, and checkboxes for granular permissions:
    - Review Documents (`canReviewDocuments`)
    - Customer Account Governance (`canManageCustomers`)
    - Dispatch Alerts & Notifications (`canSendAlerts`)
  - Status toggle to activate/suspend employee accounts.
- Document credentials clearly in [cred.md](file:///d:/khaled/nile_link_website-main/cred.md).

---

## Implementation Plan

1. In [app/api/auth/login/route.ts](file:///d:/khaled/nile_link_website-main/app/api/auth/login/route.ts):
   - Add `manager@nilelink.com` to `autoSeedIfEmpty()` with role `"super_admin"`.
2. In [app/api/admin/staff/route.ts](file:///d:/khaled/nile_link_website-main/app/api/admin/staff/route.ts):
   - Ensure role check allows both `"super_admin"` and authorized managers.
   - Return clean error messages if validation fails.
3. In [cred.md](file:///d:/khaled/nile_link_website-main/cred.md):
   - Add dedicated section for **Manager Super-Admin Account**.
4. In [components/admin/staff/StaffManagementView.tsx](file:///d:/khaled/nile_link_website-main/components/admin/staff/StaffManagementView.tsx):
   - Verify modal opens smoothly and refreshes the employee list upon creation.

---

## Small Tasks

- [x] Inspect `autoSeedIfEmpty()` in `app/api/auth/login/route.ts`.
- [x] Add `manager@nilelink.com` account seeding logic.
- [x] Update `cred.md` with Manager credentials and role description.
- [x] Verify `GET /api/admin/staff` returns existing staff members when called by a manager.
- [x] Verify `POST /api/admin/staff` successfully creates a new employee account.
- [x] Test signing in with the newly created employee account.
- [x] Test permission restrictions: ensure an employee with `canReviewDocuments: false` is blocked from verifying documents.

---

## Edge Cases

- **Duplicate Email**: Attempting to create an employee with an existing email returns HTTP 409 with a friendly error message.
- **Weak Password**: Employee creation form enforces minimum 8 characters.

---

## Testing Checklist

- [x] Sign in with `manager@nilelink.com` / `Manager2026!` succeeds.
- [x] Manager can view the Staff Management table at `/admin/staff`.
- [x] Manager creates a new employee account -> returns HTTP 201/200.
- [x] New employee can log in immediately.
- [x] Regular staff members are prevented from creating new staff accounts.

---

## Acceptance Criteria

- A Manager Super-Admin account is available and documented in `cred.md`.
- Manager can create employee accounts with customizable permissions via the UI.

---

## Dependencies

- [Task 01 — Document Review Engine Resilience & Error 500 Fixes](file:///d:/khaled/nile_link_website-main/tasks/task_01_document_review_resilience_and_error_fixes.md)

---

## AI_MAP Impact

- `AI_MAP/01_SYSTEM_OVERVIEW.md`
- `AI_MAP/07_FEATURES.md`
- `cred.md`
