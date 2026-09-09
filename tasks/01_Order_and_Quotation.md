# Task 01 — Order and Quotation

## 1. Objective
Enable the seamless transition of an accepted quotation into an active "Order / Shipment" while keeping the system streamlined.

## 2. Current Implementation Analysis
The system currently uses `CustomerRequest` as the overarching entity for shipments and orders. There is no separate `Order` collection.
- When a `Quote` is generated (`POST /api/admin/quotes`), it maps back to a `CustomerRequest`.
- When a customer accepts a quote (`POST /api/portal/quotes/[id]/action`), the `Quote.status` becomes `accepted`, and the `CustomerRequest.status` transitions to `quote_accepted`.
- The `operationType` field on `CustomerRequest` designates the type (Import/Export/Transit).

## 3. Gap Analysis
### Already Implemented
- Quotation logic, Approval logic, Status linking.
- Storing `operationType` on the `CustomerRequest`.

### Partially Implemented
- Transition logic: The request status becomes `quote_accepted`, but it relies on manual admin intervention to move it to `processing`.

### Missing
- An automated API / UI hook to formally "Confirm Shipment" after a quote is accepted, moving it into active execution (`processing` status) and populating required operational fields.

## 4. Functional Requirements
- Allow an Admin to formally confirm an accepted quotation and transition the `CustomerRequest` status from `quote_accepted` to `processing`.
- Automatically copy any relevant final pricing details from the approved quotation into a readonly summary on the active shipment page.
- Prevent this confirmation if the quotation was rejected or expired.

## 5. Technical Requirements
### Backend & API
- **New API:** `POST /api/admin/requests/[id]/confirm-order`
- **Validation:** Check if `CustomerRequest.status === "quote_accepted"` and ensure the associated `Quote` is `accepted`.
- **Database:** Update `CustomerRequest.status = "processing"`.

### Frontend
- **UI:** In the Admin Dashboard (`app/[locale]/admin/requests/[id]/page.tsx`), when `status === "quote_accepted"`, show a "Confirm Order & Begin Processing" button instead of the standard "Generate Quote" section.

## 6. Files To Reuse
- `lib/models/CustomerRequest.ts`
- `lib/models/Quote.ts`
- `app/[locale]/admin/requests/[id]/page.tsx`

## 7. Files To Create
- `app/api/admin/requests/[id]/confirm-order/route.ts`

## 8. Files To Modify
- `app/[locale]/admin/requests/[id]/page.tsx`

## 9. Dependencies
None. This is the foundation.

## 10. Subtasks
### 10.1 Backend API
- [ ] Create `POST /api/admin/requests/[id]/confirm-order/route.ts`.
- [ ] Add validation to ensure the quote is fully accepted.
- [ ] Append a timeline event `title: "Order Confirmed"`.

### 10.2 Frontend UI
- [ ] Update `app/[locale]/admin/requests/[id]/page.tsx` to display the "Confirm Order" action block when in `quote_accepted` state.
- [ ] Integrate the API call and refresh the page data upon success.

## 11. Business Rules
- Orders cannot be activated against unapproved or expired quotations.
- The `CustomerRequest` remains the single source of truth for the active shipment.
