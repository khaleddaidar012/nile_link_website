# Task: Multi-Channel Notification Engine, Email & WhatsApp Integration

Status: pending
Priority: high

## 1. Overview & Scope

Design and implement the complete Multi-Channel Notification and Escalation System. This encompasses Customer and Employee In-App Notification Centers, Automated 10-Day advance alerts, Escalating Reminder Cadence (10d, 7d, 3d, 1d, Expired), Transactional HTML Email delivery via Nodemailer, WhatsApp Business API integration with delivery lifecycle tracking (`Pending` → `Sent` → `Delivered` → `Failed`), and the Manual Staff Warning Trigger (Email / WhatsApp / Both) with full Activity Audit Logging.

---

## 2. Master Subtask Checklist

- [ ] Subtask 01 — In-App Notification Center for Customers (`/[locale]/portal/notifications`)
- [ ] Subtask 02 — In-App Notification Center for Staff (`/[locale]/admin/notifications`)
- [ ] Subtask 03 — Automated 10-Day Expiry Notice & Anti-Spam Deduplication Engine
- [ ] Subtask 04 — Notification Escalation Dispatcher (10d, 7d, 3d, 1d, Expired)
- [ ] Subtask 05 — Transactional HTML Email Service & Branded Templates (Nodemailer)
- [ ] Subtask 06 — WhatsApp Business API Client & Message Delivery Webhook
- [ ] Subtask 07 — Manual Employee Warning Dispatch Modal (Email / WhatsApp / Both)
- [ ] Subtask 08 — Notification Delivery Status & Activity Audit Logger
- [ ] Subtask 09 — Localization Strings for Notifications & Message Templates

---

## 3. Subtask Details

### Subtask 01 — In-App Notification Center for Customers (`/[locale]/portal/notifications`)

#### Objective
Build the Customer Notification Center page and popover feed allowing clients to view, filter (Unread, All, Expiry Warnings, Document Reviews), and mark notifications as read.

#### Why it is needed
Provides clients with a persistent historical inbox of all system alerts, document status changes, and renewal reminders.

#### Where it should be implemented
- `app/[locale]/portal/notifications/page.tsx`
- `app/api/portal/notifications/route.ts`
- `components/portal/notifications/CustomerNotificationList.tsx`

#### Expected Result
- Paginated list of user notifications with severity badges (`Normal` 🔵, `Warning` 🟡, `Urgent` 🟠, `Critical` 🔴).
- Unread counter and "Mark All as Read" action.
- Direct action link on each notification card (e.g. clicking "Commercial Registration expires in 8 days" navigates to document renew view).
- Filter tabs: `All`, `Unread`, `Documents & Expiries`, `Requests`, `Billing`.

#### Dependencies
- `01-database-schema-models.md` (`Notification`)
- `04-customer-portal-layout-dashboard.md`

#### Acceptance Criteria
- Marking a notification as read updates unread counter instantly.
- Empty inbox state rendered cleanly.

---

### Subtask 02 — In-App Notification Center for Staff (`/[locale]/admin/notifications`)

#### Objective
Build the Employee Administrative Notification Center aggregating company-wide operational alerts: new document uploads awaiting review, documents expiring in ≤10 days, expired documents, rejected files, and clients transitioned to `Inactive`.

#### Why it is needed
Enables staff to monitor all inbound client submissions and outbound alerts in one operational feed.

#### Where it should be implemented
- `app/[locale]/admin/notifications/page.tsx`
- `app/api/admin/notifications/route.ts`
- `components/admin/notifications/AdminNotificationCenter.tsx`

#### Expected Result
- Filterable admin notification stream:
  - `New Uploads Pending Review`
  - `Upcoming Expirations (10d / 7d / 3d)`
  - `Expired Documents & Inactive Accounts`
  - `Manual Warnings Dispatched by Staff`
- "Quick Action" buttons on alert items (e.g., `Review Document Now`, `Inspect Client Profile`).

#### Dependencies
- `01-database-schema-models.md` (`Notification`)
- `06-employee-admin-portal-core.md`

#### Acceptance Criteria
- Real-time or poll-based updates for incoming client uploads.
- Clear distinction between system-generated alerts and manual staff actions.

---

### Subtask 03 — Automated 10-Day Expiry Notice & Anti-Spam Deduplication Engine

#### Objective
Build the automated notification worker that fires when a document reaches exactly 10 days before expiration, ensuring alerts are sent once per notification window and preventing spam duplicates.

#### Why it is needed
Fulfills the core requirement to alert both customer and staff at the 10-day threshold without flooding client inboxes.

#### Where it should be implemented
`lib/services/automated-expiry-notifier.ts`

#### Expected Result
- Scans documents where `daysRemaining === 10` (or `8 <= daysRemaining <= 10`).
- Checks `Notification` collection to verify no `document_expiring_10d` alert was dispatched for this document in the last 48 hours.
- If not already sent:
  1. Inserts customer in-app notification.
  2. Inserts staff in-app notification (`"Client X's Commercial Registration will expire in 10 days"`).
  3. Dispatches automated 10-day Email warning.
  4. Records `lastNotificationSentAt = new Date()`.
  5. Logs activity in `DocumentActivityLog`.

#### Dependencies
- `01-database-schema-models.md`
- `08-expiry-detection-progressive-warnings.md`

#### Acceptance Criteria
- Deduplication prevents multiple emails for the same 10-day event.
- Accurately triggers when cron runs daily.

---

### Subtask 04 — Notification Escalation Dispatcher (10d, 7d, 3d, 1d, Expired)

#### Objective
Implement the progressive escalation schedule that increases communication frequency and urgency as the expiration date nears (10d Warning → 7d Important → 3d Urgent → 1d Critical → Expired Action Required).

#### Why it is needed
Ensures escalating pressure on non-responsive clients before legal documents expire and disrupt shipping operations.

#### Where it should be implemented
`lib/services/escalation-dispatcher.ts`

#### Expected Result
- Escalation Rules:
  - **10 Days**: Severity `Warning`, sends In-App + Email (Informational tone).
  - **7 Days**: Severity `Warning`, sends In-App + Email reminder.
  - **3 Days**: Severity `Urgent`, sends In-App + Urgent Email + WhatsApp notification.
  - **1 Day**: Severity `Critical`, sends In-App + Critical Email + WhatsApp notification + Staff alert.
  - **Expired (Day 0)**: Severity `Critical`, sends In-App + Account Inactive Email + WhatsApp + Staff alert.
- Handles deduplication per threshold stage.

#### Dependencies
- Subtask 03
- Subtask 05 (`EmailService`)
- Subtask 06 (`WhatsAppService`)

#### Acceptance Criteria
- All 5 escalation tiers execute appropriately without skipping stages.
- Re-calculates and elevates warning tier in database.

---

### Subtask 05 — Transactional HTML Email Service & Branded Templates (Nodemailer)

#### Objective
Build the transactional email delivery engine using Nodemailer and craft responsive, professional HTML email templates matching NileLink branding for all notification scenarios.

#### Why it is needed
Ensures emails look enterprise-grade on desktop and mobile clients (Outlook, Gmail, Apple Mail).

#### Where it should be implemented
- `lib/email/email-service.ts`
- `lib/email/templates/expiry-warning-email.tsx`
- `lib/email/templates/document-status-email.tsx`
- `lib/email/templates/account-verification-email.tsx`

#### Expected Result
- Configurable SMTP transport (supports SendGrid, AWS SES, Gmail, custom SMTP via `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
- **Templates**:
  1. `10-Day Expiry Notice`: Blue/Amber header, document name, expiry date, direct "Renew Document" button.
  2. `3-Day Urgent Notice`: Orange header, countdown badge, urgency warning text.
  3. `Document Expired Notice`: Red header, account suspended notice, immediate resolution button.
  4. `Document Approved / Rejected Notice`: Clear status badge and reviewer notes.
- Fully bilingual templates (Arabic / English side-by-side or based on user preferred language).

#### Dependencies
- `nodemailer`
- `@types/nodemailer`

#### Acceptance Criteria
- Validated with responsive email testing (passes mobile client rendering).
- Safe fallback when SMTP credentials are not configured in development (logs email body to console).

---

### Subtask 06 — WhatsApp Business API Client & Message Delivery Webhook

#### Objective
Build a modular WhatsApp client for the WhatsApp Business Cloud API (or Twilio/Infobip connector) to send pre-approved template messages and handle incoming delivery status webhooks (`Pending` → `Sent` → `Delivered` → `Failed`).

#### Why it is needed
Fulfills the core requirement to reach logistics managers via WhatsApp for urgent document expirations.

#### Where it should be implemented
- `lib/whatsapp/whatsapp-service.ts`
- `app/api/webhooks/whatsapp/route.ts`

#### Expected Result
- `sendWhatsAppExpiryAlert({ phone, customerName, documentName, daysRemaining, renewUrl, severity }): Promise<{ messageId: string, status: string }>`.
- Formats phone numbers to international format (e.g. `+20...`).
- Webhook endpoint `/api/webhooks/whatsapp`:
  - Validates webhook signature/token.
  - Updates `Notification.whatsappStatus` (`delivered`, `read`, `failed`).
  - Logs failure reasons (e.g. invalid phone number, user opted out).
- Mock/Sandbox mode in development if WhatsApp API credentials are not provided.

#### Dependencies
- `01-database-schema-models.md` (`Notification`)

#### Acceptance Criteria
- Webhook updates database delivery statuses accurately.
- Handles rate-limiting and temporary API errors gracefully with retry.

---

### Subtask 07 — Manual Employee Warning Dispatch Modal (Email / WhatsApp / Both)

#### Objective
Create the staff-facing modal allowing employees to manually trigger an immediate document expiry warning to a client with custom message options and channel selection (`Email`, `WhatsApp`, `Both`).

#### Why it is needed
Fulfills the direct user requirement: *"الموظف يقدر من داخل حساب العميل يضغط Send Expiry Warning ويختار Email, WhatsApp, Both مع تسجيل العملية في الـActivity Log"*.

#### Why it should be implemented
- `components/admin/documents/ManualWarningModal.tsx`
- `app/api/admin/documents/[id]/send-warning/route.ts`

#### Expected Result
- Modal triggered from Customer Overview table or Document Inspection view:
  - Displays Client Name, Contact Email, Contact Phone, Document Name, and Days Remaining.
  - Channel selection: `Email Only` | `WhatsApp Only` | `Both (Email & WhatsApp)` 🔘.
  - Message Preset selector: `Standard 10-Day Warning`, `Urgent 3-Day Notice`, `Final Notice Before Expiration`, `Custom Message`.
  - Custom note text box (optional).
  - Preview card showing the exact message that will be delivered.
  - `[Send Warning Now]` submit button with spinner.
- Calls `/api/admin/documents/[id]/send-warning`.
- Dispatches messages via selected channels, creates `Notification` record, and writes an entry in `DocumentActivityLog` (`action: "send_email_warning"` / `"send_whatsapp_warning"`, actor: Staff User).
- Displays instant Sonner toast: "Warning sent successfully to customer via Email & WhatsApp".

#### Dependencies
- Subtask 05 (`EmailService`)
- Subtask 06 (`WhatsAppService`)
- `07-document-review-verification-engine.md` (Activity Log)

#### Acceptance Criteria
- Disables channel options if client has no email or phone on file.
- Records exact staff ID, timestamp, and message snapshot in activity audit log.

---

### Subtask 08 — Notification Delivery Status & Activity Audit Logger

#### Objective
Create an administrative view and component displaying the real-time delivery status of all outbound notifications (In-App, Email, WhatsApp) for any document or client.

#### Why it is needed
Allows staff to verify whether a customer actually received the warning before escalating further.

#### Where it should be implemented
- `components/admin/notifications/NotificationStatusBadge.tsx`
- `components/admin/notifications/NotificationHistoryDrawer.tsx`

#### Expected Result
- Badges showing delivery statuses:
  - Email: `Sent` 🟢 | `Delivered` 🟢 | `Bounced / Failed` 🔴
  - WhatsApp: `Pending` 🟡 | `Sent` 🔵 | `Delivered` 🟢 | `Read` 🟣 | `Failed` 🔴
- Drawer showing the complete notification log for a document: Channel, Recipient, Dispatch Time, Delivery Time, Status, and Sender (System / Staff Name).

#### Dependencies
- Subtask 01 & Subtask 06

#### Acceptance Criteria
- Delivery status badges update dynamically when webhook arrives.

---

### Subtask 09 — Localization Strings for Notifications & Message Templates

#### Objective
Add all Arabic and English translations for notification titles, email templates, WhatsApp messages, and admin manual dispatch modal in `messages/ar.json` and `messages/en.json`.

#### Why it is needed
Guarantees natural, professional Arabic and English communication across all channels.

#### Where it should be implemented
- `messages/ar.json`
- `messages/en.json`

#### Expected Result
- `notifications` namespace containing:
  - `inboxTitle`, `markAllRead`, `noNotifications`, `filterAll`, `filterUnread`.
  - `emailTemplates`: subject10d, subject3d, subjectExpired, greeting, body10d, body3d, bodyExpired, renewButton, footerText.
  - `whatsappTemplates`: msg10d, msg3d, msgExpired.
  - `manualModal`: title, channelSelect, emailOption, whatsappOption, bothOption, presetSelect, customMessage, sendBtn, successToast.

#### Dependencies
- `next-intl`

#### Acceptance Criteria
- Both Arabic and English text maintain high linguistic quality and business formality.

---

## 4. Edge Cases & Handling

1. **Invalid or Missing Phone Number for WhatsApp**: If a client has no valid mobile number or WhatsApp fails, the system logs the failure, falls back to Email automatically, and alerts the staff member.
2. **Notification Flooding Prevention**: Strict 24-hour rate limit on manual warning dispatches per document (staff can override with a confirmation prompt).
3. **Email Delivery Bounces**: Catch SMTP bounce events and flag customer email as unverified if hard bounces occur.

---

## 5. Regression Requirements

- Must NOT modify existing contact form email delivery logic.
- Must handle missing email/WhatsApp environment variables safely without throwing fatal server crashes.

---

## 6. Acceptance Criteria Summary

- [ ] In-App Notification Center operational for both Customer and Staff.
- [ ] Automated 10-day warning worker triggers with deduplication.
- [ ] 5-stage escalation schedule (10d, 7d, 3d, 1d, Expired) fully supported.
- [ ] Responsive HTML email templates rendered and dispatched via Nodemailer.
- [ ] WhatsApp Business API client and webhook status tracking operational.
- [ ] Manual Employee Warning modal dispatches via Email/WhatsApp/Both with Activity Log audit.
