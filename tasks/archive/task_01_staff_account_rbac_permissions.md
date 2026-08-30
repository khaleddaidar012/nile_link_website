# Task 01 — Staff Account Management & Granular Role-Based Access Control (RBAC)

## Overview

- **What this feature does**: Enables the Admin Manager (`super_admin` / manager) to create, manage, and assign granular permissions to employee (`staff`) accounts.
- **What problem it solves**: Currently, all staff users share generic access without role segregation or fine-grained capabilities.
- **Why it is needed**: Fulfills Requirement 1 of `needs.md`: allows managers to delegate specific operational responsibilities (e.g. only document reviewers can approve files, only customer managers can activate/freeze accounts, only support agents can broadcast alerts).
- **How it fits into the existing system**: Extends the `User` schema with a `staffPermissions` object, integrates with JWT session decoding, and provides a dedicated `/admin/staff` management dashboard.

---

## Requirements

1. **Manager Privilege**: Only `super_admin` / manager accounts can view the staff management panel, create new employee accounts, update permissions, or toggle employee active/suspended status.
2. **Granular Permissions Matrix**:
   - `canSendAlerts` (boolean): Authorizes employee to trigger manual client alerts, send broadcasts, and run expiry reminders.
   - `canReviewDocuments` (boolean): Authorizes employee to approve, reject, and edit document metadata (issue date, expiry date, category, title).
   - `canManageCustomers` (boolean): Authorizes employee to activate, suspend, or update customer account statuses and document quotas.
3. **Staff Creation Form**: Manager can input First Name, Last Name, Corporate Email, Phone Number, Password, and select granular permission checkboxes.
4. **Security & Session Enforcement**: Middleware and API routes verify specific staff permissions before executing sensitive operations (returns `403 Forbidden` if unauthorized).

---

## Current Implementation

- `lib/models/User.ts` defines `role: "customer" | "customer_admin" | "staff" | "super_admin"`.
- `lib/auth/token-service.ts` signs JWT tokens containing `id`, `email`, `role`, and `name`.
- Currently, no dedicated `/admin/staff` page or `staffPermissions` subdocument exists in the `User` schema.

---

## Files / Modules Affected

- **Models**:
  - `lib/models/User.ts` (Add `staffPermissions` sub-schema)
- **Authentication & Middleware**:
  - `lib/auth/token-service.ts` (Include `staffPermissions` in `JWTPayload`)
  - `lib/auth/require-permission.ts` (Helper to assert specific permission in API handlers)
- **Backend APIs**:
  - `app/api/admin/staff/route.ts` (GET all staff, POST create staff)
  - `app/api/admin/staff/[id]/route.ts` (PATCH update permissions/status, DELETE staff)
- **Frontend Pages & Components**:
  - `app/[locale]/admin/staff/page.tsx` (Staff Management Dashboard)
  - `components/admin/staff/StaffTable.tsx` (Staff Directory Table)
  - `components/admin/staff/CreateStaffModal.tsx` (Add New Employee Modal)
  - `components/admin/staff/EditPermissionsModal.tsx` (Granular RBAC Modal)
  - `components/admin/AdminSidebar.tsx` (Add "Staff Management" nav item visible only to managers)

---

## Data / Architecture Changes

### Database Schema Updates (`User.ts`)
```typescript
export interface IStaffPermissions {
  canSendAlerts: boolean
  canReviewDocuments: boolean
  canManageCustomers: boolean
}

// In IUser:
staffPermissions?: IStaffPermissions
```

### New API Endpoints
- `GET /api/admin/staff`: Returns list of all employee accounts with their live permissions.
- `POST /api/admin/staff`: Creates a new staff member with hashed password and assigned permissions.
- `PATCH /api/admin/staff/[id]`: Updates employee permissions or status (`active` / `suspended`).
- `DELETE /api/admin/staff/[id]`: Deactivates or removes a staff account.

---

## UI / UX Changes

- **Staff Management Page (`/admin/staff`)**:
  - Top action bar with "Add Employee" button, search input, and role statistics.
  - Interactive table displaying Name, Email, Phone, Status badge, Permission badges, and Action buttons (Edit Permissions, Suspend, Reset Password).
- **Create Staff Modal**:
  - Clean form with input fields and a permission toggle card matrix with icons for each permission.
- **Permission Denied States**:
  - If a staff member without `canReviewDocuments` attempts to access review actions, a polite warning dialog appears indicating lack of authorization.

---

## Implementation Plan

1. **Schema & Auth Update**:
   - Add `staffPermissions` subdocument to `lib/models/User.ts` with default fallback permissions.
   - Update `token-service.ts` and `getServerSession()` to carry `staffPermissions`.
2. **Backend API Development**:
   - Create `app/api/admin/staff/route.ts` and `app/api/admin/staff/[id]/route.ts`.
   - Add validation with Zod and authorization check requiring `session.role === 'super_admin'`.
3. **Frontend Component Creation**:
   - Build `CreateStaffModal.tsx`, `EditPermissionsModal.tsx`, and `StaffTable.tsx`.
   - Build `app/[locale]/admin/staff/page.tsx`.
4. **Navigation Integration**:
   - Add "Staff & Roles" link to `AdminSidebar.tsx` for manager roles.
5. **Localization**:
   - Add translation strings in all 7 message files (`messages/*.json`).

---

## Small Tasks

- [x] Update `lib/models/User.ts` to add `IStaffPermissions` schema (`canSendAlerts`, `canReviewDocuments`, `canManageCustomers`).
- [x] Update `lib/auth/token-service.ts` to encode `staffPermissions` into JWT payload.
- [x] Create `lib/auth/require-permission.ts` utility for route-level authorization guards.
- [x] Create `app/api/admin/staff/route.ts` with `GET` and `POST` handlers.
- [x] Create `app/api/admin/staff/[id]/route.ts` with `PATCH` and `DELETE` handlers.
- [x] Build `components/admin/staff/CreateStaffModal.tsx` with permission checkboxes.
- [x] Build `components/admin/staff/EditPermissionsModal.tsx` for modifying active permissions.
- [x] Build `components/admin/staff/StaffTable.tsx` with live status toggles and permission pills.
- [x] Build `app/[locale]/admin/staff/page.tsx` integrating header, stats, and table.
- [x] Add "Staff & Roles" navigation item in `components/admin/AdminSidebar.tsx`.
- [x] Add translation keys for staff management in `messages/ar.json`, `en.json`, and all other locales.

---

## Edge Cases

- Manager attempting to remove their own `super_admin` permissions (must be prevented).
- Duplicate email registration for staff (must return clear 409 Conflict error).
- Suspended staff trying to log in (must be blocked by auth handler).
- Staff accessing API routes directly without proper permission flag (must return 403 Forbidden).

---

## Testing Checklist

- [ ] Verify only `super_admin` can create staff accounts and modify permissions.
- [ ] Verify newly created staff can log in using their credentials.
- [ ] Verify staff with `canReviewDocuments: false` cannot verify or reject documents.
- [ ] Verify staff with `canManageCustomers: false` cannot change customer account status.
- [ ] Verify staff with `canSendAlerts: false` cannot trigger customer broadcasts.
- [ ] Verify permission updates take effect on subsequent requests.
- [ ] Verify responsiveness and RTL alignment in Arabic.

---

## Acceptance Criteria

- Manager can create, inspect, edit permissions for, and suspend staff accounts.
- Granular permissions are enforced on all corresponding backend operations.
- UI works seamlessly across all screen sizes and languages.

---

## Dependencies

Depends on:
- None (Foundational Task)
