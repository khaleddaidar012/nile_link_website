# Request Workflow Redesign

## Objective
Redesign the Customer Request Workflow to provide a professional, transparent, and actionable experience for customers, similar to modern international logistics platforms. The customer must always know the current state of their request, what action is required from them, and the status of quotations and required documents (UCR/ACID).

## Current System Analysis Summary
- **Requests**: Handled by `CustomerRequest` model with a top-level `status`, dynamic `services` array, and a `timeline` array.
- **Quotations**: Saved using `Quote` and `QuoteItem` models, which now support multiple breakdown legs.
- **Documents**: `Document` model manages uploads but lacks a strong integration loop with the specific `CustomerRequest` workflow for UCR/ACID.
- **Notifications**: `Notification` model handles alerts but lacks a robust actionable mechanism routing directly to the quotation or document requirement in the request UI.
- **Customer Portal**: `/portal/requests/[id]` lacks a dedicated Quotation section, an actionable Action Required section, and an integrated Document requirement flow.

## Target Workflow Flow
```text
Customer creates request
        ↓
Employee reviews request
        ↓
Required document (UCR/ACID)?
   ┌────┴────┐
   Yes       No
   ↓         ↓
Customer uploads document
   ↓
Employee reviews
   ↓
Approved?
 ┌──┴──┐
 No    Yes
 ↓      ↓
Retry   UCR/ACID obtained
          ↓
     Employee quotation
          ↓
     Customer reviews
          ↓
       Approved?
       ┌──┴──┐
       No    Yes
       ↓      ↓
    Clarify  Continue
                ↓
             Processing
                ↓
             Completed
```

## Architecture Decisions
- Centralize workflow states using existing models (`CustomerRequest`, `Quote`, `Document`) but formalize the `status` enum transitions.
- Build a unified "Action Required" UI component on the frontend that reads the current aggregate state of the Request + Quote + Documents.
- Decouple internal technical statuses (like `quote_provided`) from the translated human-readable UI.

## Implementation Phases
1. **State Machine & Data Models**: Formalize statuses and transitions.
2. **Quotation Workflow**: Implement dedicated quotation views inside the request.
3. **UCR/ACID Document Workflow**: Connect required documents to requests and handle approval/rejection.
4. **Customer Portal Redesign**: Update request details page to show Progress, Action Required, Quotation, and Documents.
5. **Employee Portal Sync**: Ensure employees can drive the workflow (request documents, approve, quote).
6. **Notifications**: Update notification actions.
7. **i18n & Security**: Ensure translation robustness and data boundaries.

## Testing Strategy
- Manual end-to-end testing of Import/Export flows from Customer creation to Employee Quote to Customer Approval.
- Verify security boundaries (Customer can only see/approve their own quotes).
