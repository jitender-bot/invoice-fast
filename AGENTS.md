# AGENTS.md — Instructions for AI Coding Agents (Antigravity / OpenCode)

You are building **InvoiceFast**, a clone of invoice-generator.com. Read `PRD.md`, `ARCHITECTURE.md`, and `DESIGN.md` in full before writing any code. They are the source of truth for scope and stack — do not introduce new dependencies, pages, or architectural patterns not listed there without flagging it first.

## Ground Rules

1. **Never deviate from the visual direction in `DESIGN.md` or the locked stack** in `ARCHITECTURE.md` (Next.js 15 App Router, TypeScript, Tailwind, shadcn/ui, Zustand, Prisma+Neon, NextAuth.js with Google + Credentials (email/password) providers, Resend, `@react-pdf/renderer`, Vercel Blob). If a task seems to need something outside this list, stop and ask instead of silently adding a package. Resend is scoped to exactly one email type — password reset — do not use it (or add razorpay/Stripe) for invoice-sending or any other purpose without being explicitly asked. Password hashing uses `bcrypt` only — never store or log a plaintext password, and never roll a custom hashing scheme.
2. **Performance is a hard constraint, not a nice-to-have.** Before adding any client-side dependency, check its bundle size. Never import the NextAuth/Prisma client into a component that renders on the homepage's critical path — always dynamic-import it behind user interaction on `/history`.
3. **The homepage must render and be interactive with zero auth/DB calls.** Any code you write for `/` must work correctly for a fully logged-out, DB-less user. History is `localStorage`-first by default; auth (Google sign-in) only ever gates the optional Cloud Mode sync on `/history`, never the core editor.
4. **One source of truth for invoice data.** The `<InvoicePreview />` component in `/components/invoice-preview` must be reused identically by the on-screen editor and the `@react-pdf/renderer` PDF document — do not fork this into two implementations that can drift apart.
5. **Calculation logic lives in pure functions** (`/lib/calculations.ts`) — subtotal, tax, discount, shipping, total, balance due. Never inline this math in a component. These functions must be unit-testable with no React/Next dependency.
6. **Theming**: every new component must support both light and dark via Tailwind `dark:` classes / CSS variables — never hardcode a color that only works in one theme. Exception: the exported PDF, which is always light/print-themed by design (see ARCHITECTURE.md §6).
7. **SEO is not optional polish.** Every new route under `(marketing)` needs a `generateMetadata()` export with a unique title/description. Do not ship a guide page without it.
8. **Follow the sitemap in PRD.md §6 exactly** for route naming — these URLs are the SEO plan; renaming routes later costs ranking.
9. **Small, reviewable diffs.** Build one feature vertical-slice at a time (e.g., "line items table" fully working end-to-end) rather than scaffolding every file empty across the whole app.
10. **Do not fabricate NextAuth.js/Google OAuth/Prisma API details from memory.** If unsure of a current API surface (e.g., a NextAuth callback signature), say so and ask to verify against current docs rather than guessing.

## Code Style

- TypeScript strict mode, no `any` unless justified with a comment.
- Functional components only, no class components.
- Co-locate component-specific types with the component; shared types in `/lib/types.ts`.
- Prefer server components by default; add `"use client"` only where interactivity is actually needed (the editor, theme toggle, forms).
- Tailwind class order: layout → spacing → typography → color → state — keep it scannable, don't fight it if a formatter already handles this.

## Testing Expectations

- Unit tests for everything in `/lib/calculations.ts` and `/lib/currency.ts` (pure logic, cheap to test, high value — this is money math, it must be correct).
- No requirement for full E2E coverage in MVP, but the invoice editor's "fill form → download PDF" path should have at least one integration test before Phase 1 is considered done.

## Definition of Done (per feature)

- Works logged out (if applicable) and logged in.
- Works in both light and dark theme.
- Passes Lighthouse ≥ 95 performance/SEO on any new/changed route.
- No new client-side dependency added without checking it against the performance budget in `ARCHITECTURE.md` §8.
- Metadata/SEO present for any new public route.

## Verification Gate — mandatory before moving to the next step

Do not advance to the next feature/step until you have actually done all of the following — not just asserted them:

1. **Run the build.** Execute `npm run build` (or the project's build command) and confirm it exits with no errors and no new TypeScript errors. A feature that "looks right" in a diff but doesn't build is not done.
2. **Run the dev server and load the affected route(s).** Confirm no console errors/warnings in terminal or browser console. If you cannot actually load a browser in this environment, run the dev server, hit the route with a request (e.g. `curl`), and check the response is a valid 200 with expected markup — don't rely on reading your own code and assuming it renders.
3. **Run relevant tests.** If you touched `/lib/calculations.ts` or any other unit-tested logic, run the test suite and confirm it passes — including any new tests you added for the change.
4. **Re-check both themes.** Actually toggle light/dark (or inspect the rendered class/token output) rather than assuming Tailwind `dark:` classes were applied correctly everywhere you intended.
5. **State the verification result explicitly in your summary** — "build passed, dev server loaded `/` with no console errors, tests green (4/4), verified in both themes" — not just "implemented X." If any check failed or couldn't be performed, say so plainly instead of omitting it.

If a check fails, fix it before reporting the step as complete — do not move to the next step with a known-broken build, failing test, or unverified claim.

## When Stuck

If a requirement in `PRD.md` is ambiguous or a technical approach in `ARCHITECTURE.md` doesn't fit something you've discovered mid-build, stop and surface the tradeoff clearly (what changed, options, your recommendation) rather than quietly picking one and continuing.
