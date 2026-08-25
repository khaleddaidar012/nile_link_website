# Task: Centralized API Client, Real-Time Synchronization & UI Design Tokens

Status: pending
Priority: high

## 1. Overview & Scope

Design and implement the Centralized API Client Layer, HTTP interceptors with auto-refresh token handling, global Sonner toast and error management, optimistic UI updates, Customer ↔ Admin bidirectional workflow synchronization, and the shared Design System component tokens (Modals, Tables, Status Badges, Skeletons, Loaders, Empty States).

---

## 2. Master Subtask Checklist

- [ ] Subtask 01 — Centralized Typed API Client & HTTP Interceptors (`lib/api/api-client.ts`)
- [ ] Subtask 02 — Automatic Token Refresh Interceptor & Session Recovery
- [ ] Subtask 03 — Global Error Boundary & Standardized API Error Parser
- [ ] Subtask 04 — Sonner Toast Notification Provider & System Feedback
- [ ] Subtask 05 — Customer ↔ Admin Real-Time Synchronization Pattern
- [ ] Subtask 06 — Shared UI Design System Component Tokens (Buttons, Badges, Modals, Loaders)
- [ ] Subtask 07 — Skeleton Loaders, Empty States & Error States
- [ ] Subtask 08 — Tailwind CSS v4 Theme Consistency & Design System Tokens

---

## 3. Subtask Details

### Subtask 01 — Centralized Typed API Client & HTTP Interceptors

#### Objective
Build a robust, typed HTTP API client wrapper over native `fetch` with standard request/response interceptors, automatic JSON serialization, base URL resolution, and timeout management.

#### Why it is needed
Eliminates boilerplate, standardizes request headers, and ensures uniform error handling across all client portal and admin pages.

#### Where it should be implemented
`lib/api/api-client.ts`

#### Expected Result
- Methods: `apiClient.get<T>(url, options)`, `apiClient.post<T>(url, body, options)`, `apiClient.put<T>(url, body, options)`, `apiClient.patch<T>(url, body, options)`, `apiClient.delete<T>(url, options)`.
- Automatically attaches `Content-Type: application/json` unless body is `FormData`.
- Automatically attaches credentials (`credentials: "include"`) for cookie forwarding.
- Configurable timeout (default 15 seconds) using `AbortController`.

#### Dependencies
- None (native `fetch`)

#### Acceptance Criteria
- Fully typed responses with generic return types `<T>`.
- Properly handles network timeouts and abort signals.

---

### Subtask 02 — Automatic Token Refresh Interceptor & Session Recovery

#### Objective
Implement an automatic token refresh interceptor inside the API client that transparently exchanges an expired access token using the refresh token when an HTTP 401 is encountered, and retries the failed request.

#### Why it is needed
Prevents disruptive session dropouts while a user is actively filling out forms or reviewing documents.

#### Where it should be implemented
`lib/api/token-refresh-interceptor.ts`

#### Expected Result
- Intercepts 401 Unauthorized responses.
- Enqueues pending requests while a single refresh request (`/api/auth/refresh`) is executed.
- On refresh success: Retries the queued original requests with new cookies.
- On refresh failure: Clears session and redirects user to `/login?sessionExpired=true`.

#### Dependencies
- `02-auth-backend-security.md`

#### Acceptance Criteria
- Multiple simultaneous 401s trigger only a single refresh request.
- Transparent recovery without user-facing errors.

---

### Subtask 03 — Global Error Boundary & Standardized API Error Parser

#### Objective
Build a standard error parser utility and React Error Boundary component to catch unhandled runtime errors, API errors, and validation errors gracefully.

#### Why it is needed
Prevents white-screen crashes and provides clear, actionable feedback to users.

#### Where it should be implemented
- `lib/api/error-parser.ts`
- `components/shared/PortalErrorBoundary.tsx`

#### Expected Result
- `parseApiError(error: unknown): { message: string, code?: string, fieldErrors?: Record<string, string> }`.
- Error boundary displays an elegant fallback card: "Something went wrong" with a "Try Again" button and diagnostic error ID.

#### Dependencies
- `react-error-boundary` or custom class boundary

#### Acceptance Criteria
- Renders fallback UI gracefully in both Arabic RTL and English LTR without crashing the outer shell.

---

### Subtask 04 — Sonner Toast Notification Provider & System Feedback

#### Objective
Integrate the `sonner` toast library with the application root layout and create helper utilities for rich success, error, warning, and loading toasts.

#### Why it is needed
Provides immediate, non-intrusive visual feedback for all portal actions (uploads, approvals, edits, warnings sent).

#### Where it should be implemented
- `app/[locale]/layout.tsx`
- `lib/utils/toast.ts`

#### Expected Result
- Toaster component configured with `position: "top-right"` (or `"top-left"` for Arabic RTL), dark/light theme awareness, and rich colors.
- Helper functions: `showSuccessToast(msg)`, `showErrorToast(msg)`, `showWarningToast(msg)`, `showPromiseToast(promise, messages)`.

#### Dependencies
- `sonner`

#### Acceptance Criteria
- Toasts render smoothly with brand colors.
- Automatically adjusts position and icon alignment for RTL layout.

---

### Subtask 05 — Customer ↔ Admin Real-Time Synchronization Pattern

#### Objective
Implement a lightweight polling / event synchronization pattern that refreshes document queues, customer statuses, and badge counters when updates occur across the portal.

#### Why it is needed
Fulfills Module 17 requirement: changes made by employees (e.g. document approved/rejected, status updated) immediately reflect in the customer portal, and new customer uploads immediately increment employee review badges.

#### Where it should be implemented
- `lib/hooks/use-polling-sync.ts`
- `components/portal/PortalContext.tsx`
- `components/admin/AdminContext.tsx`

#### Expected Result
- Hook that listens for document status changes and invalidates React state or SWR/React Query caches.
- Smart interval polling (e.g. every 30s when tab is active, suspended when tab is hidden).
- Triggers instant UI update when window regains focus.

#### Dependencies
- React Hooks (`useEffect`, `useCallback`)

#### Acceptance Criteria
- No performance lag or excessive API spamming.
- Background tabs pause polling automatically.

---

### Subtask 06 — Shared UI Design System Component Tokens

#### Objective
Build the core reusable UI components adhering to NileLink's enterprise maritime design language (inspired by CMA-CGM and MSC).

#### Why it is needed
Ensures 100% visual consistency across all forms, tables, dialogs, and cards.

#### Where it should be implemented
`components/ui/`
- `components/ui/button.tsx` (Variants: Primary, Secondary, Outline, Ghost, Destructive, Subtle)
- `components/ui/modal.tsx` (Accessible dialog with smooth entrance transition)
- `components/ui/data-table.tsx` (Sortable, filterable table container)
- `components/ui/badge.tsx` (Status badges with dot indicators)
- `components/ui/input.tsx` & `components/ui/select.tsx` (Form controls with validation states)

#### Expected Result
- Modular, accessible components styled with Tailwind CSS tokens.
- Support focus rings, disabled states, and hover transitions.

#### Dependencies
- `clsx`, `tailwind-merge`, `lucide-react`, `framer-motion`

#### Acceptance Criteria
- All components support RTL and LTR automatically.
- Accessible keyboard navigation (`Esc` closes modal, `Tab` focuses controls).

---

### Subtask 07 — Skeleton Loaders, Empty States & Error States

#### Objective
Create dedicated skeleton loading states, empty state illustrations, and error fallback cards for every data-fetching view in the portal (Documents table, Dashboard metrics, Customer list, Notifications).

#### Why it is needed
Eliminates layout shifts (CLS) and provides a polished, responsive user experience during data loading.

#### Where it should be implemented
- `components/ui/skeleton.tsx`
- `components/shared/EmptyState.tsx`
- `components/shared/TableSkeleton.tsx`
- `components/shared/MetricCardSkeleton.tsx`

#### Expected Result
- Shimmer animation effect matching current theme (`dark` / `light`).
- Illustrated empty states for: "No Documents Uploaded Yet", "No Notifications", "No Requests Found", "Review Queue Empty".

#### Dependencies
- Tailwind CSS

#### Acceptance Criteria
- Seamless transition between skeleton and loaded content.

---

### Subtask 08 — Tailwind CSS v4 Theme Consistency & Design System Tokens

#### Objective
Harmonize Tailwind CSS v4 color palettes, border radiuses, dark mode styles, and typography tokens across the existing website and new portal modules.

#### Why it is needed
Guarantees visual harmony between the corporate public site and the private portals.

#### Where it should be implemented
- `app/globals.css`

#### Expected Result
- Standardized color palette variables:
  - `--primary`: NileLink Royal Blue (`#0F4C81` / `#1E3A8A`)
  - `--accent`: Cyan / Maritime Gold (`#0EA5E9` / `#F59E0B`)
  - `--success`: Emerald (`#10B981`)
  - `--warning`: Amber (`#F59E0B`)
  - `--urgent`: Orange (`#F97316`)
  - `--critical`: Rose / Crimson (`#E11D48`)
- High contrast, dark mode compatibility for all text and surface layers.

#### Dependencies
- `app/globals.css`

#### Acceptance Criteria
- Dark mode toggle switches color variables instantly without page reload.

---

## 4. Edge Cases & Handling

1. **Slow Network Throttling**: Skeleton loaders remain stable without jumping or flickering when network latency is high.
2. **Offline Status**: API client detects loss of internet connection (`navigator.onLine === false`) and shows an offline warning toast.
3. **Double Click Prevention**: All buttons automatically enter disabled loading state during async operations.

---

## 5. Regression Requirements

- Must NOT break or alter any existing styling in `components/layout/Navbar.tsx` or `components/sections/*`.
- Must NOT override existing Tailwind v4 utilities used by the marketing pages.

---

## 6. Acceptance Criteria Summary

- [ ] Typed API client with automatic token refresh and error parsing operational.
- [ ] Sonner toast notifications wired across all actions.
- [ ] Bidirectional sync pattern maintains state consistency between customer and staff views.
- [ ] Shared UI component library (Buttons, Modals, Tables, Skeletons) complete.
- [ ] Enterprise maritime styling harmonized across light and dark modes.
