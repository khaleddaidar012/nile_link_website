# NileLink Platform — Official Master Test Guide & QA Living Reference

> [!IMPORTANT]
> **MANDATORY INSTRUCTION FOR DEVELOPERS & QA TESTERS**:
> All developers and QA testers **MUST** read this file thoroughly before starting any manual or automated testing session.
> This document is the **Single Source of Truth** for testing the NileLink Maritime & Logistics Platform.
> Whenever you discover an error, bug, or edge-case discrepancy, you **MUST** record it directly in the [Error & Issue Log](#4-error--issue-log) and update the corresponding test case status (`FAIL` / `BLOCKED`). When you resolve an issue, update the status and verify regression before signing off.

---

## Table of Contents
1. [Testing Overview](#1-testing-overview)
2. [Testing Rules & Protocol](#2-testing-rules--protocol)
3. [Phase-by-Phase Testing](#3-phase-by-phase-testing)
   - [Phase 1 — Authentication, Business Email Validation & Real-Time Password Checklist](#phase-1--authentication-business-email-validation--real-time-password-checklist)
   - [Phase 2 — Multi-Channel (WhatsApp & Email) Post-Registration Verification & Skip Dialog Flow](#phase-2--multi-channel-whatsapp--email-post-registration-verification--skip-dialog-flow)
   - [Phase 3 — Portal & Admin Layout Architecture & Header Overlap Fix](#phase-3--portal--admin-layout-architecture--header-overlap-fix)
   - [Phase 4 — Client Dashboard Verification Warning Banners, Quick Actions & 6-Card KPI Metrics](#phase-4--client-dashboard-verification-warning-banners-quick-actions--6-card-kpi-metrics)
   - [Phase 5 — Cloudflare R2 Storage Architecture, Multi-File Animated Upload & Staff Review Pipeline](#phase-5--cloudflare-r2-storage-architecture-multi-file-animated-upload--staff-review-pipeline)
   - [Phase 6 — Enterprise Corporate Profile Hub, Shipments & Services Metrics & Expiration Engine](#phase-6--enterprise-corporate-profile-hub-shipments--services-metrics--expiration-engine)
   - [Phase 7 — Cross-Cutting Systems (RTL/LTR, Themes, Quota, Financials & Audit Logs)](#phase-7--cross-cutting-systems-rtlltr-themes-quota-financials--audit-logs)
4. [Centralized Error & Issue Log](#4-centralized-error--issue-log)
5. [Testing Dashboard & Summary](#5-testing-dashboard--summary)
6. [Regression Testing Strategy & Checklist](#6-regression-testing-strategy--checklist)
7. [Testing History & Changelog](#7-testing-history--changelog)

---

## 1. Testing Overview

### Purpose
This test guide provides a complete, phase-by-phase testing framework for validating the frontend interface, backend API routes, security controls, Cloudflare R2 storage integration, multi-channel verification flows, and compliance workflows of the NileLink Logistics Platform.

### Recommended Testing Order
1. **Phase 1**: Authentication & Form Validation
2. **Phase 2**: Multi-Channel Verification & Skip Flow
3. **Phase 3**: Layout Hierarchy & Viewport Isolation
4. **Phase 4**: Client Dashboard Banners & KPI Cards
5. **Phase 5**: Cloudflare R2 Storage, File Upload & Staff Review
6. **Phase 6**: Corporate Profile, Username Management & Expiry Queue
7. **Phase 7**: Cross-Cutting Capabilities (RTL, Dark Mode, Financials, Audit)

### Test Environment & Prerequisites
- **Local Application URL**: `http://localhost:3000`
- **Supported Browsers**: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge.
- **Database**: MongoDB running locally or via Atlas URI (`MONGODB_URI`).
- **Storage**: Cloudflare R2 configured in `.env.local` (or automatic fallback directory).

### Pre-Configured Test Accounts (from `cred.md`)

| Account Type | Email / Identifier | Password | Role | Primary Route |
| :--- | :--- | :--- | :--- | :--- |
| **Client Portal (Customer Admin)** | `mohamed@alexexport.com` | `SecurePass123!` | `customer_admin` | `/ar/portal` or `/en/portal` |
| **Staff Admin (Customs Inspector)** | `staff@nilelink.com` | `StaffAdmin2026!` | `staff` / `super_admin` | `/ar/admin` or `/en/admin` |

---

## 2. Testing Rules & Protocol

1. **Test Sequentially**: Execute testing phase by phase in numerical order. Do not skip phases.
2. **Immediate Documentation**: Record every bug, layout flaw, or unexpected API response immediately in the [Error & Issue Log](#4-centralized-error--issue-log).
3. **No Silent Skips**: Mark every test case as `PASS`, `FAIL`, `BLOCKED`, or `NOT TESTED`. Do not leave ambiguous checkboxes.
4. **Exact Reproduction Steps**: When a test fails, write reproducible step-by-step instructions with expected vs. actual outcomes.
5. **Multi-Locale Verification**: Always test critical flows in both **Arabic (RTL)** at `/ar/*` and **English (LTR)** at `/en/*`.
6. **Sign-Off Accountability**: Every phase requires a completed sign-off block before release approval.

---

## 3. Phase-by-Phase Testing

---

### Phase 1 — Authentication, Business Email Validation & Real-Time Password Checklist

#### Objective
Verify that user authentication is secure, email/username inputs maintain proper padding without icon collisions, consumer/free webmail domains are blocked in favor of corporate emails, 1-click test cards are absent, and password strength requirements are animated and enforced.

#### Prerequisites
- Application running on `http://localhost:3000`.
- MongoDB connected.

#### Test Cases

### TEST-1-001 — Email and Identifier Input Visual Padding
* [ ] Test completed successfully

**Steps:**
1. Navigate to `http://localhost:3000/en/login` and `http://localhost:3000/ar/login`.
2. Inspect the **"Work Email / Username"** input field.
3. Type a long email address (e.g. `logistics-manager@alexandria-export-group.com`).
4. Switch to Arabic (`/ar/login`) and repeat typing.

**Expected Result:**
In both LTR and RTL modes, text starts comfortably with adequate padding (`pl-10 pr-4` LTR, `pr-10 pl-4` RTL). The leading `Mail` icon never overlaps or obscures any characters.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 
2. 

**Related Task:**
Task 01 (`task_01_auth_validation_credentials.md`)

**Priority:**
* High

---

### TEST-1-002 — 1-Click Developer Test Account Removal
* [ ] Test completed successfully

**Steps:**
1. Open `http://localhost:3000/en/login` and `http://localhost:3000/ar/login`.
2. Review the entire login card, footer, and surrounding layout.
3. Search the page DOM for test credential chips or auto-fill buttons.

**Expected Result:**
No 1-click test credentials buttons, test chips, or developer auto-fill cards exist on the UI. All test credentials are strictly documented in [`cred.md`](file:///d:/khaled/nile_link_website-main/cred.md).

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 01 (`task_01_auth_validation_credentials.md`)

**Priority:**
* Medium

---

### TEST-1-003 — Corporate / Business Email Validation Enforcement
* [ ] Test completed successfully

**Steps:**
1. Navigate to the registration tab at `http://localhost:3000/en/login?tab=register` or `/ar/login?tab=register`.
2. Attempt to register with consumer webmail domains:
   - `user@gmail.com`
   - `test@yahoo.com`
   - `cargo@hotmail.com`
   - `manager@outlook.com`
   - `export@icloud.com`
3. Click **"Create Corporate Account"** / **"إنشاء حساب شركة"**.
4. Now enter a valid corporate email (e.g. `operations@cairofreight-logistics.com`).

**Expected Result:**
Consumer webmail domains are immediately rejected on both frontend and backend with the clear error: *"Please use an official company / corporate work email. Free webmail providers are not permitted."*
Valid corporate domains pass validation smoothly.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 01 (`task_01_auth_validation_credentials.md`)

**Priority:**
* Critical

---

### TEST-1-004 — Real-Time Animated Password Complexity Checklist
* [ ] Test completed successfully

**Steps:**
1. Navigate to the registration tab (`/en/login?tab=register` or `/ar/login?tab=register`).
2. Click inside the **Password** field.
3. Type characters incrementally and observe the checklist below the input:
   - Type `abc` -> only lowercase rule turns green.
   - Type `ABC` -> uppercase rule turns green.
   - Type `123` -> number rule turns green.
   - Type `!@#` -> special character rule turns green.
   - Complete 8+ characters -> 8 character length rule turns green.
4. Observe the password strength progress bar and label transitions (*Weak -> Fair -> Good -> Strong*).

**Expected Result:**
All 5 criteria update in real time with animated Framer Motion checkmarks and color transitions from gray/amber to emerald green. Form submission is disabled until all criteria are satisfied.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 01 (`task_01_auth_validation_credentials.md`)

**Priority:**
* High

---

### TEST-1-005 — Client and Staff Login with Stored Credentials
* [ ] Test completed successfully

**Steps:**
1. Navigate to `http://localhost:3000/en/login`.
2. Log in with Client credentials: `mohamed@alexexport.com` / `SecurePass123!`.
   - Confirm successful login and automatic redirect to `/portal`.
3. Log out via the user pill in `PortalHeader`.
4. Log in with Staff credentials: `staff@nilelink.com` / `StaffAdmin2026!`.
   - Confirm successful login and automatic redirect to `/admin`.

**Expected Result:**
Both roles authenticate cleanly, set secure HTTP-only cookies, and redirect to their respective portal workspaces.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 01 (`task_01_auth_validation_credentials.md`)

**Priority:**
* Critical

---

### Phase 1 Sign-Off

* [ ] All test cases completed
* [ ] No Critical issues
* [ ] No High priority unresolved issues
* [ ] Failed tests documented
* [ ] Regression testing completed
* [ ] Phase approved

**Tester:** ___________________________  
**Date:** _____________________________  
**Final Comment:**  
> 

**Phase Status:** NOT TESTED

---

### Phase 2 — Multi-Channel (WhatsApp & Email) Post-Registration Verification & Skip Dialog Flow

#### Objective
Verify that newly registered corporate accounts are directed to `/portal/verification`, can receive and verify 6-digit OTP codes across WhatsApp and Business Email, can trigger the Skip Confirmation Modal with exact Arabic regulatory warning text, and update database verification flags accurately.

#### Prerequisites
- Phase 1 sign-off.
- Access to `/portal/verification`.

#### Test Cases

### TEST-2-001 — Post-Registration Direct Routing
* [ ] Test completed successfully

**Steps:**
1. Navigate to `http://localhost:3000/ar/login?tab=register`.
2. Complete new company registration using corporate email `test@mediterranean-shipping-egypt.com`.
3. Submit the registration form.

**Expected Result:**
Upon successful account creation, the user is immediately redirected to `http://localhost:3000/ar/portal/verification` (or `/en/portal/verification`).

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 02 (`task_02_registration_verification_flow.md`)

**Priority:**
* Critical

---

### TEST-2-002 — Dual-Channel 6-Digit OTP Verification Flow
* [ ] Test completed successfully

**Steps:**
1. On `/portal/verification`, review the dual verification cards (Business Email & WhatsApp).
2. Click **"إرسال الرمز"** (Send OTP) for Business Email.
   - Enter the 6-digit OTP code into the segmented input blocks.
   - Test paste functionality (pasting all 6 digits at once).
   - Click **"تأكيد الرمز"** (Verify Code).
3. Click **"إرسال الرمز"** (Send OTP) for WhatsApp.
   - Observe the 60-second countdown timer on the resend button.
   - Enter the 6-digit WhatsApp OTP code and click verify.

**Expected Result:**
Both channels verify successfully, update to green verified status badges with checkmarks, update `emailVerified: true` and `whatsappVerified: true` in MongoDB, and show a completion button to proceed to the dashboard.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 02 (`task_02_registration_verification_flow.md`)

**Priority:**
* High

---

### TEST-2-003 — Skip Confirmation Modal with Regulatory Notice
* [ ] Test completed successfully

**Steps:**
1. On `/portal/verification` with at least one unverified channel, click **"تخطي إلى لوحة التحكم"** (Skip to Dashboard).
2. Inspect the opened confirmation modal.
3. Check the warning text and action buttons.
4. Click **"توثيق الآن"** (Verify Now) -> modal closes and focus returns to OTP input.
5. Click **"تخطي إلى لوحة التحكم"** again, then click **"تخطي الآن"** (Skip Now).

**Expected Result:**
Modal prominently displays the exact required Arabic notice:
> *"للتمتع بكامل خدمات المنصة وتفادي تقييد الحساب، يُرجى توثيق WhatsApp والبريد الإلكتروني للعمل"*
*(English: "To enjoy the full range of portal services and avoid account restrictions, please verify your WhatsApp and Business Email.")*
Clicking "تخطي الآن" safely navigates the user to `/portal`.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 02 (`task_02_registration_verification_flow.md`)

**Priority:**
* High

---

### Phase 2 Sign-Off

* [ ] All test cases completed
* [ ] No Critical issues
* [ ] No High priority unresolved issues
* [ ] Failed tests documented
* [ ] Regression testing completed
* [ ] Phase approved

**Tester:** ___________________________  
**Date:** _____________________________  
**Final Comment:**  
> 

**Phase Status:** NOT TESTED

---

### Phase 3 — Portal & Admin Layout Architecture & Header Overlap Fix

#### Objective
Verify that the public marketing website's fixed `Navbar` and `Footer` are completely suppressed inside `/portal/*` and `/admin/*` routes, eliminating the top header overlap bug (`needs.md` Point 7), and ensuring `PortalHeader` and `AdminSidebar` occupy full screen height cleanly.

#### Prerequisites
- Authenticated session for Client or Staff.

#### Test Cases

### TEST-3-001 — Public Navbar Suppression on Client Portal Dashboard
* [ ] Test completed successfully

**Steps:**
1. Navigate to `http://localhost:3000/ar/portal` and `http://localhost:3000/en/portal`.
2. Inspect the top 100px of the viewport.
3. Verify that the public marketing navigation bar (with links like "Home", "About", "Services", "Request Quote") is NOT rendered.
4. Verify that `PortalHeader` sits cleanly at `top: 0` without clipping the title or breadcrumbs.

**Expected Result:**
Public `Navbar` is suppressed (`return null`). `PortalHeader` renders directly at `top: 0` with sticky positioning and proper z-index.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 03 (`task_03_portal_layout_navbar_fix.md`)

**Priority:**
* Critical

---

### TEST-3-002 — Public Footer Suppression & Mobile Bottom Navigation Isolation
* [ ] Test completed successfully

**Steps:**
1. Open developer tools in mobile viewport mode (e.g. iPhone 14 / Pixel 7, 390px width).
2. Navigate to `http://localhost:3000/ar/portal/documents`.
3. Scroll to the bottom of the page.
4. Verify that the public marketing footer is NOT visible.
5. Verify that `MobileBottomNav` is accessible at the bottom and container has `pb-20` padding so content is not obscured.

**Expected Result:**
Public `Footer` is completely suppressed. Mobile bottom navigation bar sits fixed at the bottom with no overlapping text.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 03 (`task_03_portal_layout_navbar_fix.md`)

**Priority:**
* High

---

### TEST-3-003 — Admin Portal Full-Height Layout Integrity
* [ ] Test completed successfully

**Steps:**
1. Log in as Staff Admin and navigate to `http://localhost:3000/en/admin/documents/review` and `/ar/admin`.
2. Inspect the admin layout.

**Expected Result:**
Admin portal renders with its dedicated dark slate sidebar and full-screen workspace with zero interference from public Navbar/Footer.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 03 (`task_03_portal_layout_navbar_fix.md`)

**Priority:**
* High

---

### Phase 3 Sign-Off

* [ ] All test cases completed
* [ ] No Critical issues
* [ ] No High priority unresolved issues
* [ ] Failed tests documented
* [ ] Regression testing completed
* [ ] Phase approved

**Tester:** ___________________________  
**Date:** _____________________________  
**Final Comment:**  
> 

**Phase Status:** NOT TESTED

---

### Phase 4 — Client Dashboard Verification Warning Banners, Quick Actions & 6-Card KPI Metrics

#### Objective
Verify that unverified accounts display a persistent amber alert banner ("لم يتم توثيق الحساب") across portal views, showcase the dedicated quick-action card ("رفع المستندات"), and present the 6-card KPI metrics grid.

#### Prerequisites
- Client account with unverified status (or test toggles).

#### Test Cases

### TEST-4-001 — Unverified Account Amber Alert Banner
* [ ] Test completed successfully

**Steps:**
1. Log in with an account having `whatsappVerified: false` or `emailVerified: false`.
2. Navigate to `http://localhost:3000/ar/portal`.
3. Inspect the top alert banner.

**Expected Result:**
Banner renders with amber warning styling (`border-amber-500/50 bg-amber-500/10`), pulsing `AlertTriangle` icon (with NO green checkmark), heading **"لم يتم توثيق الحساب"** / **"Account Not Verified"**, and action button **"توثيق القنوات الآن"** linking to `/portal/verification`.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 04 (`task_04_dashboard_metrics_verification_alerts.md`)

**Priority:**
* High

---

### TEST-4-002 — Dedicated Quick-Action Document Compliance Card
* [ ] Test completed successfully

**Steps:**
1. On `/portal` for an unverified account, locate the card immediately beneath the warning banner.
2. Verify card heading: **"لم يتم توثيق الحساب بعد برجاء توثيق الحساب"**.
3. Click the primary button **"رفع المستندات"** (*"Upload Documents"*).

**Expected Result:**
Clicking the button routes the user directly to `http://localhost:3000/ar/portal/documents` (or localized `/portal/documents`).

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 04 (`task_04_dashboard_metrics_verification_alerts.md`)

**Priority:**
* High

---

### TEST-4-003 — 6-Card Responsive KPI Metrics Grid
* [ ] Test completed successfully

**Steps:**
1. Navigate to `/ar/portal` and `/en/portal`.
2. Inspect the 6 KPI metric cards:
   - **Card 1: Communication Channels**: Shows "Pending Verification" in amber or "Verified" in emerald.
   - **Card 2: Account Status**: Shows "Active & Compliant" or "Pending Documents".
   - **Card 3: Total Uploaded Files**: Shows slot usage (e.g. `4 / 20`).
   - **Card 4: Active / Approved Docs**: Shows count of verified documents.
   - **Card 5: Documents Under Review**: Shows count of documents in `pending_review` status.
   - **Card 6: Expiring Soon (≤10d)**: Shows urgent count of expiring documents.
3. Click on each card and verify navigation to appropriate sub-pages.

**Expected Result:**
All 6 KPI cards calculate live numbers accurately, support dark mode and hover micro-interactions, and route to corresponding portal sections when clicked.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 04 (`task_04_dashboard_metrics_verification_alerts.md`)

**Priority:**
* Medium

---

### Phase 4 Sign-Off

* [ ] All test cases completed
* [ ] No Critical issues
* [ ] No High priority unresolved issues
* [ ] Failed tests documented
* [ ] Regression testing completed
* [ ] Phase approved

**Tester:** ___________________________  
**Date:** _____________________________  
**Final Comment:**  
> 

**Phase Status:** NOT TESTED

---

### Phase 5 — Cloudflare R2 Storage Architecture, Multi-File Animated Upload & Staff Review Pipeline

#### Objective
Verify that user-uploaded files are streamed to Cloudflare R2 object storage, MongoDB stores metadata and `storageKey` only (zero binary in DB), the upload UI features fluid animations, newly uploaded documents enter the "قيد المراجعة" (*"Pending Review"*) queue, and staff can review, preview, approve, or reject files with expiry dates.

#### Prerequisites
- Client account logged in.
- Staff Admin account logged in.
- Sample PDF and image test files (<= 10MB).

#### Test Cases

### TEST-5-001 — Drag-and-Drop Animated Multi-File Upload to R2
* [ ] Test completed successfully

**Steps:**
1. Navigate to `http://localhost:3000/ar/portal/documents`.
2. Drag and drop 2 sample PDF files into the dropzone.
3. Verify category auto-detection (e.g. file named `Tax_Card_2026.pdf` auto-selects "Tax Card").
4. Click **"Start Uploading Files"** / **"بدء رفع الملفات"**.
5. Observe the aggregate progress bar and per-file progress animations.

**Expected Result:**
Upload streams binary files to Cloudflare R2 (`clients/{customerId}/documents/{id}_{name}.pdf`), creates MongoDB metadata with `storageKey`, displays 100% completion, and immediately refreshes the document registry table.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 05 (`task_05_document_upload_animation_staff_review.md`)

**Priority:**
* Critical

---

### TEST-5-002 — Immediate "قيد المراجعة" (Pending Review) Status Badge
* [ ] Test completed successfully

**Steps:**
1. In `http://localhost:3000/ar/portal/documents`, locate the newly uploaded document row in the table.
2. Inspect the **Status** column.

**Expected Result:**
Status column renders a pulsing indigo badge labeled **"قيد المراجعة"** (or *"Pending Review"* in English) with a send/clock icon.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 05 (`task_05_document_upload_animation_staff_review.md`)

**Priority:**
* High

---

### TEST-5-003 — Secure RBAC Download & Preview Streaming Gateway
* [ ] Test completed successfully

**Steps:**
1. As the document owner, click **"Download"** on a document in `/portal/documents`.
2. Inspect HTTP network request to `/api/portal/documents/[id]/download`.
3. Log out and attempt to access `/api/portal/documents/[id]/download` directly as an unauthenticated user or as a different client.

**Expected Result:**
Authenticated owner receives the file stream with correct `Content-Type` and `Content-Disposition`. Unauthorized requests are blocked with HTTP 401 or 403 Forbidden.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 05 (`task_05_document_upload_animation_staff_review.md`)

**Priority:**
* Critical

---

### TEST-5-004 — Staff Document Review, Expiry Setting & Approval Workflow
* [ ] Test completed successfully

**Steps:**
1. Log in as Staff Admin (`staff@nilelink.com` / `StaffAdmin2026!`).
2. Navigate to `http://localhost:3000/en/admin/documents/review` (or `/ar/admin/documents/review`).
3. Locate the pending document submission in the review queue and click **"Review"**.
4. Inside `DocumentReviewModal`:
   - Click **"Open High-Resolution File"** -> verify preview streams cleanly from R2.
   - Select validity **Start Date** and **Expiration Date**.
   - Click **"Save & Complete Verification"** (Approve).
5. Switch back to Client account on `/portal/documents`.

**Expected Result:**
Document transitions to status `"approved"` in MongoDB, displays solid emerald badge **"معتمد / ساري"**, updates client compliance health, and generates an in-app notification.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 05 (`task_05_document_upload_animation_staff_review.md`)

**Priority:**
* Critical

---

### Phase 5 Sign-Off

* [ ] All test cases completed
* [ ] No Critical issues
* [ ] No High priority unresolved issues
* [ ] Failed tests documented
* [ ] Regression testing completed
* [ ] Phase approved

**Tester:** ___________________________  
**Date:** _____________________________  
**Final Comment:**  
> 

**Phase Status:** NOT TESTED

---

### Phase 6 — Enterprise Corporate Profile Hub, Shipments & Services Metrics & Expiration Engine

#### Objective
Verify that `/portal/profile` functions as a full corporate management center with legal company details, shipments & services KPIs, login username management, live password strength validation, and the urgency-sorted expiring documents list (closest expiration date ranked first).

#### Prerequisites
- Client account logged in.
- Test documents with varied expiration dates (e.g. 1 day, 2 days, 7 days, 30 days).

#### Test Cases

### TEST-6-001 — Corporate Profile Legal Data & Operations Summary
* [ ] Test completed successfully

**Steps:**
1. Navigate to `http://localhost:3000/ar/portal/profile` and `http://localhost:3000/en/portal/profile`.
2. Inspect the top operations summary:
   - Total Operations / Shipments
   - Active Operations in Transit
   - Completed Deliveries
   - Subscribed Logistics Services (Sea Freight, Air Cargo, Customs Clearance, Warehousing).
3. Under **"Corporate Legal Info"** tab:
   - Verify Commercial Register Number and Tax Card Number are displayed.
   - Edit Company Name, Address, or Industry, and click **"Save Company Changes"**.

**Expected Result:**
Operation numbers load accurately, legal identity badges render cleanly, and updates persist successfully in MongoDB.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 06 (`task_06_corporate_profile_expiration_tracking.md`)

**Priority:**
* High

---

### TEST-6-002 — Login Username Modification & Uniqueness Check
* [ ] Test completed successfully

**Steps:**
1. On `/portal/profile`, switch to the **"Security & Credentials"** / **"إعدادات الأمان وكلمة المرور"** tab.
2. Edit the **Login Username** field to a new identifier (e.g. `mohamed_export_mgr`).
3. Click **"Save Username & Contact"**.
4. Log out and attempt to log in using the new username instead of the email.
5. Attempt to set the username to an already existing username of another user.

**Expected Result:**
Username saves successfully and allows sign in. Setting a duplicate username returns a clear validation error: *"Username is already taken by another user."*

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 06 (`task_06_corporate_profile_expiration_tracking.md`)

**Priority:**
* High

---

### TEST-6-003 — Password Change with Live PasswordRequirements Checklist
* [ ] Test completed successfully

**Steps:**
1. In the Security tab of `/portal/profile`, enter current password.
2. Type in the **New Password** field.
3. Observe the integrated `PasswordRequirements` checklist.
4. Confirm new password and submit.

**Expected Result:**
Password checklist animates checkmarks in real time. Valid passwords update successfully with password hash update in database.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 06 (`task_06_corporate_profile_expiration_tracking.md`)

**Priority:**
* Medium

---

### TEST-6-004 — Urgency-Sorted Expiring Documents Queue (Strict Ascending Order)
* [ ] Test completed successfully

**Steps:**
1. Switch to the **"Document Compliance & Expirations"** tab on `/portal/profile`.
2. Inspect the list of expiring documents.
3. Verify the sorting order of documents:
   - A document with 1 day remaining MUST appear ABOVE a document with 2 days remaining.
   - A document with 2 days remaining MUST appear ABOVE a document with 5 days remaining.
   - A document with 5 days remaining MUST appear ABOVE a document with 30 days remaining.
4. Check countdown badges in Arabic:
   - 1 day: *"ينتهي خلال يوم واحد"*
   - 2 days: *"ينتهي خلال يومين"*
   - 3–10 days: *"ينتهي خلال X أيام"*
5. Click **"Renew File"** / **"تجديد المستند"** on any item.

**Expected Result:**
Documents are strictly ordered by ascending urgency (closest expiry date first). Action button routes directly to `/portal/documents`.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 06 (`task_06_corporate_profile_expiration_tracking.md`)

**Priority:**
* Critical

---

### Phase 6 Sign-Off

* [ ] All test cases completed
* [ ] No Critical issues
* [ ] No High priority unresolved issues
* [ ] Failed tests documented
* [ ] Regression testing completed
* [ ] Phase approved

**Tester:** ___________________________  
**Date:** _____________________________  
**Final Comment:**  
> 

**Phase Status:** NOT TESTED

---

### Phase 7 — Cross-Cutting Systems (RTL/LTR, Themes, Quota, Financials & Audit Logs)

#### Objective
Verify bilingual consistency (Arabic RTL & English LTR), dark/light mode persistence, document quota enforcement (max 20), invoice/financial operations, and audit activity logging.

#### Prerequisites
- Client and Admin accounts.

#### Test Cases

### TEST-7-001 — Arabic (RTL) and English (LTR) Layout Integrity
* [ ] Test completed successfully

**Steps:**
1. Toggle language between Arabic (`/ar/*`) and English (`/en/*`) on all main routes:
   - `/ar/portal`, `/en/portal`
   - `/ar/portal/documents`, `/en/portal/documents`
   - `/ar/portal/profile`, `/en/portal/profile`
   - `/ar/admin`, `/en/admin`
2. Verify text alignment, icon mirroring (`ChevronRight`, back arrows), dropdown positions, and table columns.

**Expected Result:**
Layout mirrors correctly with proper directional padding, typography, and no horizontal overflow or clipped text.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Cross-Cutting

**Priority:**
* High

---

### TEST-7-002 — Dark and Light Mode Theme Consistency
* [ ] Test completed successfully

**Steps:**
1. Toggle theme button in `Navbar` or `PortalHeader` between Dark and Light mode.
2. Navigate across portal pages and inspect background contrast, card borders, and text readability.

**Expected Result:**
All components adapt cleanly with smooth transitions without unreadable contrast or broken background colors.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Cross-Cutting

**Priority:**
* Medium

---

### TEST-7-003 — 20-Document Quota Enforcement
* [ ] Test completed successfully

**Steps:**
1. Test uploading files when current document count reaches the customer quota (default 20).
2. Attempt to upload additional files.

**Expected Result:**
Upload zone disables file selection, shows quota limit notice, and API rejects surplus files with HTTP 400 `QUOTA_EXCEEDED`.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 05 (`task_05_document_upload_animation_staff_review.md`)

**Priority:**
* High

---

### TEST-7-004 — Document Activity Logging & Audit Trail
* [ ] Test completed successfully

**Steps:**
1. Perform upload, download, and review approval actions on documents.
2. Log in as Staff Admin and navigate to `/admin/logs` or check MongoDB `documentactivitylogs` collection.

**Expected Result:**
All actions record actor ID, actor type, action type, IP address, user agent, and timestamp.

**Actual Result:**
_Pending manual test execution._

**Status:**
* NOT TESTED

**Error / Comment:**
> 

**Reproduction Steps (if failed):**
1. 

**Related Task:**
Task 05 & Task 06

**Priority:**
* Medium

---

### Phase 7 Sign-Off

* [ ] All test cases completed
* [ ] No Critical issues
* [ ] No High priority unresolved issues
* [ ] Failed tests documented
* [ ] Regression testing completed
* [ ] Phase approved

**Tester:** ___________________________  
**Date:** _____________________________  
**Final Comment:**  
> 

**Phase Status:** NOT TESTED

---

## 4. Centralized Error & Issue Log

All bugs and anomalies found during manual or automated testing must be entered into this centralized table.

| Issue ID | Phase | Test ID | Issue Description | Severity | Status | Assigned To | Resolution / Comment |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *Example* | Phase 1 | TEST-1-001 | *Sample issue description* | *Medium* | *Fixed* | *Dev Team* | *Resolved in latest build* |

---

### Detailed Error Report Template

```markdown
### ERR-XXX — [Short Error Title]

**Phase:** Phase X — [Phase Name]
**Test Case:** TEST-X-XXX — [Test Name]
**Description:** Detailed description of what failed and under what conditions.

**Steps to Reproduce:**
1. Navigate to ...
2. Click on ...
3. Observe ...

**Expected Result:** What should have happened.
**Actual Result:** What actually happened (include error message or screenshot reference).

**Severity:** Critical / High / Medium / Low
**Status:** Open / In Progress / Fixed / Won't Fix

**Developer Comment:**
> Developer notes on root cause and fix details.

**Tester Comment:**
> QA re-test confirmation.

**Fix Verification:**
> Commit hash, PR link, or build version where the fix was confirmed.
```

---

## 5. Testing Dashboard & Summary

### Phase Completion Matrix

| Phase | Description | Total Tests | Passed | Failed | Blocked | Not Tested | Phase Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Phase 1** | Auth, Email & Password Checklist | 5 | 0 | 0 | 0 | 5 | **NOT TESTED** |
| **Phase 2** | Multi-Channel Verification & Skip Modal | 3 | 0 | 0 | 0 | 3 | **NOT TESTED** |
| **Phase 3** | Portal & Admin Layout Isolation | 3 | 0 | 0 | 0 | 3 | **NOT TESTED** |
| **Phase 4** | Dashboard Banners & 6 KPI Metrics | 3 | 0 | 0 | 0 | 3 | **NOT TESTED** |
| **Phase 5** | Cloudflare R2 Upload & Staff Review | 4 | 0 | 0 | 0 | 4 | **NOT TESTED** |
| **Phase 6** | Corporate Profile & Expiry Queue | 4 | 0 | 0 | 0 | 4 | **NOT TESTED** |
| **Phase 7** | Cross-Cutting Systems (RTL/Dark/Quota) | 4 | 0 | 0 | 0 | 4 | **NOT TESTED** |
| **TOTAL** | **Full System Test Suite** | **26** | **0** | **0** | **0** | **26** | **NOT TESTED** |

---

### Critical Issues Log
*(None reported yet. Document critical blockers here).*

### High Priority Issues Log
*(None reported yet. Document high priority bugs here).*

### Known Limitations & Environment Notes
1. **Cloudflare R2 Local Fallback**: When running offline without R2 credentials, the application transparently uses `storage/r2_local_fallback/` for file buffering while preserving identical object keys and API responses.
2. **OTP Preview**: In local development mode, generated 6-digit OTP codes are logged in the API JSON response (`previewCode`) for immediate testing convenience without requiring live SMS/WhatsApp delivery.

---

## 6. Regression Testing Strategy & Checklist

Whenever code is refactored, dependencies updated, or bugs resolved, run this quick regression checklist to guarantee stability:

- [ ] **Type Check**: Run `npx tsc --noEmit` -> confirm `0` errors.
- [ ] **Authentication**: Log in as Client (`mohamed@alexexport.com`) and Staff (`staff@nilelink.com`).
- [ ] **Layout Isolation**: Verify public `Navbar` is NOT visible on `/portal` or `/admin`.
- [ ] **File Upload**: Upload a test PDF in `/portal/documents` -> confirm status is `"pending_review"`.
- [ ] **Staff Approval**: Open `/admin/documents/review`, preview the file, assign dates, and approve.
- [ ] **Expiry Sort**: Open `/portal/profile` -> verify closest expiring file appears first in list.
- [ ] **Bilingual Direction**: Check `/ar/portal` (RTL) and `/en/portal` (LTR) for visual symmetry.

---

## 7. Testing History & Changelog

| Date (UTC) | Tester / Engineer | Scope / Phase | Changes & Actions | Result |
| :--- | :--- | :--- | :--- | :--- |
| **2026-08-26** | Antigravity AI Engine | Master Test Suite Creation | Created comprehensive master test guide covering Tasks 01–06. | Initial Release |
