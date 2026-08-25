# TASKS

Implementation plan for the requested changes. Each task is small and independently testable.

## Task 1: Brand name — keep English in Arabic version
- [x] Update `contact.hero.companyName` in all 7 locale files (`messages/*.json`) to `Nile Link Logistics Services` (English brand name; do not translate into Arabic).
- [x] Update `CONTACT.COMPANY_NAME` in `constants/contact.ts` to `Nile Link Logistics Services`.
- [x] Verify `ContactHero` displays the English brand name correctly in Arabic and English.

## Task 2: Remove QR code section completely
- [x] Remove `ContactQr` import and `<ContactQr />` usage from `app/[locale]/contact/page.tsx`.
- [x] Delete `components/sections/contact/ContactQr.tsx`.
- [x] Remove `contact.qr` translation keys (`title`, `description`, `qrLabel`) from all 7 locale files.
- [x] Verify page layout/spacing flows well after removal.

## Task 3: Footer phone — single number
- [x] In `components/layout/Footer.tsx`, remove the two existing phone links (`tel:+201000842099` / `+2 0100 0842099`, `tel:+201222965980` / `+2 01222965980`).
- [x] Add a single phone link: `+20 10 00018549` / `tel:+20100018549`.
- [x] Verify footer contact section.

## Task 4: WhatsApp number formatting
- [x] In `constants/contact.ts`, format the WhatsApp card `value` cleanly and professionally (e.g. `+20 10 0001 8549`), keeping `href: https://wa.me/201000018549`.
- [x] Ensure WhatsApp value differs visibly from the phone card value.

## Task 5: Contact card — landline + Arabic label
- [x] In `messages/ar.json`, change `contact.channels.phone.title` from `الهاتف` to `تلفون`.
- [x] Extend `ContactChannel` type with optional secondary value/href for the phone card.
- [x] Add the landline number (`0572222008` / `tel:0572222008`) under the telephone section in `constants/contact.ts`.
- [x] Update `ContactCards.tsx` to render the secondary line when present.
- [x] Verify phone/WhatsApp are visually distinct and organized.

## Task 6: Social media cards — hidden by default
- [x] Add `hidden?: boolean` to `ContactChannel` type.
- [x] Add Instagram, X (Twitter), Discord channel entries to `CONTACT_CHANNELS` with `href: "#"` and `hidden: true`, using `FaInstagram`, `FaTwitter`, `FaDiscord` icons.
- [x] Update `ContactCards.tsx` to filter out hidden channels.
- [x] Add translation keys for the 3 new channels in all 7 locale files.
- [x] Tell the user how to unhide the cards and where to replace the `#` links with real URLs.

## Task 7: Final verification
- [x] Run `npm run lint`.
- [x] Run TypeScript typecheck (`npx tsc --noEmit`).
- [x] Spot-check Arabic and English contact page in dev server.
  - [x] Brand name `Nile Link Logistics Services` renders in both en/ar.
  - [x] Phone card (`tel:+20100018549`) and landline (`tel:0572222008`) render in both locales.
  - [x] WhatsApp link renders; Instagram/X/Discord cards stay hidden (placeholders `#`).
  - [x] Arabic `تلفون` label renders correctly.
