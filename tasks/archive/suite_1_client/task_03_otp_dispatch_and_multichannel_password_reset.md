# Task 03 — Automated OTP Dispatch Engine & Multi-Channel Password Reset Flow

## Overview

- **What this feature does**:
  1. Establishes a unified OTP dispatch configuration and service that delivers 6-digit numeric authentication codes over both **WhatsApp Cloud API** and **Email (SMTP/Resend)** for initial account verification and password recovery.
  2. Implements a comprehensive, multi-step **Forgot Password & Password Reset Flow** (`/forgot-password` and `/reset-password`) that empowers customers to select their preferred recovery channel (Email or WhatsApp), receive an instant OTP code, verify the code, and securely set a new password complying with enterprise security standards.
- **What problem it solves**: Fulfills Requirements 7 and 12 of `needs.md`. Resolves the critical gap where customers who lose their password or register their company could not reset credentials or receive automated dual-channel verification codes.
- **Why it is needed**: In maritime logistics and international shipping, freight operators are frequently in transit or in port terminals where WhatsApp is significantly faster and more reliable than email. Offering dual-channel OTP and recovery ensures uninterrupted access to customs clearances and bill of lading documents.
- **How it fits into the existing system**: Integrates `lib/auth/otp-service.ts`, `app/api/auth/send-otp/route.ts`, `app/api/auth/verify-otp/route.ts`, `app/api/auth/password-reset/request/route.ts`, `app/api/auth/password-reset/confirm/route.ts`, and `components/auth/ForgotPasswordWizard.tsx`.

---

## Requirements

- **REQ-07**: "عاوزين نعمل اعداد عشان يتم اارسال اكودا التفعيل علي الواتس و ال eamil" (We need to create settings/configuration so activation codes are automatically dispatched via WhatsApp and Email).
- **REQ-12**: "عاوزين صفحة اعاده تعين كلمه السر عن طريق ال بريد اليلكتروني و الوتس" (We need a password reset page allowing credential recovery via Email and WhatsApp).

---

## Current Implementation

- **OTP Service**:
  - `lib/auth/otp-service.ts` contains `generateNumericOtp`, `dispatchOtpNotification`, and support for WhatsApp Cloud API (`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`) and SMTP / Resend email dispatch.
  - Development mode logs OTP codes cleanly to stdout for instant testing while production mode executes live API calls if environment variables are provided.
- **Existing Password Reset Endpoints**:
  - `app/api/auth/password-reset/request/route.ts` accepts `{ identifier, channel }` (email or phone), locates the user, generates a 6-digit OTP stored in `user.emailVerificationToken` or dedicated reset field with 15-minute expiration, and calls `dispatchOtpNotification`.
  - `app/api/auth/password-reset/confirm/route.ts` accepts `{ identifier, code, newPassword, confirmPassword }`, validates complexity, hashes the new password, clears the token, and returns success.
- **UI Wizard**:
  - `app/[locale]/forgot-password/page.tsx` renders `components/auth/ForgotPasswordWizard.tsx`.
  - The wizard guides users through 3 sequential steps:
    1. Channel Selection & Account Identifier (Email or Phone).
    2. 6-Digit OTP Verification.
    3. New Password Entry with Criteria Checklist.
- **Reference Documentation**:
  - `API_INVENTORY.md` Section 1.2 (Multi-Channel OTP Verification).
  - `API_INVENTORY.md` Section 1.3 (Password Reset Request & Confirm Endpoints).

---

## Files / Modules Affected

- **Libraries & Utilities**:
  - `lib/auth/otp-service.ts`
  - `lib/email/config.ts`
- **API Routes**:
  - `app/api/auth/send-otp/route.ts`
  - `app/api/auth/verify-otp/route.ts`
  - `app/api/auth/password-reset/request/route.ts`
  - `app/api/auth/password-reset/confirm/route.ts`
- **Pages**:
  - `app/[locale]/forgot-password/page.tsx`
  - `app/[locale]/reset-password/page.tsx`
  - `app/[locale]/portal/verification/page.tsx`
- **Components**:
  - `components/auth/ForgotPasswordWizard.tsx`
  - `components/portal/verification/VerificationFlow.tsx`
- **Environment Configuration**:
  - `.env.example` / `.env.local`
- **Localization**:
  - `messages/*.json` (`auth.forgotPassword.*`, `auth.resetPassword.*`)

---

## Data / Architecture Changes

- **User Model Attributes**:
  - Verify fields in `lib/models/User.ts`:
    - `emailVerificationToken?: string`
    - `emailVerificationExpires?: Date`
    - `whatsappVerificationToken?: string`
    - `whatsappVerificationExpires?: Date`
    - `passwordResetToken?: string`
    - `passwordResetExpires?: Date`
    - `passwordResetChannel?: "email" | "whatsapp"`
- **OTP Expiry & Security Policy**:
  - OTP validity window strictly configured to **10 minutes**.
  - Rate limiting: Maximum 3 OTP dispatch requests per identifier per 10 minutes to prevent SMS/WhatsApp spamming.
  - Brute-force protection: Maximum 5 failed verification attempts before invalidating the OTP code.

---

## UI / UX Changes

- **Forgot Password Wizard (`/forgot-password`)**:
  - **Step 1 — Identify & Select Channel**:
    - User enters registered Email or WhatsApp Phone number.
    - Selects dispatch channel via interactive toggle cards:
      - 📧 **Email Delivery** ("Receive reset code at your official work email")
      - 💬 **WhatsApp Delivery** ("Receive instant security code via WhatsApp message")
    - "Send Verification Code" CTA button with loading spinner.
  - **Step 2 — Enter 6-Digit OTP**:
    - Numeric 6-digit segmented input or clean input field with autofocus.
    - Countdown timer (e.g. "Resend code in 01:59").
    - "Resend Code" action button enabled after timer expiry.
  - **Step 3 — New Password Creation**:
    - "New Password" and "Confirm New Password" inputs with visibility toggles.
    - Embedded `PasswordRequirements` checklist showing satisfaction of 8+ chars, uppercase, lowercase, number, and symbol in real time.
    - "Reset Password & Login" CTA button.
  - **Step 4 — Success Confirmation**:
    - Animated green checkmark badge with message "Your password has been successfully reset".
    - Direct button to return to `/login`.

---

## Implementation Plan

1. **Audit & Standardize OTP Dispatch Logic**:
   - Inspect `lib/auth/otp-service.ts`. Ensure `dispatchOtpNotification` cleanly handles both `"email"` and `"whatsapp"` channels.
   - Verify fallback mechanism: in development or when live API tokens are absent, format OTP in server logs with a distinct box for effortless local developer testing while returning `previewCode` only in non-production environments.
   - Ensure environment variables are documented in `.env.example`:
     `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
2. **Refine Password Reset API Pipeline**:
   - Verify `app/api/auth/password-reset/request/route.ts` handles user lookup by either email address or sanitized phone number.
   - Verify `app/api/auth/password-reset/confirm/route.ts` validates OTP against expiration timestamp and updates `passwordHash` using `hashPassword()`.
3. **Verify Full Forgot Password UI Wizard**:
   - Inspect `components/auth/ForgotPasswordWizard.tsx`. Ensure all state steps (1 to 4) are completely localized using `next-intl`.
   - Ensure error handling (invalid code, expired code, account not found) displays user-friendly localized alert banners.
   - Mirror `/login` link on `/forgot-password` so clients can return to login at any point.

---

## Small Tasks

- [x] Inspect `lib/auth/otp-service.ts` and verify payload structures for WhatsApp Cloud API and SMTP email dispatch.
- [x] Document OTP environment variables in `.env.example` with clear instructions.
- [x] Verify `app/api/auth/send-otp/route.ts` dispatches to the requested channel (`whatsapp` or `email`).
- [x] Verify `app/api/auth/verify-otp/route.ts` verifies codes and sets `emailVerified` or `whatsappVerified` on the User document.
- [x] Inspect `app/api/auth/password-reset/request/route.ts` for dual-channel identifier lookup (email or phone).
- [x] Inspect `app/api/auth/password-reset/confirm/route.ts` for password complexity enforcement before resetting.
- [x] Verify `components/auth/ForgotPasswordWizard.tsx` handles step 1 (channel selection), step 2 (OTP code), and step 3 (new password).
- [x] Add countdown timer in OTP entry screen before allowing code resend.
- [x] Verify `messages/ar.json` and European language files have 100% translation coverage for password reset and OTP flows.
- [x] Test password reset end-to-end on `/forgot-password`.

---

## Edge Cases

- **User Enters Phone with Formatting**:
  - Normalize phone inputs (`+20 100 123 4567` -> `+201001234567` or `01001234567`) before querying database records.
- **Expired OTP Submission**:
  - Return HTTP 400 with message "Verification code has expired. Please request a new code" / "انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد".
- **Non-Existent Account Recovery**:
  - Prevent user enumeration: Return a generic success message or clear prompt without exposing whether the email/phone exists.

---

## Testing Checklist

- [ ] Request OTP via Email on `/portal/verification` -> verify dispatch and code validation.
- [ ] Request OTP via WhatsApp on `/portal/verification` -> verify dispatch and code validation.
- [ ] Navigate to `/ar/forgot-password`. Verify step 1 renders in Arabic with email and WhatsApp options.
- [ ] Submit registered email -> verify OTP is created and step 2 countdown begins.
- [ ] Enter wrong OTP code -> verify error message "Invalid verification code".
- [ ] Enter correct OTP code -> verify progression to step 3 (New Password).
- [ ] Enter new password that violates complexity -> verify submit is blocked.
- [ ] Enter compliant password and matching confirm password -> verify successful password update.
- [ ] Log in with the newly reset password -> verify authentication succeeds.

---

## Acceptance Criteria

- OTP codes are automatically dispatched to WhatsApp and Email based on user selection.
- Complete Forgot Password wizard allows users to recover their password using Email or WhatsApp.
- Expired or invalid OTP codes are cleanly rejected with actionable feedback.
- Successfully reset passwords allow instant login with the new credentials.
- Zero TypeScript errors (`npx tsc --noEmit`).

---

## Dependencies

- Depends on:
  - Task 02 (Registration & Password Complexity Engine).

---

## AI_MAP Impact

- `API_INVENTORY.md` Section 1.2 & 1.3 (OTP and Password Reset APIs).
- `PROJECT_TASKS.md` (Authentication & Security Track).
