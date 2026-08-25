# Task: Authentication Backend, Session Architecture & Security

Status: in_progress
Priority: high

## 1. Overview & Scope

Design and implement the complete authentication engine and security subsystem for the NileLink platform using Next.js App Router route handlers, `jose` JWT tokens, HTTP-only secure cookies, password hashing (Bcrypt/Argon2), refresh token rotation, Role-Based Access Control (RBAC) guards, and rate-limiting defenses.

---

## 2. Master Subtask Checklist

- [x] Subtask 01 — Password Hashing & Crypto Security Service
- [x] Subtask 02 — JWT Session & Token Management Engine (`jose`)
- [x] Subtask 03 — Customer Registration API Route (`/api/auth/register`)
- [x] Subtask 04 — Multi-Role Login API Route (`/api/auth/login`)
- [x] Subtask 05 — Logout & Session Invalidation API (`/api/auth/logout`)
- [x] Subtask 06 — Current User Profile API (`/api/auth/me`)
- [x] Subtask 07 — Password Reset Lifecycle APIs (`/api/auth/forgot-password` & `/api/auth/reset-password`)
- [x] Subtask 08 — Email Verification API (`/api/auth/verify-email`)
- [x] Subtask 09 — RBAC Route Protection & Middleware Auth Guard
- [x] Subtask 10 — API Rate Limiting & Brute Force Defense

---

## 3. Subtask Details

### Subtask 01 — Password Hashing & Crypto Security Service

#### Objective
Build a cryptographic utility for hashing and verifying passwords, generating secure random hex tokens for password resets and email verifications, and validating password complexity rules.

#### Why it is needed
Prevents plain-text password exposure, complies with industry cryptographic standards, and supports secure tokenized email workflows.

#### Where it should be implemented
`lib/auth/password.ts`

#### Expected Result
- `hashPassword(password: string): Promise<string>` using Bcrypt with salt rounds ≥ 12 (or Argon2id).
- `verifyPassword(password: string, hash: string): Promise<boolean>` with constant-time comparison to prevent timing attacks.
- `generateSecureToken(bytes?: number): string` generating cryptographic random hex strings.
- Password complexity validation: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.

#### Dependencies
- Node.js `crypto` or `bcryptjs`

#### Acceptance Criteria
- Valid passwords hash correctly and verify accurately.
- Invalid passwords fail verification with zero unhandled exceptions.
- Constant-time comparison ensures resistance to timing analysis.

---

### Subtask 02 — JWT Session & Token Management Engine (`jose`)

#### Objective
Build a token management library using `jose` to issue, verify, and refresh stateless JWT access tokens and refresh tokens stored in HTTP-only, `SameSite=Lax`, `Secure` cookies.

#### Why it is needed
Enables secure, scalable session persistence across Next.js server components, route handlers, and middleware without server-side memory leaks.

#### Where it should be implemented
`lib/auth/token-service.ts`

#### Expected Result
- `createAccessToken(payload: UserJWTPayload): Promise<string>` with 1-hour expiration.
- `createRefreshToken(payload: UserJWTPayload): Promise<string>` with 7-day expiration.
- `verifyToken(token: string): Promise<UserJWTPayload | null>`.
- `setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string, rememberMe?: boolean): void`.
- `clearAuthCookies(response: NextResponse): void`.
- `getAuthSessionFromCookies(cookieStore: ReadonlyRequestCookies): Promise<UserJWTPayload | null>`.

#### Dependencies
- `jose`
- `next/headers`

#### Acceptance Criteria
- Tokens carry `userId`, `email`, `role`, `customerId`, and `accountStatus`.
- Expired tokens return `null` or throw caught validation errors.
- Cookies configured with `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: "lax"`, and `path: "/"`.

---

### Subtask 03 — Customer Registration API Route (`/api/auth/register`)

#### Objective
Create the public registration API route handling user sign-up, customer company creation, input validation via Zod, and dispatching verification emails.

#### Why it is needed
Allows new shipping and logistics clients to create accounts on the NileLink platform.

#### Where it should be implemented
`app/api/auth/register/route.ts`

#### Expected Result
- Validates request payload: `firstName`, `lastName`, `email`, `password`, `companyName`, `commercialRegisterNumber`, `taxCardNumber`, `phone`.
- Checks for existing user email and existing commercial register number.
- In a MongoDB transaction (or sequential fallback):
  1. Creates `Customer` record with `accountStatus: "warning"` (pending document submission).
  2. Hashes password and creates `User` record with role `"customer_admin"` linked to the new `Customer`.
  3. Generates email verification token.
  4. Dispatches verification email.
- Returns HTTP 201 with sanitized user summary (omitting password hash).

#### Dependencies
- Subtask 01 (`password.ts`)
- Subtask 02 (`token-service.ts`)
- `01-database-schema-models.md` (`User`, `Customer`)
- `zod`

#### Acceptance Criteria
- Rejects duplicate email or CR number with clear HTTP 409 error.
- Validates all input fields against strict Zod schema.
- Password hash is never exposed in response.

---

### Subtask 04 — Multi-Role Login API Route (`/api/auth/login`)

#### Objective
Create the unified login route supporting Customers, Staff, and Administrators with identifier login (Email or Username), password verification, account status checks, and session cookie issuance.

#### Why it is needed
Central authentication gateway for all user types.

#### Where it should be implemented
`app/api/auth/login/route.ts`

#### Expected Result
- Accepts `{ identifier, password, rememberMe }`.
- Looks up user by lowercase email OR username.
- Verifies password hash.
- Checks user account status: if `suspended`, returns HTTP 403; if `pending_verification`, prompts to verify email.
- Generates access & refresh tokens and attaches them to `NextResponse` cookies.
- Updates `lastLoginAt` timestamp in database.
- Returns HTTP 200 with `{ user: { id, email, role, customerId, firstName, lastName } }`.

#### Dependencies
- Subtask 01 (`password.ts`)
- Subtask 02 (`token-service.ts`)
- `01-database-schema-models.md` (`User`)

#### Acceptance Criteria
- Invalid credentials return generic HTTP 401 "Invalid email or password" error.
- Login works for all valid roles (`customer`, `customer_admin`, `staff`, `super_admin`).
- Sets HTTP-only cookies properly.

---

### Subtask 05 — Logout & Session Invalidation API (`/api/auth/logout`)

#### Objective
Create the logout endpoint that clears authentication cookies and terminates user session.

#### Why it is needed
Allows users to securely end their sessions across shared or public terminals.

#### Where it should be implemented
`app/api/auth/logout/route.ts`

#### Expected Result
- Clears `nilelink_access_token` and `nilelink_refresh_token` cookies with expired `Max-Age=0`.
- Returns HTTP 200 `{ success: true, message: "Logged out successfully" }`.

#### Dependencies
- Subtask 02 (`token-service.ts`)

#### Acceptance Criteria
- Subsequent requests with previous cookies fail authentication immediately.

---

### Subtask 06 — Current User Profile API (`/api/auth/me`)

#### Objective
Create an authenticated endpoint to retrieve current user session data, associated company data, and permission privileges.

#### Why it is needed
Powers client-side UI state, layout user avatars, company titles, and RBAC visibility flags.

#### Where it should be implemented
`app/api/auth/me/route.ts`

#### Expected Result
- Reads session from request cookies.
- Populates `User` and `Customer` records.
- Returns `{ user, customer, permissions }`.
- Returns HTTP 401 if unauthenticated.

#### Dependencies
- Subtask 02 (`token-service.ts`)
- `01-database-schema-models.md`

#### Acceptance Criteria
- Responds in < 50ms with cached or direct MongoDB lookup.
- Sensitive fields (`passwordHash`, reset tokens) strictly excluded.

---

### Subtask 07 — Password Reset Lifecycle APIs

#### Objective
Implement `/api/auth/forgot-password` (token generation & email delivery) and `/api/auth/reset-password` (token verification & password update).

#### Why it is needed
Provides self-service password recovery for customers and staff.

#### Where it should be implemented
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`

#### Expected Result
- **Forgot Password**: Accepts email, generates 1-hour expiring reset token, stores hash in DB, triggers reset email. Always returns 200 (to prevent email enumeration).
- **Reset Password**: Accepts token and new password, verifies token validity and expiration, hashes new password, clears reset token, invalidates existing sessions.

#### Dependencies
- Subtask 01 (`password.ts`)
- `01-database-schema-models.md` (`User`)

#### Acceptance Criteria
- Expired or manipulated tokens rejected with HTTP 400.
- Password successfully updated and verified on next login.

---

### Subtask 08 — Email Verification API (`/api/auth/verify-email`)

#### Objective
Implement email verification route that validates token sent to user's inbox and marks `emailVerified: true` and `status: "active"`.

#### Why it is needed
Ensures registered emails are authentic and reachable for document expiry notices.

#### Where it should be implemented
`app/api/auth/verify-email/route.ts`

#### Expected Result
- Validates token against database.
- Marks `emailVerified = true`, `status = "active"`, clears verification token.
- Returns success response or redirects to login page with verified notice.

#### Dependencies
- `01-database-schema-models.md` (`User`)

#### Acceptance Criteria
- Token cannot be reused once verified.

---

### Subtask 09 — RBAC Route Protection & Middleware Auth Guard

#### Objective
Extend Next.js `middleware.ts` and create backend route guard utilities to enforce role-based access control across Customer Portal (`/[locale]/portal/*`) and Admin Portal (`/[locale]/admin/*`).

#### Why it is needed
Prevents unauthorized access and privilege escalation (e.g. Customers accessing Admin portal or Customers accessing another client's data).

#### Where it should be implemented
- `middleware.ts`
- `lib/auth/rbac-guard.ts`

#### Expected Result
- `requireRole(allowedRoles: Role[])` server helper.
- Middleware intercepts `/portal/*` and verifies customer/staff session; redirects unauthenticated requests to `/login?callbackUrl=...`.
- Middleware intercepts `/admin/*` and strictly restricts to `staff` or `super_admin`; redirects customers to `/portal` with 403 notice.
- Existing marketing routes (`/`, `/services`, `/about`, `/contact`, `/request-quote`) pass through unrestricted.

#### Dependencies
- Subtask 02 (`token-service.ts`)
- `middleware.ts`

#### Acceptance Criteria
- Unauthenticated access to `/portal/documents` redirects to `/login`.
- Customer access to `/admin/customers` returns 403 or redirects to `/portal`.
- Staff access to `/admin` succeeds.
- Public routes remain publicly accessible.

---

### Subtask 10 — API Rate Limiting & Brute Force Defense

#### Objective
Implement an in-memory / KV rate limiter for authentication endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`).

#### Why it is needed
Protects login and password recovery endpoints against credential stuffing and brute force dictionary attacks.

#### Where it should be implemented
`lib/auth/rate-limiter.ts`

#### Expected Result
- IP-based and identifier-based rate limiting (max 5 failed login attempts per IP/account per 15 minutes).
- Returns HTTP 429 "Too Many Requests" with `Retry-After` header when limit exceeded.

#### Dependencies
- None

#### Acceptance Criteria
- Repeated failed logins trigger 429 response after threshold.
- Successful logins reset counter.

---

## 4. Edge Cases & Handling

1. **Token Expiration During Active Usage**: If access token expires but refresh token is valid, middleware/API client automatically exchanges refresh token for a new access token seamlessly.
2. **Email Enumeration Mitigation**: `/api/auth/forgot-password` always returns a generic success message regardless of whether the email exists.
3. **Session Invalidation on Role Change**: When a user's role or status is updated in DB, old JWT claims are invalidated on next refresh cycle.

---

## 5. Regression Requirements

- Must NOT break the existing `ANALYTICS_SECRET` or analytics verification session in `lib/auth/session.ts` (can coexist or integrate gracefully).
- Public marketing routes must not suffer any performance degradation from auth middleware.

---

## 6. Acceptance Criteria Summary

- [ ] All 8 authentication API routes created and functional.
- [ ] JWT tokens issued and verified using `jose` via HTTP-only cookies.
- [ ] RBAC middleware protects `/portal/*` and `/admin/*` routes strictly.
- [ ] Rate limiter blocks brute force attempts on `/api/auth/login`.
- [ ] Password reset and email verification lifecycles validated.
