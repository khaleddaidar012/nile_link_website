# Task: Customer & Admin Portals Core UI

Status: pending
Priority: high

## Objective
Create the core layout, dashboards, and profile management features for both the Customer Portal and the Admin Portal.

## Dependencies
- Requires `01-authentication.md`

## Acceptance Criteria
- [ ] Customer and Admin portals have distinct, professional layouts (Sidebar, Header).
- [ ] Responsive design works flawlessly on Mobile and Desktop.
- [ ] Localization (Arabic/English) is fully supported.
- [ ] Profile updates correctly persist to the database.

---

### Subtask 2.1 — Portal Layouts
- [ ] Create reusable `ClientPortalLayout` with Sidebar, Header, Profile dropdown, and Notification bell.
- [ ] Create reusable `AdminPortalLayout` with navigation for Employee features.
- [ ] Ensure layouts are fully responsive (collapsible sidebars on mobile).
- [ ] Implement dark/light mode support if part of the design system.

### Subtask 2.2 — Customer Dashboard
- [ ] Build `Customer Dashboard` page.
- [ ] Implement summary cards (e.g., Active Requests, Financial Status, Unread Notifications).
- [ ] Display recent activity timeline.
- [ ] Ensure empty states are handled gracefully.

### Subtask 2.3 — Customer Profile Management
- [ ] Build `Customer Profile` and `Company Profile` pages.
- [ ] Create API endpoints `GET /api/portal/profile` and `PUT /api/portal/profile`.
- [ ] Implement forms for updating contact information and company details.
- [ ] Add frontend validation and success/error toasts.

### Subtask 2.4 — Admin Dashboard Overview
- [ ] Build `Admin Dashboard` landing page.
- [ ] Implement summary statistics (Total Customers, Active Customers, Documents Pending Review).
- [ ] Add quick-access links to common employee tasks.
