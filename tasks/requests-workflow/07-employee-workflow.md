## Objective
Ensure the employee/admin view mirrors the business state presented to the customer, allowing employees to unblock workflows (e.g., requesting documents, reviewing documents, providing quotes).

## Current Implementation
The employee portal `/admin/requests/[id]` has tabs for Details, Timeline, and Quote. The Quote generation was just updated to support multiple legs. However, the document review process and the ability to manually advance statuses is not formalized.

## Problem
Employees lack a unified control panel to say "I need the UCR document now" or "Approve Document and advance to Quote phase".

## Proposed Solution
1. Add an "Action Required" equivalent for employees: e.g., "Customer has uploaded UCR document. Review it now."
2. Build UI controls for the employee to Approve/Reject uploaded documents.
3. If approved, allow the employee to enter the UCR/ACID number, which updates the `CustomerRequest` state and notifies the customer.

## Files To Modify
- `app/[locale]/admin/requests/[id]/page.tsx`
- `app/api/admin/documents/[id]/review/route.ts` (New or Modify)

## Acceptance Criteria
- [ ] Employee can see uploaded documents tied to the specific request.
- [ ] Employee can approve/reject with a reason.
- [ ] Status updates propagate back to the customer's portal correctly.

## Dependencies
- `04-ucr-acid-workflow`
- `05-customer-portal`
