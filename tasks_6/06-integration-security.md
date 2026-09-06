# Task: Integration, Security & Testing

Status: pending
Priority: high

## Objective
Ensure the system is secure, performant, and thoroughly tested before production deployment.

## Dependencies
- Requires completion of Tasks 01 through 05.

## Acceptance Criteria
- [ ] APIs are protected with proper authorization checks.
- [ ] All major workflows (Login, Upload, Review, Notifications) are tested.
- [ ] Environment variables are properly configured.
- [ ] Activity Log tracks all critical actions accurately.

---

### Subtask 6.1 — Security & Access Protection
- [ ] Audit all API routes to ensure they have role-based authorization checks.
- [ ] Implement Rate Limiting on Authentication and Upload endpoints.
- [ ] Ensure Secure/HttpOnly flags are set on cookies.
- [ ] Verify that customers cannot access other customers' documents (IDOR protection).

### Subtask 6.2 — Activity Log Implementation
- [ ] Ensure the `Activity Log` captures: Customer document uploads, Employee reviews (approve/reject), Automated status changes, and Notifications sent.
- [ ] Build a simple timeline UI in the Admin portal to view the history of a specific document or customer.

### Subtask 6.3 — End-to-End Testing
- [ ] Write integration tests for the Authentication flow (Register, Login, Logout).
- [ ] Write tests for the Document Upload and Validation logic.
- [ ] Write tests for the Expiry Detection Engine logic to ensure dates are calculated correctly.
- [ ] Perform manual UX testing on mobile devices for the Customer Portal.

### Subtask 6.4 — Production Readiness
- [ ] Configure Environment Variables for Production (Database URIs, API Keys for Email/WhatsApp, JWT Secrets).
- [ ] Setup Error Logging monitoring (e.g., Sentry).
- [ ] Perform a final Production deployment and run sanity tests in the live environment.
