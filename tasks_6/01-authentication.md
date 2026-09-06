# Task: Authentication & Security Architecture

Status: pending
Priority: high

## Objective
Establish a secure authentication and authorization system, enabling customers and employees to access their respective portals securely.

## Dependencies
- None. This is the foundational task.

## Acceptance Criteria
- [ ] Users can register, log in, and log out.
- [ ] Passwords are securely hashed.
- [ ] JWT or secure sessions are utilized.
- [ ] Role-based access control restricts access correctly (Customer vs Admin).
- [ ] Existing marketing website layout is preserved.
- [ ] Arabic and English localizations function correctly on Auth pages.

---

### Subtask 1.1 — Database Models
- [ ] Create `User` model with fields for Email, Password (hashed), Role (Customer, Customer Admin, Staff, Super Admin), and related Customer/Company ID.
- [ ] Add Mongoose schemas and indexes for fast lookup by email.

### Subtask 1.2 — Authentication Backend
- [ ] Implement secure password hashing.
- [ ] Create JWT generation and verification utility.
- [ ] Create `POST /api/auth/login` endpoint.
- [ ] Create `POST /api/auth/register` endpoint.
- [ ] Create `POST /api/auth/logout` endpoint.
- [ ] Create `POST /api/auth/refresh` endpoint if using short-lived tokens.
- [ ] Implement middleware to protect API routes based on user session and role.

### Subtask 1.3 — Account Verification & Password Recovery
- [ ] Create `POST /api/auth/forgot-password` endpoint.
- [ ] Create `POST /api/auth/reset-password` endpoint.
- [ ] Implement email sending logic for verification and reset tokens.

### Subtask 1.4 — Frontend Auth Pages
- [ ] Add `Login` and `Sign Up` entry buttons to the existing website header without breaking current styling.
- [ ] Build a professional `Login` page (Email, Password, Remember Me, Forgot Password, Show/Hide Password).
- [ ] Build a `Registration` page capturing Account, Company, and Contact details.
- [ ] Build `Forgot Password` and `Reset Password` pages.
- [ ] Handle frontend validation, loading states, and error messages.
