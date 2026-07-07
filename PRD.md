# PRD.md — InvoiceFast (Invoice-Generator.com Clone)

> Working name: **InvoiceFast**. Rename freely — every doc references it as a variable, not a hard brand.

## 1. Vision

A dead-simple, instant-loading invoice generator that lets anyone create a professional invoice with zero friction (no login required for the core tool), while offering accounts for people who want to save, send, and track invoices over time. The product wins on three axes: **speed** (sub-1s interactive), **simplicity** (the form IS the invoice — live WYSIWYG), and **SEO** (a library of invoicing/guide content that ranks and funnels users into the tool).

## 2. Target Audience

- Freelancers and solo founders who need a one-off invoice right now, no signup friction.
- Small business owners who invoice recurring clients and want history/saved templates.
- People searching informational queries ("how to write an invoice", "net 30 terms") who land on Guides and convert into tool users.

## 3. Goals

1. Time-to-first-invoice-download under 30 seconds for a new visitor.
2. Core Web Vitals: LCP < 1.5s, INP < 100ms, CLS < 0.05 on the invoice editor page.
3. Rank for long-tail invoicing/informational keywords via the Guides section.
4. Convert a meaningful % of free/no-login users into signed-up accounts (save/send/history).
5. Full light/dark theme parity across every page, respecting system preference, togglable and persisted.

## 4. Non-Goals (MVP)

- Full double-entry accounting / bookkeeping.
- Multi-currency ledger reconciliation (currency selector is cosmetic/display-only for MVP).
- Public Developer API (documented as Phase 3).
- Recurring/subscription billing automation (Phase 3 — mentioned in Guides content only for MVP).

## 5. Core Features

### 5.1 Invoice Editor (no login required) — the homepage

The homepage IS the tool, not a landing page in front of it (matches the reference site).

- Logo upload (drag/drop or click), stored client-side until save.
- "Who is this from" (sender) block, "Bill To", optional "Ship To".
- Auto-incrementing invoice number, Date, Payment Terms (dropdown: Net 15/30/60/Due on Receipt/Custom), Due Date (auto-calculated from Payment Terms, editable), PO Number.
- Line items table: Description, Quantity, Rate, Amount (auto-calculated). Add/remove line item rows dynamically.
- Notes field (free text).
- Terms field (free text — late fees, payment methods, delivery schedule).
- Currency selector — full ISO 4217 list, searchable dropdown, symbol updates live across the invoice.
- Calculations panel: Subtotal (auto), Tax (%, toggle to switch % vs flat $), Discount (optional, toggle), Shipping (optional, toggle), Total (auto), Amount Paid (manual entry), **Balance Due** (auto, bold).
- Right sidebar: **Save** (always available — writes to `localStorage` immediately; if the user is signed in via Google, also syncs to the cloud so it's visible on other devices), **Download** (client/server PDF, always free, no login), **Invoice Settings** (collapsible: from-address, logo, currency, terms, notes, field-title overrides — these persist as "my template" once saved).
- Live-updating invoice preview matches the PDF output pixel-for-pixel (single source of truth component).
- Form validation surfaces only on Download/Save attempt — required fields highlighted inline, non-blocking while typing.

### 5.2 History & Cloud Mode (Phase 2, local-only version scaffolded in MVP)

Matches the reference site's actual behavior: history is **local-first**, and an account is only needed to sync across devices.

- **Local History (MVP, no account needed)**: every invoice the user creates auto-saves to `localStorage` on that device. The `/history` page lists these, with search and a "New Invoice" action. A persistent notice explains that these invoices live only on this device and clearing browser data will erase them.
- **Cloud Mode (Phase 2)**: a dismissible banner on `/history` invites the user to sign in to sync their local invoices to the cloud and access them from any device.
- **Sign In / Sign Up**: two options — **Google OAuth** (one click, no password) or **email + password** (traditional signup with a verification-free password flow for MVP — no magic-link/email-verification step to keep scope small). Matches a standard "Continue with Google / or continue with email" sign-in screen.
- **Password Reset**: a minimal "Forgot password?" flow for email/password accounts only. User enters their email → a reset link is sent via **Resend** (used here strictly for this one transactional email, not for sending invoices) → link opens `/reset-password?token=...` → user sets a new password, which is re-hashed and saved. Reset tokens are single-use and time-limited (e.g. 1 hour). This is the only email the app ever sends — no invoice emails, no marketing, no notifications.
- **Save Template**: persists From Address, Logo, Currency, Terms, Notes, Field Titles as defaults for future invoices — stored in `localStorage` for anonymous users, synced to Postgres for signed-in users.

Out of scope for this product: emailing invoices to clients, hosted payable invoice links, and payment acceptance (razorpay). These add significant surface area (email deliverability, payment webhooks, status tracking) that isn't needed for a basic local/cloud history tool. The one exception is a single transactional password-reset email (see below) — this is not a general-purpose email system and must not be extended to invoice-sending without a separate decision.

### 5.3 Guides (SEO engine)

- `/guides` index — hub page listing a structured 5-part "Invoicing Guide" course (Introduction → How to Make Invoices → Getting Paid → Client Billing → Running Your Business) plus standalone long-form articles (Invoice-to-Cash, How to Get Paid Faster, How to Reduce Late Payments, Invoice Payment Terms).
- Each guide is a static MDX page: H1, dek, reading time, internal links back to the tool ("Create this invoice now" CTA), FAQ block with FAQPage structured data where relevant.
- Guides are the primary long-tail SEO surface — target informational keywords, not just "invoice generator."

### 5.4 Help / FAQ

- Static page: Why use it, How to make/download/save invoices, System requirements, Where data is stored (transparency builds trust — directly affects conversion, and matters more here since history is local by default).

### 5.5 Templates (secondary tools, Phase 2)

- `/templates/quote-template`, `/templates/credit-note-template`, `/templates/purchase-order-template` — same editor engine, different default field labels/schema. High SEO value (each is its own ranking opportunity), low incremental build cost since they reuse the invoice editor component.
- These are the only "extra" tool surfaces in scope. No other document types, no template marketplace, no custom template builder.
- Footer only links to these template pages (plus the base invoice tool) — no separate "Resources" block of marketing/link-building pages (no Release Notes page, no Developer API link). Keep the footer to: Invoice Template, Quote Template, Credit Note Template, Purchase Order Template.

### 5.6 Theming

- Light/dark toggle in the header, persisted (cookie + `localStorage`, no flash-of-wrong-theme on load — see Architecture doc for implementation). Visual tokens, palette, and layout rules are fully specified in `DESIGN.md` — that file is the source of truth for anything about how the product should look, not this one.
- Every component (including the PDF preview) must have both theme variants — the exported PDF itself always renders in a print-safe light theme regardless of UI theme.

## 6. Sitemap (for SEO + `next-sitemap` generation)

```
/                                  → the invoice editor (homepage)
/guides                            → guides hub
/guides/invoicing-guide/introduction
/guides/invoicing-guide/how-to-make-invoices
/guides/invoicing-guide/getting-paid
/guides/invoicing-guide/client-billing
/guides/invoicing-guide/running-your-business
/guides/invoice-to-cash
/guides/how-to-get-paid-faster
/guides/how-to-reduce-late-payments
/guides/invoice-payment-terms
/help
/history                           (no login required — local history; noindex)
/sign-in                           (Google OAuth + email/password, noindex)
/sign-up                           (email/password account creation, noindex)
/reset-password                    (password reset via emailed token, noindex)
/templates/quote-template          (Phase 2)
/templates/credit-note-template    (Phase 2)
/templates/purchase-order-template (Phase 2)
/terms
/privacy
```

## 7. Non-Functional Requirements

- **Performance**: Homepage editor must be usable (interactive) before any auth/DB JS loads. No login-gating on the critical path. Route-level code splitting; the NextAuth/Prisma code path is lazy-loaded only on `/history`, when Cloud Mode is actually triggered.
- **SEO**: unique `<title>`/meta description per route, canonical tags, OpenGraph + Twitter cards (auto-generated via `@vercel/og`), JSON-LD (`SoftwareApplication` on homepage, `Article`/`FAQPage` on guides), `sitemap.xml` + `robots.txt` via `next-sitemap`, semantic heading hierarchy, no client-only rendering of primary content.
- **Accessibility**: WCAG 2.1 AA — keyboard-navigable editor, proper form labels, sufficient contrast in both themes.
- **Reliability**: invoice editor state must never silently lose user input — autosave to `localStorage` every few seconds even for logged-out users, so a refresh doesn't wipe an in-progress invoice.

## 8. Success Metrics

- Lighthouse Performance/SEO score ≥ 95 on homepage and guide pages.
- % of sessions that reach "Download" or "Save" (activation rate).
- Organic sessions landing on `/guides/*` and their click-through rate into `/`.
- Google sign-in conversion rate from the Cloud Mode banner on `/history`.

## 9. Phased Roadmap

- **Phase 1 (MVP)**: Homepage editor, local-storage autosave + local `/history`, client-side + server PDF download, theming, Guides + Help static content, sitemap/SEO foundation. No auth required.
- **Phase 2**: Google OAuth (NextAuth.js, single provider) + Cloud Mode sync of local history to Postgres, Save Template (cloud), Templates (quote/credit note/PO).

Out of scope indefinitely (not phased, just cut): emailing invoices to clients, hosted payment links, payment acceptance, a public developer API, recurring/subscription billing, team accounts. These add real complexity (deliverability, webhooks, PCI-adjacent concerns, multi-user permissions) that this product intentionally does not take on.

## 10. Open Questions to Revisit

- Final product name/branding.
- Whether "Download" PDFs remain 100% free/unlimited with no rate limiting (matches reference site's trust positioning) — recommend yes for MVP to maximize top-of-funnel.
- Whether Cloud Mode sync is one-way (local → cloud, last-write-wins) or needs real conflict resolution if the same invoice is edited on two devices — recommend last-write-wins for MVP given the small scope.
- Password reset for email/password accounts is now in scope via Resend (see §5.2) — this is the only email the app sends. If this narrow Resend usage later gets tempting to extend (e.g. "while we're at it, let's also email invoices"), that's a separate scope decision, not an automatic extension.
- Whether account-linking is needed: if someone signs up with email/password using an address, then later tries Google sign-in with that same email, should that log into the same account or be treated as a separate account? Not yet decided — recommend treating them as separate accounts for MVP (simplest to build) unless this causes real user confusion.
