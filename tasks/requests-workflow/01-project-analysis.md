## Objective
Analyze the current state of the request workflow, data models, APIs, and UIs to establish the baseline for the redesign.

## Current Implementation
- **CustomerRequest Model**: Defines `operationType` (`import`, `export`, `transit`, `none`), a string `status`, an array of `timeline` events, and `attachments`.
- **Document Model**: generic document storage with `entityType`, `entityId`, and `status` (`pending_review`, `approved`, `rejected`).
- **Quote Model**: Dedicated model for quotations with `status` (`sent`, etc.). It links to `CustomerRequest` via `requestId`.
- **Notification Model**: Emits notifications (e.g. `request_update`) via `in_app` channels but action URLs and specific routing for UCR/ACID or quotes are missing.
- **Frontend Portal**: `app/[locale]/portal/requests/[id]` renders a flat timeline and a generic file upload zone. Quotation details are semi-hardcoded into the timeline if `details.quote` exists, but the new `Quote` schema is not fully integrated as a dedicated interactive section.

## Problem
- The customer does not have a clear "Action Required" prompt.
- Quotations are hidden or poorly integrated into the portal request page.
- UCR/ACID document collection is not a formalized step blocking the workflow.
- Notifications are non-actionable.

## Proposed Solution
Map out the exact state machine and components needed. The analysis confirms we have all the foundation models (`CustomerRequest`, `Document`, `Quote`, `Notification`). We only need to normalize their integration, specifically defining formal string states and building a dedicated UI layer that reads the aggregate state of these 4 models.

## Files To Modify
N/A - Analysis Phase.

## Acceptance Criteria
- [x] Project architecture understood.
- [x] Missing workflow states identified.
- [x] Foundation models evaluated.

## Dependencies
None.
