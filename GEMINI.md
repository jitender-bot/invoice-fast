# GEMINI.md — Gemini-Specific Agent Instructions

This file supplements `AGENTS.md`. Read `AGENTS.md`, `PRD.md`, `ARCHITECTURE.md`, and `DESIGN.md` first — everything there applies. This file only covers behaviors specific to using Gemini as the coding agent on this project.

## Why this file exists

Gemini tends to be more willing than other agents to (a) confidently invent plausible-looking API signatures for libraries it hasn't seen recent versions of, and (b) make sweeping multi-file edits in one pass when a narrower change would do. Both are risky on this project because correctness in the money-math (`calculations.ts`) and PDF output matters more than speed of iteration.

## Rules

1. **Verify before inventing.** For any API surface you're not fully certain of — NextAuth.js Google/Credentials provider config and hooks, `bcrypt` hashing API, Resend's send API, `@react-pdf/renderer` component props, Prisma/Neon connection setup — check the actual installed package version's types/docs in the repo (`node_modules/<pkg>/package.json`, type definitions) before writing code against it. Do not pattern-match to an older or different library's API and assume it transfers. Resend is scoped to exactly the password-reset email — don't extend it to invoice-sending or any other email type without being explicitly asked; there is no payments SDK in this project.
2. **Prefer minimal diffs.** When asked to implement one feature (e.g., "add the discount toggle"), touch only the files that feature needs. Don't refactor unrelated files in the same pass unless explicitly asked — large surprise diffs are harder to review and more likely to introduce regressions in the calculation logic.
3. **Never touch `/lib/calculations.ts` math without also updating/adding its unit tests in the same change.** If you change a formula, show the before/after test expectations explicitly in your summary of the change.
4. **State your assumptions out loud before generating code** when a task in `PRD.md` is underspecified (e.g., exact tax-then-discount-vs-discount-then-tax order of operations) — pick the standard convention (discount applied before tax, tax applied to shipping or not — flag this explicitly) and say which one you chose, rather than silently choosing.
5. **Don't add "helpful" extra features.** If a task says "build the line items table," build the line items table — not an extra sorting/drag-reorder feature nobody asked for. Extra scope here works against the "dead simple, loads fast" goal in the PRD.
6. **Bundle-size awareness.** Before importing any new package into a client component, state its approximate gzip size and whether it can be dynamically imported instead of loaded eagerly. This project has an explicit JS budget (see `ARCHITECTURE.md` §8) — treat it as a real constraint, not a suggestion.
7. **When generating MDX guide content**, keep it factually generic (invoicing best practices, payment terms explanations) — do not invent specific statistics, studies, or quotes and attribute them to real sources. If a claim needs a stat, mark it clearly as a placeholder for the human to verify/replace.
8. **Theme parity self-check.** After building any UI component, explicitly confirm (in your response, not just the code) that you checked it in both light and dark Tailwind classes.
9. **Do not drift toward a generic SaaS look.** `DESIGN.md` exists specifically because unguided agents default to gradient heroes, glassmorphism, and dark-first layouts. Every color, radius, and spacing value must trace back to a token in `DESIGN.md` — if you're about to write a hex value or shadow that isn't in that file, stop and check it against the anti-patterns list there first.

## Interaction Style

- Show your plan for a non-trivial task before writing code, especially for anything touching the PDF pipeline or the calculations engine — these are the two places where a subtle bug is expensive (wrong invoice totals, broken PDF for a paying feature).
- When you finish a task, summarize exactly which files changed and why — don't just say "done."
