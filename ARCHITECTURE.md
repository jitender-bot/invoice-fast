# ARCHITECTURE.md — Tech Stack & Architecture Plan

## 1. Tech Stack (locked)

| Layer                  | Choice                                                             | Why                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework              | **Next.js 15 (App Router)**, TypeScript                            | SSG/ISR for SEO pages + client interactivity for the editor, matches existing skill set, best Vercel integration                                                        |
| Styling                | **Tailwind CSS v4** + **shadcn/ui**                                | Fast to build, tiny CSS footprint when purged, consistent theming primitives                                                                                            |
| Theming                | `next-themes`                                                      | Handles light/dark/system with no flash-of-incorrect-theme, cookie-based SSR-safe                                                                                       |
| Editor state           | **Zustand**                                                        | In-memory invoice draft state, zero re-render overhead, avoids DB round-trips while typing                                                                              |
| Persistence (Cloud Mode) | **Neon Postgres + Prisma**                                       | Only touched once a user opts into Cloud Mode; matches existing stack, serverless-friendly connection pooling via Neon's driver                                         |
| Auth                   | **NextAuth.js (Auth.js) — Google + Credentials (email/password)**   | Two sign-in paths gate Cloud Mode sync: one-click Google OAuth, or email/password via NextAuth's Credentials provider with `bcrypt` for hashing. No email verification in MVP                          |
| Transactional email    | **Resend** (password reset only)                                   | Sends exactly one email type: password-reset links for email/password accounts. Not used for invoice-sending, marketing, or notifications — scope is intentionally narrow                             |
| PDF generation         | **`@react-pdf/renderer`**                                          | Same React component renders on-screen preview and PDF — no visual drift; runs in Node serverless function without headless Chrome (lighter cold starts than Puppeteer) |
| File uploads (logo)    | **Vercel Blob**                                                    | Zero-config with Vercel deploy, signed upload URLs, no S3 setup overhead                                                                                                |
| Local history          | **`localStorage`**                                                 | Default no-account persistence for drafts and history, matching reference site behavior; synced to Postgres only in Cloud Mode                                          |
| Content (Guides)       | **MDX** via `next-mdx-remote` or Contentlayer-style static compile | Static-generated at build time, zero runtime cost, easy internal linking                                                                                                |
| SEO tooling            | `next-sitemap`, Next.js Metadata API, `@vercel/og`                 | Automated sitemap/robots, per-route metadata, dynamic OG images without a design tool                                                                                   |
| Analytics/perf         | Vercel Analytics + Speed Insights                                  | Real-user Core Web Vitals monitoring                                                                                                                                    |
| Hosting                | **Vercel**                                                         | Matches existing stack, edge network, ISR support                                                                                                                       |

## 2. Rendering Strategy (this is the speed lever)

- **Homepage (`/`)**: Static shell (server component) + the editor itself is a client component hydrated immediately. No auth check blocks initial paint — the editor never checks session state at all; only `/history` lazily checks for a Google session, client-side, after hydration.
- **Guides (`/guides/**`)**: Fully static (SSG at build time via MDX). Revalidate via ISR (`revalidate: 86400`) so content edits don't require a full redeploy.
- **Help (`/help`)**: Fully static.
- **History (`/history`)**: Client component, reads from `localStorage` by default — no auth or DB required. If a Google session exists, it additionally fetches/syncs cloud-saved invoices. `noindex`, not on the SEO-critical path.
- **Sign-in / Sign-up**: NextAuth.js routes with two paths — Google OAuth and email/password (Credentials provider) — triggered only from the Cloud Mode banner on `/history` or a direct `/sign-in`/`/sign-up` visit; never loaded on `/`.

Principle: **nothing on the SEO-critical path (`/`, `/guides/*`, `/help`) waits on auth, DB, or third-party SDK initialization.** NextAuth and Prisma-touching code is code-split into `/history` and only loads when a user actually opens that page or triggers Cloud Mode.

## 3. Folder Structure

```
/app
  /(marketing)
    /guides
      page.tsx                 → guides hub
      /invoicing-guide/[slug]/page.tsx
      /[slug]/page.tsx          → standalone articles
    /help/page.tsx
  /(tool)
    page.tsx                   → homepage / invoice editor
    /templates/[type]/page.tsx → Phase 2
  /(account)
    /sign-in/page.tsx             → Google button + email/password form
    /sign-up/page.tsx             → email/password account creation
    /reset-password/page.tsx      → set new password via emailed token
    /history/page.tsx             → local history (default) + Cloud Mode banner
  /api
    /pdf/route.ts                 → server-side PDF render endpoint
    /auth/[...nextauth]/route.ts  → NextAuth.js: Google + Credentials providers
    /auth/reset-password/route.ts → request + confirm password reset (sends via Resend)
    /invoices/route.ts            → Cloud Mode sync CRUD (Phase 2)
  layout.tsx                     → theme provider, fonts, global metadata
  sitemap.ts                     → next-sitemap or native Next sitemap generator
  robots.ts
/components
  /invoice-editor                → form fields, line-items table, calculations panel
  /invoice-preview                → the shared render component (used by screen + PDF)
  /ui                             → shadcn primitives
  /theme-toggle.tsx
/lib
  /pdf                             → @react-pdf/renderer document definitions
  /calculations.ts                 → subtotal/tax/discount/total/balance logic (pure functions, unit-testable)
  /currency.ts                     → ISO 4217 list + formatting
  /prisma.ts
  /store.ts                        → Zustand invoice draft store
/content
  /guides/*.mdx
/prisma
  schema.prisma
```

## 4. Data Model (Prisma, Phase 2 — scaffold now)

```prisma
model User {
  id           String   @id            // NextAuth user id (Google sub, or generated on email/password signup)
  email        String   @unique
  passwordHash String?                 // set only for email/password accounts; null for Google-only accounts
  invoices     Invoice[]
  template     UserTemplate?
  createdAt    DateTime @default(now())
}

model UserTemplate {
  id          String @id @default(cuid())
  userId      String @unique
  user        User   @relation(fields: [userId], references: [id])
  fromAddress String?
  logoUrl     String?
  currency    String @default("USD")
  terms       String?
  notes       String?
  fieldTitles Json?   // overrides like "PO Number" -> "Reference"
}

model Invoice {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  localId      String?  // the localStorage id this record was synced from, for de-duping on re-sync
  number       String
  status       InvoiceStatus @default(DRAFT)
  billTo       String?
  shipTo       String?
  date         DateTime?
  dueDate      DateTime?
  paymentTerms String?
  poNumber     String?
  currency     String   @default("USD")
  lineItems    Json     // [{ description, quantity, rate, amount }]
  notes        String?
  terms        String?
  taxRate      Float?   @default(0)
  discount     Float?   @default(0)
  shipping     Float?   @default(0)
  amountPaid   Float?   @default(0)
  total        Float    @default(0)
  balanceDue   Float    @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum InvoiceStatus {
  DRAFT
  SAVED
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique   // random, unguessable — hashed at rest, not the raw emailed value
  expiresAt DateTime             // short-lived, e.g. 1 hour from creation
  usedAt    DateTime?            // set once consumed; a used or expired token is rejected
  createdAt DateTime @default(now())
}
```

Note: no `sentAt`/`paidAt`/`SENT`/`VIEWED`/`PAID`/`OVERDUE` states — those tracked an emailed-invoice lifecycle that's out of scope. `status` only distinguishes an in-progress draft from one the user has explicitly saved.

Note on `passwordHash`: only ever set for accounts created via the email/password form; Google-only accounts leave it `null`. `bcrypt` (or `argon2`) hashes the password before it touches the database — the plaintext password is never stored or logged.

Note on `PasswordResetToken`: this is the only piece of infrastructure tied to the Resend integration. A reset request generates one row, emails the raw token as a link (`/reset-password?token=...`), and the row is deleted or marked `usedAt` once the password is actually changed. Expired/used tokens must be rejected server-side, not just hidden client-side.

## 5. PDF Generation & Save Flow

1. Invoice editor state (Zustand) is the single source of truth.
2. A shared `<InvoicePreview />` React component renders that state as the on-screen live preview.
3. On "Download": the same data is POSTed to `/api/pdf`, which renders an equivalent `@react-pdf/renderer` document server-side and streams back a PDF — no headless browser, fast cold start on Vercel serverless/edge.
4. On "Save": the invoice is always written to `localStorage` immediately. If a Google session exists (Cloud Mode), it's additionally upserted to Postgres via `/api/invoices` using `localId` to avoid duplicates on repeat syncs.
5. There is no email-sending or payment-link step anywhere in this flow — "Save" and "Download" are the only two actions the editor exposes.

## 6. Theming Implementation

> Color values, type scale, spacing, and radius come from `DESIGN.md` — this section covers only the technical wiring, not the visual tokens themselves.

- `next-themes` `ThemeProvider` wraps the root layout, `attribute="class"`, `defaultTheme="system"`.
- Tailwind `dark:` variants throughout; design tokens (colors, spacing) defined as CSS variables in `globals.css` so both the editor UI and the `<InvoicePreview />` component can consume them consistently.
- Toggle component in the header persists choice to cookie so SSR renders the correct theme with no flash.
- **Exported PDFs always render in a fixed light/print theme** regardless of the app's active theme — invoices are business documents, not app UI, and must look identical no matter who's viewing them.

## 7. SEO Implementation Details

- Per-route `generateMetadata()` for title/description/canonical.
- `sitemap.ts` auto-includes all static + MDX-derived guide routes; excludes `/history`, `/sign-in`.
- `robots.ts` disallows `/api/*`, `/history`, allows everything else.
- JSON-LD: `SoftwareApplication` schema on `/`, `Article` + `FAQPage` schema on guide pages.
- `@vercel/og` generates a unique OpenGraph image per guide article from its title (build-time or edge-cached).
- Internal linking: every guide page links back to `/` with a contextual CTA; the guides hub links to every article — no orphan pages.

## 8. Performance Budget

- JS shipped on `/` before interaction: target < 120kb gzipped (excludes the lazily-loaded NextAuth/Prisma chunks used only by `/history`'s Cloud Mode).
- Fonts: `next/font` self-hosted, no external font requests blocking render.
- Images: `next/image` everywhere, logo uploads resized/optimized on upload via Vercel Blob + `sharp` in an API route.
- No client-side data fetching on first paint of `/`, `/guides/*`, `/help`.

## 9. Deployment

- Vercel, single project, Preview Deployments per PR.
- Environment separation: `DATABASE_URL` (Neon branch per environment), `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` + `NEXTAUTH_SECRET` (NextAuth Google + Credentials providers), `RESEND_API_KEY` (password-reset email only), Vercel Blob token. Password hashing itself is local (`bcrypt`), not a third-party service.
- Vercel Analytics + Speed Insights enabled from day one to track the performance budget above in production.
