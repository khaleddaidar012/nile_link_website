## Objective
Ensure document uploads are robust, secure, and tightly coupled with the specific Request workflow.

## Current Implementation
The portal has `MultiFileUploadZone` which uploads files to `/api/portal/documents`. The `Document` model stores it.

## Problem
Currently, files uploaded are loose documents. There is no clear association specifying "This document satisfies the UCR requirement for Request ID 123".

## Proposed Solution
1. Modify `/api/portal/documents` to accept an `entityId` (the Request ID) and a `category` (e.g., `ucr_document`, `commercial_invoice`).
2. Update the frontend upload zone to pass these parameters.
3. Validate that the user uploading the document actually owns the `entityId` (CustomerRequest).

## Files To Modify
- `app/api/portal/documents/route.ts`
- `components/portal/documents/MultiFileUploadZone.tsx`

## Acceptance Criteria
- [ ] Documents are strictly linked to a `CustomerRequest`.
- [ ] Document categories clearly define their business purpose.
- [ ] Customer cannot upload arbitrary files into another customer's request.

## Dependencies
- `04-ucr-acid-workflow`
