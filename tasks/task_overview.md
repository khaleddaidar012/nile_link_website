# Task Overview — Staff & Operations Management Suite

## Project Goal

Transform the requirements in `needs.md` into a production-grade, enterprise-ready **Staff Operations & Administration Suite** for NileLink Global Logistics. This plan covers:
1. Manager-driven employee account creation and granular Role-Based Access Control (RBAC).
2. Professional 360° customer accounts directory, document compliance health inspection, and account governance.
3. Automated document expiry tracking with multi-tier progressive escalation alerts (at 30, 20, 10, and 5 days remaining).
4. Live metadata editing during document review (title, category, issue & expiry dates) and dynamic system document categories in System Settings.
5. Staff portal theme switcher fix (Light/Dark Mode) and 100% multilingual translation across all 7 supported platform languages (`ar`, `en`, `fr`, `de`, `it`, `zh`, `bg`).
6. Executive operations dashboard and researched logistics industry enterprise modules badged with "Coming Soon" / "قريباً".

---

## Execution Order

- [x] **Task 01 — Staff Account Management & Granular Role-Based Access Control (RBAC)** (`task_01_staff_account_rbac_permissions.md`)
- [x] **Task 02 — Customer Accounts Directory & 360° Inspection View** (`task_02_customer_inspection_governance.md`)
- [x] **Task 03 — Multi-Tier Document Expiry Tracking & Automated Client Alert Escalation (30, 20, 10, 5 Days)** (`task_03_automated_document_expiry_escalation.md`)
- [x] **Task 04 — Document Review Metadata Live Editing & Dynamic System Categories Management** (`task_04_document_review_metadata_and_system_categories.md`)
- [x] **Task 05 — Staff Portal Theme Switcher (Dark/Light Mode) Fix & 100% Multilingual Localization Across All Locales** (`task_05_admin_theme_light_dark_and_multilingual.md`)
- [x] **Task 06 — Comprehensive Admin Analytics Dashboard & Logistics Industry Sidebar Roadmap Modules ("Coming Soon")** (`task_06_logistics_industry_sidebar_coming_soon.md`)

---

## Dependencies

```text
Task 01 (Staff RBAC & Permissions)
  │
  ├─► Task 02 (Customer Directory & Inspection)
  │     │
  │     └─► Task 03 (Multi-Tier Expiry Tracking: 30, 20, 10, 5 Days)
  │
  ├─► Task 04 (Review Metadata Editing & Dynamic System Categories)
  │
  └─► Task 05 (Theme Fix Light/Dark & 100% Multilingual Localization)
        │
        └─► Task 06 (Executive Analytics & Logistics "Coming Soon" Modules)
```

---

## Recommended Implementation Sequence

1. **Task 01 First (Security & RBAC Foundation)**:
   - Establish `staffPermissions` (`canSendAlerts`, `canReviewDocuments`, `canManageCustomers`) on the `User` schema and build the staff management dashboard (`/admin/staff`). This defines the permission boundaries that all subsequent staff tools enforce.
2. **Task 02 Second (Customer Inspection & Governance)**:
   - Build the 360° customer drawer and account status toggles (`active`, `warning`, `inactive`) so staff can inspect client legal standing and manage account restrictions based on permissions.
3. **Task 03 Third (Automated Expiry Alerts Engine)**:
   - Implement the automated 30, 20, 10, and 5-day warning escalation engine and the staff Notification Center radar.
4. **Task 04 Fourth (Document Review Live Editing & Dynamic Categories)**:
   - Enable live metadata adjustments (title, category, start/expiry dates) during document approval and create the System Settings page (`/admin/settings`) for adding custom document types.
5. **Task 05 Fifth (Theme Switching Fix & 7-Language Localization)**:
   - Fix the Dark/Light theme toggle throughout `/admin` and synchronize complete translation bundles in `ar`, `en`, `fr`, `de`, `it`, `zh`, and `bg` with native RTL layout.
6. **Task 06 Sixth (Executive Dashboard & Logistics Industry Roadmap)**:
   - Deliver the comprehensive analytics dashboard on `/admin` and integrate the 6 researched logistics enterprise modules (Shipments, Customs ACID, Demurrage Billing, Warehousing, Fleet Dispatch, CRM & Quotes) with "Coming Soon" / "قريباً" badges and dedicated preview pages.

---

## Global Acceptance Criteria

- **Employee RBAC**: Managers can create staff accounts and assign granular permissions (`canSendAlerts`, `canReviewDocuments`, `canManageCustomers`). Unauthorized operations return 403 Forbidden.
- **Customer Inspection**: Staff can click any customer account to open a rich 360° inspection view detailing compliance health, uploaded documents, expiring files, and account status controls.
- **Automated Expiry Engine**: Documents at 30, 20, 10, and 5 days before expiration automatically trigger progressive notification tiers to customers with direct renewal links.
- **Document Review Agility**: Reviewers can edit document title, category, and issue/expiry dates during approval, with instant real-time reflection on the client portal.
- **Dynamic Categories**: Managers can create new allowed document categories in System Settings (`/admin/settings`), and they appear immediately in client upload dropzones.
- **Theme Support**: The Dark/Light mode toggle functions smoothly across all staff pages with high contrast and persistent user preferences.
- **Multilingual Support**: 100% of text across all staff modules translates accurately into Arabic, English, French, German, Italian, Chinese, and Bulgarian with native RTL layout in Arabic.
- **Logistics Roadmap**: All 6 enterprise logistics modules appear in the sidebar with "Coming Soon" / "قريباً" badges and route to interactive roadmap preview pages.
- **Code Quality**: `npx tsc --noEmit` passes with 0 errors across the entire codebase.

---

## Final Testing

- [ ] Run full TypeScript compilation check (`npx tsc --noEmit`).
- [ ] Verify manager creates staff accounts and assigns granular permissions.
- [ ] Verify permission guards block unauthorized staff actions.
- [ ] Verify customer 360° inspection drawer lists all documents and updates account status.
- [ ] Verify automated expiry tracking triggers alerts at 30, 20, 10, and 5-day intervals.
- [ ] Verify document title and dates can be edited during review and update on client portal.
- [ ] Verify dynamic document categories added in `/admin/settings` appear in client upload zone.
- [ ] Verify Light Mode and Dark Mode toggle on all admin pages.
- [ ] Verify 100% Arabic translation and RTL orientation on `/ar/admin`.
- [ ] Verify all 6 "Coming Soon" logistics modules route to their respective preview pages.
