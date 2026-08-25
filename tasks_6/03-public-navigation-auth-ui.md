# Task: Public Navigation Integration & Authentication UI

Status: in_progress
Priority: high

## 1. Overview & Scope

Design and implement the public website authentication entry points (Navbar & Footer login/register buttons) and modern, accessible, bilingual (Arabic RTL & English LTR) authentication pages: Login, Registration, Forgot Password, Reset Password, and Email Verification.

---

## 2. Master Subtask Checklist

- [x] Subtask 01 — Public Navbar Login & Register Action Buttons
- [x] Subtask 02 — Public Footer Client Portal Links
- [x] Subtask 03 — Customer & Staff Login Page (`/[locale]/login`)
- [x] Subtask 04 — Customer Registration Page (`/[locale]/register`)
- [x] Subtask 05 — Forgot Password Request Page (`/[locale]/forgot-password`)
- [x] Subtask 06 — Reset Password Completion Page (`/[locale]/reset-password`)
- [x] Subtask 07 — Email Verification Result Page (`/[locale]/verify-email`)
- [x] Subtask 08 — Multilingual Localization Strings (`messages/ar.json` & `messages/en.json`)

---

## 3. Subtask Details

### Subtask 01 — Public Navbar Login & Register Action Buttons

#### Objective
Integrate sleek, branded "Login" and "Sign Up" CTA buttons into the existing public Navbar (`components/layout/Navbar.tsx`) that adapt to authenticated user state (showing "Portal" when logged in) across desktop and mobile hamburger menus.

#### Why it is needed
Provides users with a clear entry point into the NileLink Client Portal from the corporate website without disrupting existing navigation items.

#### Where it should be implemented
- `components/layout/Navbar.tsx`
- `components/layout/AuthNavActions.tsx`

#### Expected Result
- Desktop Navbar: Clean outline button for "Login" and primary button for "Sign Up" placed alongside the language/theme switcher.
- If user is authenticated: Replaces Login/SignUp with a "Client Portal" button linking to `/portal` (or `/admin` for staff).
- Mobile Hamburger Menu: Includes dedicated authentication links styled cleanly.
- Zero layout shift or breaking changes to existing navigation links.

#### Dependencies
- `02-auth-backend-security.md` (`/api/auth/me`)
- `next-intl`

#### Acceptance Criteria
- Desktop and mobile layouts render without overlapping or wrapping.
- Seamlessly respects RTL direction in Arabic mode.
- Existing marketing links remain completely operational.

---

### Subtask 02 — Public Footer Client Portal Links

#### Objective
Add a "Client Services & Portal" column/section to the public Footer (`components/layout/Footer.tsx`) with links to Login, Register, Document Verification, and Client Support.

#### Why it is needed
Increases discoverability of client portal features for corporate users navigating the footer.

#### Where it should be implemented
`components/layout/Footer.tsx`

#### Expected Result
- Branded links: "Client Portal Login", "Register Company Account", "Document Verification Service", "Support & FAQ".
- Matches existing footer styling, fonts, and responsive grid layout.

#### Dependencies
- `components/layout/Footer.tsx`

#### Acceptance Criteria
- Footer responsive grid adapts gracefully on mobile, tablet, and desktop.
- No existing footer links or copyright information are removed.

---

### Subtask 03 — Customer & Staff Login Page (`/[locale]/login`)

#### Objective
Build a modern, high-conversion login page featuring Email/Username field, Password field with show/hide toggle, "Remember Me" checkbox, "Forgot Password" link, and animated submit button with loading state.

#### Why it is needed
Serves as the primary authentication interface for clients and employees.

#### Where it should be implemented
- `app/[locale]/login/page.tsx`
- `components/auth/LoginForm.tsx`

#### Expected Result
- Clean card layout with NileLink branding, shipping logistics background imagery, and glassmorphic card container.
- Form fields:
  - Identifier (Email or Username) with icon.
  - Password input with toggleable eye icon.
  - Remember me checkbox.
  - "Forgot Password?" anchor link.
- Integrated with `react-hook-form` + `zod` for real-time validation.
- Submits to `/api/auth/login`, handles loading spinner, displays error alert on failure, and redirects to callback URL or `/portal` (or `/admin`) on success.

#### Dependencies
- `02-auth-backend-security.md` (`/api/auth/login`)
- `framer-motion`
- `lucide-react`

#### Acceptance Criteria
- Form validation displays immediate inline errors for missing or invalid inputs.
- Enter key triggers form submission.
- Supports both Arabic (RTL) and English (LTR) with proper text alignment and icon positioning.

---

### Subtask 04 — Customer Registration Page (`/[locale]/register`)

#### Objective
Build a multi-field corporate registration page capturing personal info (Name, Email, Phone, Password) and company details (Company Name, Commercial Register No., Tax Card No., Industry).

#### Why it is needed
Allows prospective corporate clients to self-register their business for NileLink shipping and logistics services.

#### Where it should be implemented
- `app/[locale]/register/page.tsx`
- `components/auth/RegisterForm.tsx`

#### Expected Result
- Organized two-column or stepped layout:
  - Personal Information: First Name, Last Name, Work Email, Contact Phone, Secure Password with password strength indicator.
  - Company Information: Legal Company Name, Commercial Registration (CR) Number, Tax Card Number, Country, City.
  - Terms & Privacy agreement checkbox.
- Submits to `/api/auth/register`, shows success confirmation screen ("Verification Email Sent"), and instructs user to check inbox.

#### Dependencies
- `02-auth-backend-security.md` (`/api/auth/register`)
- `react-hook-form` + `zod`

#### Acceptance Criteria
- Validates password strength (length, uppercase, number, symbol).
- Disables submit button while submitting and displays spinner.
- Displays server error toast/message if email or CR number is already registered.

---

### Subtask 05 — Forgot Password Request Page (`/[locale]/forgot-password`)

#### Objective
Create the password reset request page allowing users to submit their registered email address to receive a password reset link.

#### Why it is needed
Enables self-service account recovery for users who forgot their credentials.

#### Where it should be implemented
- `app/[locale]/forgot-password/page.tsx`
- `components/auth/ForgotPasswordForm.tsx`

#### Expected Result
- Simple, centered card with email input and "Send Reset Link" button.
- After submission, transitions smoothly into a "Check your email" confirmation state with a resend button (cooldown timer: 60s).
- "Back to Login" navigation link.

#### Dependencies
- `02-auth-backend-security.md` (`/api/auth/forgot-password`)

#### Acceptance Criteria
- Validates email format before sending.
- Handles success state gracefully without leaking account existence.

---

### Subtask 06 — Reset Password Completion Page (`/[locale]/reset-password`)

#### Objective
Create the password reset completion page accepting the reset token from URL query params and allowing the user to enter and confirm their new password.

#### Why it is needed
Completes the password reset workflow securely.

#### Where it should be implemented
- `app/[locale]/reset-password/page.tsx`
- `components/auth/ResetPasswordForm.tsx`

#### Expected Result
- Reads `token` and `email` from query string.
- New Password and Confirm Password inputs with show/hide toggles.
- Real-time password match validation.
- Submits to `/api/auth/reset-password`.
- On success: displays success message and redirects to `/login` after 3 seconds.

#### Dependencies
- `02-auth-backend-security.md` (`/api/auth/reset-password`)

#### Acceptance Criteria
- Disallows submission if passwords do not match.
- Displays expired/invalid token alert if API returns 400.

---

### Subtask 07 — Email Verification Result Page (`/[locale]/verify-email`)

#### Objective
Create the email verification landing page that verifies the token upon load and presents an animated success or error state.

#### Why it is needed
Confirms user email verification when the user clicks the link from their email inbox.

#### Where it should be implemented
`app/[locale]/verify-email/page.tsx`

#### Expected Result
- Reads `token` query param and calls `/api/auth/verify-email`.
- Loading state: animated verifying spinner.
- Success state: green checkmark animation, "Email Verified Successfully", and "Continue to Login / Portal" button.
- Failure state: red alert icon, "Invalid or Expired Link", and "Request New Link" button.

#### Dependencies
- `02-auth-backend-security.md` (`/api/auth/verify-email`)

#### Acceptance Criteria
- Verification status resolves and displays feedback within 1 second.
- Fully responsive on mobile email clients.

---

### Subtask 08 — Multilingual Localization Strings

#### Objective
Populate all necessary translation keys for authentication, forms, validation messages, and buttons across `messages/ar.json` and `messages/en.json`.

#### Why it is needed
Ensures 100% bilingual parity for Arabic (RTL) and English (LTR) across all authentication interfaces.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- Clean `auth` namespace containing:
  - `login`: title, subtitle, email, password, rememberMe, forgotPassword, submit, noAccount, registerLink, etc.
  - `register`: title, subtitle, personalInfo, companyInfo, companyName, crNumber, taxNumber, terms, submit, hasAccount, loginLink, etc.
  - `forgotPassword`: title, subtitle, email, submit, backToLogin, emailSentTitle, emailSentDesc, resend, etc.
  - `resetPassword`: title, newPassword, confirmPassword, submit, success, error, etc.
  - `verifyEmail`: verifying, successTitle, successDesc, errorTitle, errorDesc, goToLogin, etc.
  - `validation`: required, invalidEmail, passwordLength, passwordMismatch, etc.

#### Dependencies
- `next-intl`

#### Acceptance Criteria
- Zero missing translation warnings in console.
- Professional Arabic phrasing tailored to maritime logistics in Egypt and GCC.

---

## 4. Edge Cases & Handling

1. **Callback Redirects**: Preserve `callbackUrl` query parameter so that if a user was attempting to access `/portal/documents` before logging in, they are immediately redirected back there after authentication.
2. **Missing Token on Reset Password**: If a user navigates to `/reset-password` without a valid token parameter, display an informative error card prompting them to request a new reset link.
3. **Form Resubmission Prevention**: Disable submit buttons while pending network requests to prevent duplicate submissions.

---

## 5. Regression Requirements

- Must NOT modify or delete existing keys in `messages/ar.json` or `messages/en.json`.
- Must NOT break the public marketing layout or header styling on existing pages (`/`, `/about`, `/services`, etc.).

---

## 6. Acceptance Criteria Summary

- [ ] Navbar and Footer updated with non-intrusive login and register CTAs.
- [ ] 5 authentication pages created and styled with NileLink branding.
- [ ] Form validation with `react-hook-form` and `zod` working across all pages.
- [ ] Arabic RTL and English LTR layouts render properly.
- [ ] No regression on existing marketing pages.
