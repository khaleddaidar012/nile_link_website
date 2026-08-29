# NileLink Test Credentials & Access Guide

This document contains pre-configured test credentials for evaluating the NileLink Logistics Platform.

---

## 1. Client Account (Customer Admin)

Use this account to test the Client Portal, corporate document uploads, compliance tracking, and shipping operations.

| Parameter | Value |
| :--- | :--- |
| **Login URL** | `http://localhost:3000/en/login` or `http://localhost:3000/ar/login` |
| **Work Email / Identifier** | `mohamed@alexexport.com` |
| **Password** | `SecurePass123!` |
| **Role** | `customer_admin` |
| **Company Name** | Alexandria Export & Maritime S.A.E. |
| **Commercial Register (CR)** | CR-89412-ALEX |
| **Tax Card Number** | TAX-77410-EG |
| **Default Target Route** | `/portal` |

---

## 2. Staff Admin Account (Customs & Document Inspector)

Use this account to inspect and verify uploaded customer certificates, approve or reject submissions, and manage system operations.

| Parameter | Value |
| :--- | :--- |
| **Login URL** | `http://localhost:3000/en/login` or `http://localhost:3000/ar/login` |
| **Email / Identifier** | `staff@nilelink.com` |
| **Password** | `StaffAdmin2026!` |
| **Role** | `staff` / `super_admin` |
| **Default Target Route** | `/admin` |
| **Review Queue** | `http://localhost:3000/en/admin/documents/review` |

---

## 3. Registration Guidelines for Testing

When registering a new company account on `http://localhost:3000/en/login?tab=register` or `http://localhost:3000/ar/login?tab=register`:

1. **Work Email**: Must be a corporate/business email domain (e.g. `admin@nilelogistics-corp.com`, `logistics@cairo-freight.eg`).
   > *Note: Free webmail domains such as `@gmail.com`, `@yahoo.com`, `@hotmail.com`, and `@outlook.com` are strictly rejected by compliance validation.*
2. **Password Security**: Must satisfy real-time criteria:
   - Minimum 8 characters
   - At least one uppercase letter (`A-Z`)
   - At least one lowercase letter (`a-z`)
   - At least one number (`0-9`)
   - At least one special symbol (`!@#$%^&*`)
3. **Post-Registration**: Newly registered accounts will be directed to the WhatsApp & Business Email verification onboarding flow.
