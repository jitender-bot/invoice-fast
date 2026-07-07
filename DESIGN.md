# DESIGN.md — Visual Direction

## Read this before touching any styling.

The single biggest risk to this project isn't missing features — it's an AI coding agent "improving" the design into a generic SaaS marketing template (gradient hero, glassmorphism cards, big rounded shadows, a dark-mode-first Linear/Vercel look). **That is explicitly wrong for this product.** InvoiceFast is a tool people use to get a document done in 30 seconds, not a product they browse. Every design decision below optimizes for that.

If you (the coding agent) find yourself reaching for a hero section, a gradient, a glass-morphism card, or a big centered marketing headline on the homepage — stop. The homepage has no hero. The homepage **is** the invoice form.

## Reference Behavior (from the actual site being cloned)

- White background, not off-white/cream, not dark-by-default.
- Flat inputs with thin 1px borders, square-ish corners (small radius, not pill-shaped, not zero).
- No shadows on form elements. Shadows, if used at all, are reserved for the elevated action sidebar (Save & Send / Download panel) and are subtle — never a glow.
- The invoice preview area looks like an actual paper document: white card, black text, generous internal padding, clear rule lines separating sections (item table header, subtotal block).
- One accent color used sparingly (link color, primary button, active nav underline) — not scattered across the UI as decoration.
- Typography is a plain, highly legible sans-serif at a modest size. This is a form people fill in fast, not a page they read for pleasure.
- Dense but uncluttered: many fields on screen at once (this is normal for an invoice), organized with whitespace and alignment, not hidden behind steps/wizards.

## Token System

**Color** (light theme — the default and the one the exported PDF always uses):
- `--background`: `#FFFFFF`
- `--surface`: `#F7F8F9` (subtle section backgrounds, e.g. page background behind the white invoice card)
- `--border`: `#E2E5E9`
- `--text-primary`: `#1A1D21`
- `--text-secondary`: `#6B7280`
- `--accent`: `#1E8E5A` (a restrained green — evokes "paid/money" without being a garish SaaS green; used for primary buttons, links, active states only)
- `--accent-hover`: `#166B45`
- `--danger`: `#C0362C` (validation errors, overdue balance)

**Color** (dark theme — inverted, same restraint, not a separate "vibe"):
- `--background`: `#15171A`
- `--surface`: `#1D2024`
- `--border`: `#2C3036`
- `--text-primary`: `#EDEEF0`
- `--text-secondary`: `#9AA1AA`
- `--accent`: `#3CB37A` (slightly brighter for dark-background contrast, same hue family as light mode — the app should feel like the same app, not a different product)
- `--accent-hover`: `#54C98D`
- `--danger`: `#E0685E`

**Type**:
- Body/UI face: a single plain grotesque sans (e.g. system UI stack or Inter) — no display face, no serif. This is a utility, not an editorial page.
- One weight distinction only: regular for body/inputs, medium/semibold for labels and totals. Do not introduce a third weight or a second family. The "Balance Due" total is the only text on the page allowed to be visually loud (larger size + bold) — it's the one number that matters most.
- Base size 14–15px for form fields and table rows (dense, functional), 12–13px for helper/secondary text, no text below that.

**Layout**:
- No hero section anywhere in the app, including the homepage.
- Two-column layout on the homepage: main form + live invoice preview on the left/center, a slim fixed action sidebar (Save & Send / Download / Invoice Settings) on the right — matches the reference screenshots exactly.
- Border-radius: 6px on inputs/buttons/cards. Not 0 (too severe/broadsheet), not 16px+ (too soft/marketing-app). Consistent everywhere — don't mix radii.
- Marketing pages (Guides, Help) may use slightly more generous spacing and a simple two/three-column card grid for article previews, but still no gradients, no glass, no hero illustration — a clean editorial layout in the same restrained palette, consistent with the tool pages so the whole site feels like one product.

**Signature element** (the one place this design is allowed to have a point of view):
The live invoice preview updating in real time as the form is filled in, styled to look convincingly like an actual paper invoice (subtle card elevation, serif-free but clearly "document"-styled typography inside the preview, a faint drop shadow only on this one element to lift it off the page like a physical sheet of paper). This is the moment that sells "simple and instant" — everything else in the UI stays quiet so this stays the focal point.

## Explicit Anti-Patterns (do not do these)

- ❌ Gradient backgrounds or gradient buttons anywhere.
- ❌ Glassmorphism / frosted-glass cards.
- ❌ A big centered headline + subheadline + CTA button "hero" on the homepage.
- ❌ Animated background blobs, particles, or scroll-triggered reveal animations on the tool pages.
- ❌ Dark mode as the default theme — light is default, dark is opt-in, matching the reference site and matching "business document" expectations.
- ❌ More than one accent color live on screen at once.
- ❌ Icon-heavy decoration on form fields that doesn't serve comprehension (no sparkle/magic-wand icons implying "AI-powered", this is a plain tool).
- ❌ Card shadows/elevation on every element — reserve elevation for the one signature element (the invoice preview) and the sidebar panel.

## Motion

Minimal and functional only: a line item row fading in when added/removed, a subtotal number ticking to its new value on change, a smooth (not bouncy) theme toggle transition. No page-load animation sequences, no hover parallax, nothing ornamental. If it doesn't help someone understand that their number just updated, cut it.

## Definition of Done (design)

- Homepage has no hero, no marketing copy above the fold — the form is the first thing rendered.
- Every color used traces back to a token in this file — no ad hoc hex values in components.
- Light and dark themes both reviewed side by side before a component is considered finished.
- Nothing on the page could be mistaken for a generic AI-generated SaaS landing page if you covered the logo.
