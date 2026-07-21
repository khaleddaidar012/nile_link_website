# Implementation Plan

## Task 1 — Remove "15+ Years Experience" Card from Homepage
> Remove the floating experience stat card from the AboutPreview section.

- [x] **1.1** Remove the floating stat card div from `components/sections/AboutPreview.tsx`
- [x] **1.2** Remove unused `Ship` SVG component and `Container` import
- [x] **1.3** Verify the homepage still renders correctly

## Task 2 — Fix Analytics Dashboard Authentication & Route Protection
> Improve security: separate JWT secret from login password, harden cookie settings.

- [x] **2.1** Add `ANALYTICS_SECRET` environment variable for JWT signing
- [x] **2.2** Update `lib/auth/session.ts` to use `ANALYTICS_SECRET` instead of `ANALYTICS_PASSWORD`
- [x] **2.3** Harden cookie: set `sameSite: "strict"` and add `path` in login/logout routes
- [x] **2.4** Verify dashboard page redirects unauthenticated users to login
- [x] **2.5** Verify dashboard API returns 401 for unauthenticated requests

## Task 3 — Optimize All Website Images Performance
> Improve image loading: configure Next.js image optimization, add priority/lazy loading, replace CSS backgrounds where feasible.

- [x] **3.1** Add `deviceSizes`, `imageSizes`, `minimumCacheTTL` to `next.config.ts`
- [x] **3.2** Add `priority` to above-the-fold images (all above-fold images are CSS backgrounds — will add `priority` when converting in 3.4)
- [x] **3.3** Add explicit `loading="lazy"` to below-the-fold images (Next.js already defaults to `lazy` for images without `priority`)
- [x] **3.4** Replace CSS `background-image` in hero sections with Next.js `<Image>` component for optimization
- [x] **3.5** Add missing `og-image.jpg` or update OpenGraph metadata to use existing image
- [x] **3.6** Verify image optimization config works

---

## Order of Execution
1. Task 1 (already partially done — verify and clean up)
2. Task 2 (security hardening)
3. Task 3 (performance optimization)
