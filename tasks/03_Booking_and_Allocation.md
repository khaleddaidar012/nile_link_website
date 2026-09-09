# Task 03 — Booking and Allocation

## 1. Objective
Implement the Booking and Allocation data structures seamlessly into the existing `RequestService` architecture.

## 2. Current Implementation Analysis
- **`CustomerRequest`** represents the global shipment.
- **`RequestService`** (stored in `services` array of `CustomerRequest`) represents individual operations like `sea_freight`, `air_freight`, `land_transport`.
- There are no explicit `Booking` or `Allocation` schemas in `lib/models`.

## 3. Gap Analysis
### Missing
- The entire Booking (e.g., Vessel/Carrier Booking Reference, Departure Time) and Allocation (e.g., Assigning physical trucks/drivers/containers) mechanisms.

## 4. Functional Requirements
- **Booking**: Ability to add carrier/vessel booking references, ETA, ETD, and Vessel Name to a specific `RequestService` (like `sea_freight`).
- **Allocation**: Ability to assign physical resources (like Truck Plate Number, Driver Name) to a `land_transport` service.

## 5. Technical Requirements
### Backend & Database
- Do NOT create new root collections unless absolutely necessary.
- **Extend `RequestService` Schema**:
  Add a `bookingDetails` sub-document (carrier, bookingReference, etd, eta).
  Add an `allocationDetails` sub-document (resourceType, resourceName, reference).
- Update the `IRequestService` interface in `lib/models/RequestService.ts`.

### Frontend
- **Admin UI**: In the `RequestService` card on the Admin Details page, add a "Manage Booking" button for Sea/Air Freight, and a "Manage Allocation" button for Land Transport.
- **API**: Create `POST /api/admin/services/[serviceId]/booking` and `POST /api/admin/services/[serviceId]/allocation`.

## 6. Files To Reuse
- `lib/models/RequestService.ts`
- `app/[locale]/admin/requests/[id]/page.tsx`

## 7. Files To Create
- `app/api/admin/services/[id]/booking/route.ts`
- `app/api/admin/services/[id]/allocation/route.ts`

## 8. Files To Modify
- `lib/models/RequestService.ts`
- `app/[locale]/admin/requests/[id]/page.tsx`

## 9. Dependencies
- Depends on Epic 01.

## 10. Subtasks
### 10.1 Schema Updates
- [ ] Add `bookingDetails` and `allocationDetails` to `RequestServiceSchema`.

### 10.2 Backend APIs
- [ ] Create booking and allocation API endpoints to update these fields.
- [ ] Append appropriate timeline events (`milestone_booking_confirmed`).

### 10.3 Frontend UI
- [ ] Build modal components in the Admin panel to input booking/allocation data.
- [ ] Display the saved booking/allocation details on the Customer Portal so clients can see vessel/truck assignments.

## 11. Business Rules
- Allocation typically follows Booking.
- You cannot book a vessel for a Request that is not yet in `processing`.
