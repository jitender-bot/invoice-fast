# Completed Features — InvoiceFast

InvoiceFast is a high-performance, responsive invoice generator application built with Next.js 16+, React 19, Tailwind CSS v4, and TypeScript. Below is a comprehensive list of all the features and pages that have been completed and verified.

---

## 1. Core WYSIWYG Invoice Editor (The Homepage)
The homepage (`/`) functions as a friction-free editor that requires no login.
*   **Dynamic Field Label Customization:** Almost all text labels on the invoice (e.g., "INVOICE", "Invoice No", "Date", "Bill To", "Quantity", "Rate", etc.) can be edited directly on the page, matching any specific business terminologies.
*   **Logo Upload & Management:**
    *   Drag-and-drop or click to upload business logos.
    *   File size and type validation (max 2MB, images only).
    *   Embedded as base64 in draft state for zero-login persistence.
*   **Live Line Items Table:**
    *   Add or delete rows dynamically.
    *   Interactive columns for Item Description, Quantity, Rate, and auto-calculated row Amounts.
*   **Date Calculations & Auto-Increment:**
    *   Supports invoice dates, due dates, and PO numbers.
    *   Due dates dynamically calculate and update based on chosen payment terms (e.g., *Due on Receipt*, *Net 15*, *Net 30*, *Net 60*).
*   **Notes & Terms:** Free text inputs for bank/payment instructions, late fee disclosures, and other terms.
*   **Currency Customization:** Searchable dropdown supporting standard ISO 4217 currencies. Selecting a currency live-updates formatting (locale-aware symbols) across all totals instantly.

---

## 2. In-Memory & Local Storage State Persistence
*   **Zustand State Management:** A unified store manages editor input fields, table structures, and settings dynamically without expensive component re-renders.
*   **Browser Auto-Save:** In-progress invoice drafts persist locally via `localStorage`. Visitors can close the tab or refresh the page without losing their work.
*   **One-Click Draft Reset:** Quick-clear action button clears current state and restores baseline templates.

---

## 3. Pure Calculation & Math Engine
All financial math is decoupled from the UI framework in pure, fully unit-tested helper functions (`/lib/calculations.ts`):
*   **Subtotal:** Aggregates line item totals.
*   **Discounts:** Supports both Percentage (%) and Flat Rate ($) discounts. Max limit caps discounts to subtotal.
*   **Tax Engine:** Supports Percentage (%) and Flat Rate ($) tax rates. Taxes apply to the post-discount taxable amount.
*   **Shipping & Freight Fees:** Handles manual entry additions.
*   **Amount Paid & Balance Due:** Deducts partial payments and highlights outstanding due balance in a visually distinct panel.

---

## 4. Server-Side PDF Generation & Streaming
*   **Shared Rendering Layout:** Single source of truth. The PDF generator mirrors the on-screen WYSIWYG layout exactly.
*   **PDF Server API (`/api/pdf`):** Handles incoming JSON requests and uses `@react-pdf/renderer` to generate a binary PDF file stream, avoiding heavy headless browser runtimes like Puppeteer.
*   **Print-Optimized Formatting:** Generates in a clean, print-safe light color scheme regardless of the user's active screen theme.

---

## 5. SEO & Sitemap Foundation
SEO is treated as a core constraint:
*   **Semantic Structure:** Proper HTML5 structures and heading hierarchies.
*   **Dynamic Robots & Sitemap:** Dynamic endpoints generate standard `robots.txt` rules and a complete sitemap (`sitemap.xml`) indexing all public editor, help, and guide course pages.
*   **JSON-LD Metadata:** Schema.org definitions:
    *   `SoftwareApplication` on the homepage tool.
    *   `FAQPage` on the help center page.
    *   `Article` metadata on standalone guide pages.

---

## 6. Guides & Educational Course Hub
A dynamic static-rendered learning portal (`/guides`) built as an organic traffic acquisition funnel:
*   **5-Part Invoicing Course:** Structured learning modules covering billing fundamentals, creation practices, getting paid, client billing, and finance.
*   **Deep-Dive Articles:** Standalone SEO-targeted guides (e.g., *Understanding the Invoice-to-Cash Cycle*, *7 Tips to Get Paid Faster*, *Reducing Late Payments*, *Invoice Payment Terms*).
*   **FAQ Integrations:** Each course chapter includes structured QA sections with local JSON-LD bindings.
*   **Call-to-Action Funnels:** Contextual CTAs link readers back to the editor to drive conversion.

---

## 7. Account Dashboard & History Scaffolding
Laying the groundwork for Phase 2:
*   **Clerk Authentication:** Dynamic Sign-In and Sign-Up catch-all pages wired up.
*   **History Dashboard (`/history`):** Searchable, status-filterable lists of invoices (e.g., *Paid, Sent, Overdue, Draft*).
*   **CSV Batch Export:** Exports currently filtered invoice lists to spreadsheets with a single click.

---

## 8. Restrained Dark & Light Theming
*   **Persisted Theme Toggle:** Managed via `next-themes` and syncs system defaults, persisted through cookie storage to prevent client hydration flash.
*   **Modern Color Tokens:** Compliant with custom design specifications (`DESIGN.md`):
    *   Restrained dark mode colors that respect paper-like readability.
    *   Tailwind CSS v4 variable declarations.
