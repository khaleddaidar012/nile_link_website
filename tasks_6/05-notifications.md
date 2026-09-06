# Task: Notifications & Communication

Status: pending
Priority: medium

## Objective
Implement a multi-channel notification system (In-App, Email, WhatsApp) to alert customers and employees about document expiries and status changes.

## Dependencies
- Requires `04-workflow-expiry.md`

## Acceptance Criteria
- [ ] Customers receive in-app alerts for expiring documents.
- [ ] Employees see alerts for their assigned customers.
- [ ] Progressive warnings change UI state (color, badge) based on urgency.
- [ ] Automated emails are sent 10 days before expiry.
- [ ] Employees can manually trigger WhatsApp/Email reminders.

---

### Subtask 5.1 — Progressive Warning UI
- [ ] Define styling tokens for warning states: Normal (>30d), Warning (10-30d), Urgent (3-9d), Critical (0-2d), Expired.
- [ ] Update Customer and Admin dashboards to display these badges and colors on expiring documents.
- [ ] Add a specific alert banner to the Customer Dashboard: "⚠ Your [Document] will expire in [X] days. [Upload New Document]".

### Subtask 5.2 — Notification Centers
- [ ] Build `Customer Notification Center` page/dropdown.
- [ ] Build `Admin Notification Center` aggregating alerts for all managed customers.
- [ ] Create `Notification` database model and API endpoints.

### Subtask 5.3 — Email Notification Integration
- [ ] Integrate an email provider (e.g., SendGrid, AWS SES, Nodemailer).
- [ ] Create email templates for different urgency levels (Warning, Urgent, Expired).
- [ ] Hook email sending into the Expiry Detection Engine (specifically for the 10-day mark).
- [ ] Log all sent emails in the `Activity Log`.

### Subtask 5.4 — WhatsApp & Manual Notifications
- [ ] Prepare WhatsApp API integration (e.g., Twilio).
- [ ] Build UI for employees to manually trigger "Send Expiry Warning".
- [ ] Provide options for the employee to select Email, WhatsApp, or Both.
- [ ] Track message status (Pending, Sent, Delivered, Failed) in the Activity Log.
