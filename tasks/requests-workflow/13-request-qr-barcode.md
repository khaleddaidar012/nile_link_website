# Task 13: Shipment QR Navigation

## Objective
Add a fast navigation method for employees to open specific request/shipment details by scanning a unique QR code associated with each request.

## Current Implementation
Employees must manually search for a request tracking number or click through the request queue at `/ar/admin/requests`. There is no barcode or QR integration.

## Business Requirement
- Every request must have a unique scannable QR code.
- When scanned, it should direct the user's device straight to the request details page.
- The QR must not expose sensitive data directly in its payload, just the navigation reference.

## UX Behavior
- A QR code icon will be added to the request table rows and the request details header.
- **Desktop**: Hovering over the icon displays the QR code in a small popover. 
- **Closing**: Clicking outside the popover hides it. Clicking inside does not hide it.
- **Visuals**: Will use existing UI styles, Lucide icons (`QrCode`), and animations via Headless UI or Framer Motion.

## Mobile Behavior
- **Touch**: Tapping the QR icon opens the popover. Tapping outside closes it. This ensures compatibility for tablet/mobile users who do not have hover capabilities.

## QR/Barcode Generation
- Will use `qrcode.react`, a lightweight, dependency-free React library that draws the QR code to an SVG or Canvas directly on the client. No server-side generation is needed, saving backend resources.

## Scan/Navigation Behavior
- The QR payload will encode the absolute URL to the employee request details page: `https://[domain]/[locale]/admin/requests/[id]`.
- Scanning with a standard phone camera or scanner will prompt the device to open the URL.
- No custom routing required; it reuses the existing `app/[locale]/admin/requests/[id]/page.tsx`.

## Authorization Requirements
- Since the payload is just a URL, scanning it relies on the browser.
- Existing Next.js middleware and API authorization (`session.role === "staff"`) will automatically enforce security.
- If an unauthenticated user scans the code, they will be redirected to the login page. Private data is never exposed in the QR payload itself.

## Files to Modify
- **Dependencies**: Add `qrcode.react` to `package.json`.
- **Frontend Components**:
  - `components/admin/requests/RequestQRCode.tsx` (New component wrapping `@headlessui/react` Popover and `qrcode.react`).
  - `app/[locale]/admin/requests/page.tsx` (Add the component to the tracking number column or actions column).
  - `app/[locale]/admin/requests/[id]/page.tsx` (Add to the AdminHeader for easy scanning/printing from the details page).

## Backend Changes
- None required. Existing route structure and authentication natively support this flow.

## Acceptance Criteria
- [ ] `qrcode.react` is installed.
- [ ] `RequestQRCode` component is created using Headless UI Popover.
- [ ] Hovering over the trigger on desktop shows the QR.
- [ ] Tapping on mobile shows the QR.
- [ ] Clicking outside closes the popup; clicking inside keeps it open.
- [ ] The payload strictly contains the safe URL to the request.
- [ ] Unauthenticated scans successfully block access and redirect to login.
- [ ] The feature seamlessly integrates into the request list and detail views without breaking existing layout.
