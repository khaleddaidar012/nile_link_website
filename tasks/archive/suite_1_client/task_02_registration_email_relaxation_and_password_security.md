# Task 02 — Registration Email Relaxation, Password Security Engine & Clean Verification Transition

## Overview

- **What this feature does**:
  1. Relaxes account registration and profile contact validation to accept standard, valid email addresses from any provider—including consumer webmail services such as `@gmail.com`, `@yahoo.com`, `@outlook.com`, and `@hotmail.com`—while retaining RFC email format integrity.
  2. Implements a real-time, interactive Password Security Criteria Checklist that dynamically evaluates password strength (minimum 8 characters, uppercase letter, lowercase letter, number, and special symbol) fully translated across all 7 platform languages.
  3. Introduces a dedicated "Confirm Password" input field with instant matching feedback (green checkmark match, red mismatch alert).
  4. Guarantees a seamless, instant transition state machine from registration completion to the WhatsApp/Email verification screen, eliminating UI flicker, overlapping fields, or residual registration form artifacts.
- **What problem it solves**: Fulfills Requirements 3, 4, and 6 of `needs.md`. Eliminates customer onboarding friction caused by blocking public email addresses, enforces strong credential security with transparent feedback, and prevents visual glitches during account activation.
- **Why it is needed**: Modern supply chain logistics clients frequently use enterprise-hosted Gmail or common commercial accounts for rapid communication. Strict email blocking turns away valid leads, while inadequate password feedback leads to account creation failures.
- **How it fits into the existing system**: Modifies `lib/auth/password.ts`, `app/api/auth/register/route.ts`, `app/api/auth/update-contact/route.ts`, `components/auth/RegisterForm.tsx`, and `components/auth/PasswordRequirements.tsx`. Fully synchronized with Zod validation schemas and JWT session generation.

---

## Requirements

- **REQ-03**: "تسجيل حساب جديد يقبل اي ايميل حتي لو جوجل" (New account registration must accept any valid email, even Google/Gmail).
- **REQ-04**: "Password Security: Empty, At least 8 characters, At least one uppercase letter (A-Z), At least one lowercase letter (a-z), At least one number (0-9), At least one special symbol (!@#$%^&*). عاوز معايير الرقم السري تترجم للخمس لغات وعاوز حقل لتاكيد الرقم السري" (Password security criteria checklist: empty validation, 8+ chars, uppercase, lowercase, number, special char. Must be translated to all platform languages, plus add a Confirm Password field).
- **REQ-06**: "بعد تسجيل حساب بيظهر جزء من صفحة التسجيل قبل صفحة توثيق الwhats and email لا مش عاوزه حاجة من صفحة تسجيل حساب تظهر" (After registering an account, part of the registration page briefly appears before the WhatsApp/Email verification page. Ensure nothing from the registration page lingers or shows; transition cleanly).

---

## Current Implementation

- **Email Validation**:
  - `lib/auth/password.ts` exports `FREE_EMAIL_DOMAINS` and `isBusinessEmail(email)`.
  - `app/api/auth/register/route.ts` previously enforced `isBusinessEmail`, which rejected consumer domains with a 400 error.
  - `app/api/auth/update-contact/route.ts` also contains calls to `isBusinessEmail`.
- **Password Strength Evaluation**:
  - `lib/auth/password.ts` exports `evaluatePasswordStrength(password)` returning `minLength`, `hasUpper`, `hasLower`, `hasNumber`, `hasSpecial`, and `isValid`.
  - `components/auth/PasswordRequirements.tsx` renders an interactive visual checklist with icons and color states based on criteria status.
- **Confirm Password & Transition**:
  - `components/auth/RegisterForm.tsx` manages registration states (`idle`, `submitting`, `success`, `redirecting`).
  - Upon successful registration, if an intermediate rendering phase occurs or navigation to `/portal/verification` lags, parts of the form may briefly unmount or flash.
- **Reference Documentation**:
  - `API_INVENTORY.md` Section 1.1 (Register Corporate Account API specification).
  - `API_INVENTORY.md` Section 5 (User Model Schema).

---

## Files / Modules Affected

- **Libraries & Utilities**:
  - `lib/auth/password.ts`
  - `lib/validators/auth.ts` (if applicable)
- **API Endpoints**:
  - `app/api/auth/register/route.ts`
  - `app/api/auth/update-contact/route.ts`
- **Components**:
  - `components/auth/RegisterForm.tsx`
  - `components/auth/PasswordRequirements.tsx`
  - `components/auth/LoginForm.tsx`
- **Pages**:
  - `app/[locale]/login/page.tsx`
  - `app/[locale]/portal/verification/page.tsx`
- **Localization Bundles**:
  - `messages/ar.json`
  - `messages/en.json`
  - `messages/fr.json`
  - `messages/de.json`
  - `messages/it.json`
  - `messages/zh.json`
  - `messages/bg.json`

---

## Data / Architecture Changes

- **Database Changes**: None. The `User` and `Customer` collections already support standard RFC email strings.
- **Validation Rules**:
  - Deprecate blocking logic in `isBusinessEmail()` for registration and contact updating. Retain RFC 5322 standard format validation via `z.string().email()`.
  - Enforce server-side matching of `password === confirmPassword` in `register/route.ts`.
  - Enforce password complexity validation (`validatePasswordComplexity`) on server and client before creating database records.
- **State Transition Machine**:
  - In `components/auth/RegisterForm.tsx`, replace delayed or multi-step redirects with an atomic state transition:
    When `res.ok` is received, immediately mount an opaque loading/transition overlay (`AnimatePresence`) that immediately masks the form and triggers `router.push('/portal/verification')`.

---

## UI / UX Changes

- **Registration Form Fields**:
  - Email field helper text updated to "Work or official contact email (e.g. name@company.com or name@gmail.com)".
  - Added "Confirm Password" field below the password field with show/hide password toggle.
  - Real-time matching indicator:
    - Empty confirm password: Neutral placeholder.
    - Matches password: Green checkmark with text "Passwords match" / "كلمتا المرور متطابقتان".
    - Mismatched: Red alert icon with text "Passwords do not match" / "كلمتا المرور غير متطابقتين".
- **Interactive Password Requirements Component**:
  - Mounted directly beneath the password input.
  - Lists 5 items with dynamic state:
    1. At least 8 characters
    2. At least one uppercase letter (A-Z)
    3. At least one lowercase letter (a-z)
    4. At least one number (0-9)
    5. At least one special symbol (!@#$%^&*)
  - Each item turns green with a checkmark once satisfied.
  - Fully translated across all 7 locales (`auth.passwordRules.*`).
- **Post-Registration Screen**:
  - As soon as the form submits successfully, the registration inputs are completely unmounted or masked by a branded splash screen ("Preparing your compliance portal...") while redirecting to `/portal/verification`.
  - Prevents the user from seeing partial inputs or jumping layout elements.

---

## Implementation Plan

1. **Email Domain Relaxation in Backend**:
   - In `app/api/auth/register/route.ts`, verify that `isBusinessEmail` is not called to reject consumer emails. Accept any valid email conforming to `z.string().email()`.
   - In `app/api/auth/update-contact/route.ts`, remove the `if (!isBusinessEmail(emailLower))` restriction so existing clients can also update contact emails to Gmail/Yahoo if desired.
2. **Synchronize Password Criteria Checklist & Confirm Password**:
   - Verify `components/auth/PasswordRequirements.tsx` consumes keys from `t("auth.passwordRules.*")`.
   - Ensure `messages/ar.json`, `en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json` contain the complete criteria keys.
   - In `components/auth/RegisterForm.tsx`, implement `confirmPassword` in Zod schema with `.refine((data) => data.password === data.confirmPassword)`.
3. **Refactor Registration Completion State Machine**:
   - In `components/auth/RegisterForm.tsx`, introduce an explicit `isTransitioning` boolean state.
   - When registration succeeds (`res.ok`), set `isTransitioning(true)` which renders a full-card overlay with a sleek spinner and translated text `t("auth.register.redirectingToVerification")`.
   - Execute `router.push('/portal/verification')` cleanly without DOM flash.

---

## Small Tasks

- [x] Inspect `app/api/auth/register/route.ts` and ensure any email domain blacklist is removed.
- [x] Inspect `app/api/auth/update-contact/route.ts` and remove domain blocking logic for email updates.
- [x] Add `confirmPassword` to `registerSchema` in `app/api/auth/register/route.ts` and reject mismatches with 400 status.
- [x] Add `confirmPassword` field in `components/auth/RegisterForm.tsx` with password visibility toggle.
- [x] Implement real-time password matching visual badge in `components/auth/RegisterForm.tsx`.
- [x] Verify `components/auth/PasswordRequirements.tsx` evaluates all 5 criteria from `evaluatePasswordStrength`.
- [x] Populate translation keys for `auth.passwordRules` across all 7 language files (`ar.json`, `en.json`, `fr.json`, `de.json`, `it.json`, `zh.json`, `bg.json`).
- [x] Implement atomic transition splash card in `components/auth/RegisterForm.tsx` when registration succeeds.
- [x] Verify `router.push('/portal/verification')` executes smoothly without intermediate registration UI flashing.

---

## Edge Cases

- **Duplicate Email / Company Collision**:
  - If a user registers with a `@gmail.com` that already exists in MongoDB, the API must return a clear 409 Conflict with translated error "An account with this email address already exists".
- **Paste Event on Confirm Password**:
  - Allow pasting in confirm password while still triggering real-time validation check.
- **Slow Network during Redirect**:
  - The transition card must maintain a stable loading spinner and disable back-navigation button to prevent double registration submissions.

---

## Testing Checklist

- [ ] Register with `testuser@gmail.com` -> must succeed and create customer account.
- [ ] Register with `testuser@yahoo.com` -> must succeed.
- [ ] Register with invalid email `notanemail` -> must show inline validation error.
- [ ] Type password `Password123!` and watch the 5 checklist items turn green in real time.
- [ ] Type mismatched confirm password `Password123` -> must show red mismatch warning and disable submit button.
- [ ] Type matching confirm password `Password123!` -> must show green match confirmation.
- [ ] Submit registration form -> verify no part of the form flashes or lingers before arriving at `/portal/verification`.
- [ ] Switch locale to Arabic (`/ar/login?tab=register`) -> verify all 5 password rules are in native Arabic.
- [ ] Switch locale to French, German, Italian, Chinese, Bulgarian -> verify password checklist translations.

---

## Acceptance Criteria

- Any valid email address (including `@gmail.com`, `@yahoo.com`, `@outlook.com`) is accepted during registration.
- Password criteria checklist accurately reflects password complexity across all 7 supported languages.
- Confirm Password input validates in real time and blocks submission on mismatch.
- Account creation seamlessly transitions directly into the verification screen with zero UI flickering.
- Zero TypeScript errors (`npx tsc --noEmit`).

---

## Dependencies

- Depends on: None (Core Authentication Task).

---

## AI_MAP Impact

- `API_INVENTORY.md` Section 1.1 (`POST /api/auth/register` specification).
- `PROJECT_TASKS.md` (Authentication & Security Track).
