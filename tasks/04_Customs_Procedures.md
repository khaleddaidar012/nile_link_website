# Task 04 — Customs Procedures & Transportation

## 1. Objective
Map out and implement the rigorous customs tracking checkpoints (Factory Loading, Customs Entry, Clearance Complete) directly into the `customs_clearance` and `land_transport` service timelines.

## 2. Current Implementation Analysis
- **Services:** `CustomerRequest` contains an array of `RequestService`. A service could be `serviceKey: "customs_clearance"`.
- **Status:** Currently, `RequestService.status` is simple (`pending`, `in_progress`, `completed`).
- **Timeline:** The `timeline` array inside `RequestService` supports robust logging of status shifts.

## 3. Gap Analysis
### Missing
- Specific procedural checkpoints like "إجراء 46" (Opening Declaration), "Factory Loading", "Customs Circle Entry".

## 4. Functional Requirements
- Provide the Admin UI with predefined "Action Checkpoints" for Customs Clearance services.
- When an Admin clicks "Factory Loading", it explicitly pushes a timeline event to the service, and bubbles up a global timeline event to the `CustomerRequest`.

## 5. Technical Requirements
### Backend
- Expand `RequestService.status` to allow granular statuses:
  - `factory_loading`
  - `customs_entry`
  - `declaration_opened` (إجراء 46)
  - `clearance_completed`
- Create a reusable API endpoint `POST /api/admin/services/[id]/status` that handles these specific transitions and validates them.

## 6. Files To Reuse
- `lib/models/RequestService.ts`
- `app/api/admin/requests/[id]/route.ts`

## 7. Files To Create
- `app/api/admin/services/[id]/status/route.ts`

## 8. Files To Modify
- `lib/models/RequestService.ts`
- `messages/ar.json` (Add translation keys for the new statuses).

## 9. Dependencies
- Depends on Epic 03 (Allocation of trucks often precedes Factory Loading).

## 10. Subtasks
### 10.1 Extend Statuses
- [ ] Add the new granular statuses to the frontend type definitions.
- [ ] Add the translations in `ar.json` and `en.json`.

### 10.2 Backend API
- [ ] Create `POST /api/admin/services/[id]/status/route.ts`.
- [ ] Implement validation (e.g., cannot enter customs before factory loading).

### 10.3 Frontend UI
- [ ] Add quick-action buttons for these specific milestones on the Admin Request Details page under the Customs Clearance service card.

## 11. Business Rules
- Status transitions should ideally be sequential.
- `clearance_completed` must occur before Final Shipping Documents can be fully issued.
