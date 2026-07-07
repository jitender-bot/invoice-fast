# InvoiceFast 🧾⚡

InvoiceFast is a fast, responsive, and beautiful invoice generator clone of `invoice-generator.com`. It is built with a premium dark/light theme design system, a client-first localStorage architecture, and optional Cloud Mode synchronization.

---

## 🚀 Key Features

* **WYSIWYG Live Editor**: Instantly customize invoice headings, currencies, line items, discounts, taxes, and shipping rates on a print-accurate canvas.
* **Document Templates**: Switch between custom document layouts for **Invoices**, **Quotes**, **Credit Notes**, and **Purchase Orders** with auto-hiding layout logic.
* **Local-First & Sync Mode**: Create invoices immediately without signing up. Log in at any time to sync local history safely with the database in **Cloud Mode**.
* **One-Click PDF Exports**: Download professional, print-formatted PDFs instantly and directly in your browser.
* **Secure Authentication**: Includes Google OAuth and Credentials-based (email/password) sign-in via NextAuth.
* **Transactional Mail Flow**: Implements password reset flows backed by Resend.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16 (App Router, React 19)
* **Styling**: Tailwind CSS v4 + Vanilla CSS custom HSL tokens
* **State Management**: Zustand
* **Database**: PostgreSQL (hosted on Neon)
* **ORM**: Prisma v7 with PostgreSQL driver adapters (WASM compatible)
* **Authentication**: NextAuth.js
* **Mailing**: Resend SDK
* **PDF Engine**: `@react-pdf/renderer`

---

## ⚙️ Local Development Setup

### 1. Prerequisites
Ensure you have **Node.js 22+** and **npm** installed.

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:pass@ep-pooler.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secure-base64-random-string"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Resend Transactional Mail
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="InvoiceFast <onboarding@resend.dev>"
```

### 3. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Setup Prisma Schema & Migrations
```bash
# Push schema structure to database
npx prisma db push

# Generate client typescript files
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the live editor workspace.

---

## 🧪 Running Tests

Unit tests verify all money-math calculation rules (subtotals, flat/percent discounts, shipping, tax structures, and currency formatting):
```bash
npx tsx lib/calculations.test.ts
```

---

## 📦 Deployment Guide

### Vercel / Netlify
1. Connect your GitHub repository to Vercel.
2. In the Vercel dashboard, paste the exact production values for your **Environment Variables** (see `.env` list above).
3. Set your production deployment build commands:
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`
4. Set the pipeline to run migrations on deploy:
   ```bash
   npx prisma migrate deploy
   ```
