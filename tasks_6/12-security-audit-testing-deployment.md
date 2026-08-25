# Task: Security Audit, End-to-End Testing & Production Deployment

Status: pending
Priority: high

## 1. Overview & Scope

Execute comprehensive security audits, end-to-end integration and load testing (including 20-document upload stress tests, RBAC privilege separation, and expiry engine validation), mobile touch responsiveness verification, environment configuration hardening, and Cloudflare OpenNext / MongoDB production deployment readiness.

---

## 2. Master Subtask Checklist

- [ ] Subtask 01 — Authentication & RBAC Security Audit
- [ ] Subtask 02 — Multi-File 20-Document Upload Load & Stress Testing
- [ ] Subtask 03 — Expiry Engine & Account Status Calculation Verification
- [ ] Subtask 04 — Multi-Channel Notification Delivery & Deduplication Testing
- [ ] Subtask 05 — Mobile Touch & Responsive UX Audit (Android / iOS)
- [ ] Subtask 06 — Arabic RTL & English LTR Linguistic & Visual Audit
- [ ] Subtask 07 — Production Environment Variables Validation Schema
- [ ] Subtask 08 — MongoDB Indexes & Cloudflare OpenNext Deployment Readiness

---

## 3. Subtask Details

### Subtask 01 — Authentication & RBAC Security Audit

#### Objective
Conduct a thorough security review of all authentication endpoints, route guards, cookie attributes, password reset lifecycles, and privilege escalation vulnerabilities.

#### Why it is needed
Guarantees that sensitive corporate and maritime shipping data cannot be accessed by unauthorized entities or cross-tenant leaks.

#### Where it should be implemented
- Security test suite: `tests/security/auth-rbac.test.ts`
- `middleware.ts`

#### Expected Result
- Verification test cases:
  1. **Unauthenticated Access**: Direct HTTP requests to `/portal/*` or `/admin/*` without cookies return 401/302 redirects.
  2. **Privilege Escalation**: Customer user session attempting to call `/api/admin/*` returns HTTP 403 Forbidden.
  3. **Cross-Tenant Isolation (IDOR)**: Customer A attempting to access or download Customer B's document by ID receives 403/404.
  4. **Cookie Security**: Auth cookies have `HttpOnly`, `Secure`, and `SameSite=Lax` flags enabled.
  5. **Brute Force Defense**: 6 failed logins from same IP trigger HTTP 429 Too Many Requests.

#### Dependencies
- `02-auth-backend-security.md`

#### Acceptance Criteria
- 100% pass rate on all security isolation tests.
- Zero IDOR vulnerabilities across document and request endpoints.

---

### Subtask 02 — Multi-File 20-Document Upload Load & Stress Testing

#### Objective
Validate the document upload subsystem under heavy load: uploading 20 distinct PDF and image files simultaneously up to the maximum 10MB per file limit.

#### Why it is needed
Ensures the server, storage layer, and client UI handle maximum quota batches without crashing, dropping files, or running out of memory.

#### Where it should be implemented
`tests/e2e/document-upload.spec.ts`

#### Expected Result
- Automated test script simulating:
  1. Staging 20 files (total ~50MB payload).
  2. Monitoring 20 individual progress bars and aggregate progress bar.
  3. Verifying all 20 records created in MongoDB with `pending_review` status.
  4. Attempting to upload a 21st file: verifying immediate rejection with `"Quota of 20 documents reached"` message.
  5. Simulating a network disconnect on 1 file: verifying retry button successfully uploads only the failed file.

#### Dependencies
- `05-customer-document-upload-management.md`

#### Acceptance Criteria
- Upload of 20 files completes with 100% integrity.
- Quota ceiling strictly enforced.

---

### Subtask 03 — Expiry Engine & Account Status Calculation Verification

#### Objective
Test the Document Expiry Detection Engine and Customer Account Health Engine against boundary test cases (leap years, exact expiration day, partial document approvals).

#### Why it is needed
Guarantees business logic precision for legal compliance and automated account transitions.

#### Where it should be implemented
`tests/unit/account-health-engine.test.ts`

#### Expected Result
- Test matrix:
  - **Case 1**: Customer with 4 approved docs (expiry in 90 days) → `Active` 🟢.
  - **Case 2**: Customer with 3 approved docs and 1 doc expiring in 8 days → `Warning` 🟡 (`"Commercial Registration expires in 8 days"`).
  - **Case 3**: Customer with 3 approved docs and 1 doc expired yesterday → `Inactive` 🔴 (`"Tax Card expired"`).
  - **Case 4**: Customer with 1 rejected doc → `Inactive` 🔴.
  - **Case 5**: Customer renews expired doc (new doc enters `pending_review`) → Transitions from `Inactive` to `Warning` pending review.

#### Dependencies
- `07-document-review-verification-engine.md`
- `08-expiry-detection-progressive-warnings.md`

#### Acceptance Criteria
- All state transitions evaluate correctly and deterministically.

---

### Subtask 04 — Multi-Channel Notification Delivery & Deduplication Testing

#### Objective
Verify that automated 10-day warnings, escalation tiers (7d, 3d, 1d, expired), and manual staff triggers dispatch through Email and WhatsApp without duplication.

#### Why it is needed
Prevents embarrassing email loops or duplicate WhatsApp messages sent to high-value corporate clients.

#### Where it should be implemented
`tests/unit/notification-deduplication.test.ts`

#### Expected Result
- Tests verify:
  1. Running the expiry cron twice in the same hour generates only ONE email per document.
  2. Urgent (3-day) notifications correctly trigger WhatsApp API dispatch.
  3. Manual staff warning modal records actor ID and creates audit log entry.
  4. WhatsApp webhook updates delivery status to `delivered` in database.

#### Dependencies
- `09-notification-system-email-whatsapp.md`

#### Acceptance Criteria
- Anti-spam deduplication logic blocks repeat dispatches within 24-hour window.

---

### Subtask 05 — Mobile Touch & Responsive UX Audit (Android / iOS)

#### Objective
Audit the entire Customer Portal and Admin Portal across mobile screen sizes (360px, 390px, 412px width) on mobile Safari and Chrome.

#### Why it is needed
Fulfills Module 19 requirement for a mobile experience close to a native Android app.

#### Where it should be implemented
- Mobile test suite / Playwright viewport tests
- CSS adjustments across `components/portal/*` and `components/admin/*`

#### Expected Result
- Touch targets ≥ 48px for all buttons and interactive elements.
- Bottom navigation bar fixed cleanly with safe-area bottom padding.
- Document tables switch to stacked mobile card layouts smoothly.
- Zero horizontal scrolling on all mobile screens.

#### Dependencies
- `04-customer-portal-layout-dashboard.md`

#### Acceptance Criteria
- Mobile usability score 100/100 on Lighthouse / mobile audit tools.

---

### Subtask 06 — Arabic RTL & English LTR Linguistic & Visual Audit

#### Objective
Perform a full visual and linguistic inspection of all portal screens, modals, tables, toasts, and email templates in both Arabic (RTL) and English (LTR).

#### Why it is needed
Ensures high-level linguistic presentation and layout balance for Egyptian and international shipping clients.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- All icons (arrows, chevrons, badges) flip direction appropriately in RTL mode.
- Arabic typography uses crisp corporate Arabic font rendering.
- Zero untranslated keys (e.g. `auth.login.title` raw strings) visible anywhere in the UI.

#### Dependencies
- `03-public-navigation-auth-ui.md`
- `04-customer-portal-layout-dashboard.md`
- `06-employee-admin-portal-core.md`

#### Acceptance Criteria
- 100% dictionary key parity between `messages/ar.json` and `messages/en.json`.

---

### Subtask 07 — Production Environment Variables Validation Schema

#### Objective
Create a strict environment variable validation utility using Zod that runs at build/start time to ensure all required production secrets are configured.

#### Why it is needed
Prevents runtime deployment crashes due to missing database URLs, JWT secrets, SMTP credentials, or storage buckets.

#### Where it should be implemented
`lib/env.ts`

#### Expected Result
- Validates:
  - `MONGODB_URI` (MongoDB connection string)
  - `JWT_SECRET` / `AUTH_SECRET` (minimum 32 characters)
  - `CRON_SECRET` (secure token for automated background jobs)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
  - `NEXT_PUBLIC_APP_URL`
- Throws clear error at server startup if critical variables are missing in production.

#### Dependencies
- `zod`

#### Acceptance Criteria
- Safe fallback defaults provided for local development environments.

---

### Subtask 08 — MongoDB Indexes & Cloudflare OpenNext Deployment Readiness

#### Objective
Ensure all database indexes are built, execute the production build pipeline (`npm run build` and `npm run cf-build`), and verify Cloudflare Workers / OpenNext bundle compatibility.

#### Why it is needed
Guarantees seamless deployment to Cloudflare / production servers without runtime exceptions or slow database queries.

#### Where it should be implemented
- `scripts/build-db-indexes.ts`
- `open-next.config.ts`
- `package.json`

#### Expected Result
- Script to create compound indexes on MongoDB collections (`User`, `Customer`, `Document`, `Notification`).
- `npm run build` succeeds with zero TypeScript errors or ESLint warnings.
- Cloudflare OpenNext edge runtime compatibility verified.

#### Dependencies
- `01-database-schema-models.md`
- `package.json`

#### Acceptance Criteria
- Clean production build with zero type errors.
- Document queries with expiry filters execute in < 10ms on indexed MongoDB collections.

---

## 4. Edge Cases & Handling

1. **Edge Runtime Incompatibility**: For Node-specific modules (`nodemailer`, `crypto`, `fs`), ensure they are restricted to Node.js server runtime handlers rather than Edge functions.
2. **MongoDB Connection Limits on Serverless**: Use singleton Mongoose caching (`lib/mongodb.ts`) with appropriate connection pool limits (`maxPoolSize: 10`) to prevent connection exhaustion during traffic spikes.

---

## 5. Regression Requirements

- Must NOT break the public marketing website build.
- Must preserve existing `opennextjs-cloudflare` build workflows.

---

## 6. Acceptance Criteria Summary

- [ ] Security audit passes with zero IDOR or privilege escalation bugs.
- [ ] 20-document upload load test passes with 100% file integrity.
- [ ] Expiry detection and customer health status state machine validated.
- [ ] Mobile touch UX verified with 48px+ targets and zero horizontal overflow.
- [ ] Arabic RTL and English LTR translations complete with 0 missing keys.
- [ ] Production build succeeds cleanly.
