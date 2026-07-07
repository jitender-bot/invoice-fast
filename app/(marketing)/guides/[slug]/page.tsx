import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Article static parameters
export async function generateStaticParams() {
  return [
    { slug: "invoice-to-cash" },
    { slug: "how-to-get-paid-faster" },
    { slug: "how-to-reduce-late-payments" },
    { slug: "invoice-payment-terms" },
  ];
}

interface ArticleData {
  title: string;
  description: string;
  readingTime: string;
  content: React.ReactNode;
}

const articles: Record<string, ArticleData> = {
  "invoice-to-cash": {
    title: "Understanding the Invoice-to-Cash Cycle",
    description: "A comprehensive guide to optimizing the business process flow from quotation submission to final bank reconciliation.",
    readingTime: "5 min read",
    content: (
      <>
        <p className="mb-4">
          The Invoice-to-Cash (I2C) process refers to the entire business cycle that starts when a sales order is accepted and ends when the payment is received, recorded, and reconciled in your ledger. Managing this flow efficiently directly correlates with healthy business operations.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Key Steps in the I2C Cycle</h3>
        <ol className="list-decimal pl-5 mb-6 flex flex-col gap-2">
          <li><strong>Sales Confirmation & PO Receipt:</strong> Agreeing on project deliverables and receiving a Purchase Order from the client.</li>
          <li><strong>Invoice Generation:</strong> Creating a clear billing document with all required fields (logo, address, bank terms).</li>
          <li><strong>Delivery & Tracking:</strong> Sending the invoice to the customer and verifying it has been received.</li>
          <li><strong>Collection & Processing:</strong> Receiving client funds via check, bank transfer (ACH), or credit card.</li>
          <li><strong>Ledger Reconciliation:</strong> Recording the deposit and matching it against the outstanding invoice balance.</li>
        </ol>
        <p className="mb-4">
          Streamlining invoice generation using clean templates is the fastest way to shorten your cash cycle.
        </p>
      </>
    )
  },
  "how-to-get-paid-faster": {
    title: "How to Get Paid Faster: 7 Actionable Tips",
    description: "Improve your accounts receivable. Learn how credit-card options, early terms, and clear notes speed up client checkouts.",
    readingTime: "6 min read",
    content: (
      <>
        <p className="mb-4">
          Unpaid invoices block business growth. Making simple modifications to your billing workflows can dramatically reduce the time it takes to get paid.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">7 Strategies for Faster Invoice Processing</h3>
        <ul className="list-disc pl-5 mb-6 flex flex-col gap-2">
          <li><strong>Send Invoices Immediately:</strong> Bill as soon as a project milestone is reached. Delaying invoice generation delays payment.</li>
          <li><strong>Offer Direct Online Payments:</strong> Provide Stripe bank transfers (ACH) or card checkouts directly on the invoice.</li>
          <li><strong>Provide Clear Descriptions:</strong> Avoid vague line items. Explicitly state the services rendered.</li>
          <li><strong>Use Shorter Net Terms:</strong> Request payment within 15 days (Net 15) instead of 30 or 60 days.</li>
          <li><strong>Set Up Auto-Reminders:</strong> Schedule email notifications before and after the due date.</li>
          <li><strong>Require Upfront Deposits:</strong> Bill 25-50% before work starts for larger projects.</li>
          <li><strong>Establish Late Payment Terms:</strong> Communicate late fee policies clearly in the footer terms.</li>
        </ul>
      </>
    )
  },
  "how-to-reduce-late-payments": {
    title: "How to Reduce Late Client Payments",
    description: "Actionable billing workflows to set penalty guidelines, communicate professionally, and handle payment delays.",
    readingTime: "5 min read",
    content: (
      <>
        <p className="mb-4">
          Late payments are a common challenge, but they can be managed with structured billing protocols. Proactive policies reduce late payment frequencies.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Billing Workflows to Prevent Delays</h3>
        <ul className="list-disc pl-5 mb-4 flex flex-col gap-2">
          <li><strong>Outline Late Payment Terms:</strong> Always state late fee percentages (e.g., 1.5% interest per month) in your invoice terms block.</li>
          <li><strong>Establish Credit Checks:</strong> Research credit histories of larger corporate clients before offering extended billing periods.</li>
          <li><strong>Design Follow-Up Templates:</strong> Maintain friendly but firm follow-up email drafts for 7-day, 14-day, and 30-day overdue thresholds.</li>
        </ul>
        <p className="mb-4">
          InvoiceFast&apos;s customizable terms and notes editor lets you add late payment disclosures directly to your default template.
        </p>
      </>
    )
  },
  "invoice-payment-terms": {
    title: "Understanding Invoice Payment Terms",
    description: "Deciphering standard invoice codes. Learn how Net 15, Net 30, Net 60, COD, and CIA affect cash flow.",
    readingTime: "4 min read",
    content: (
      <>
        <p className="mb-4">
          Payment terms specify when an invoice must be paid and what payment options are accepted. Selecting the right terms protects your cash flow.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Common Payment Terms Decoded</h3>
        <ul className="list-disc pl-5 mb-6 flex flex-col gap-2">
          <li><strong>Due on Receipt:</strong> The client is expected to make the payment immediately upon receiving the invoice.</li>
          <li><strong>Net 15 / Net 30 / Net 60:</strong> Payment is due within 15, 30, or 60 calendar days from the invoice date.</li>
          <li><strong>COD (Cash on Delivery):</strong> The client pays immediately when the service is completed or goods are delivered.</li>
          <li><strong>CIA (Cash in Advance):</strong> Full payment is required before any project deliverables or services begin.</li>
        </ul>
        <p className="mb-4">
          You can select from these standard terms directly inside the InvoiceFast date panel on the home page.
        </p>
      </>
    )
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};

  return {
    title: `${article.title} | InvoiceFast Guides`,
    description: article.description,
  };
}

export default async function StandaloneGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    notFound();
  }

  // Generate dynamic Article JSON-LD schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Organization",
      "name": "InvoiceFast"
    },
    "publisher": {
      "@type": "Organization",
      "name": "InvoiceFast",
      "logo": {
        "@type": "ImageObject",
        "url": "https://invoicefast.com/favicon.ico"
      }
    },
    "datePublished": "2026-07-04"
  };

  return (
    <article className="max-w-2xl mx-auto flex flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Navigation breadcrumbs */}
      <div className="text-xs text-text-secondary select-none">
        <Link href="/guides" className="hover:text-text-primary">Guides</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-text-primary">Deep-Dive Article</span>
      </div>

      <div className="border-b border-border pb-6">
        <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider block mb-2">
          Article &bull; {article.readingTime}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-3">
          {article.title}
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          {article.description}
        </p>
      </div>

      <div className="text-sm text-text-secondary leading-relaxed space-y-4">
        {article.content}
      </div>

      {/* Funnel conversion CTA block */}
      <div className="p-8 bg-zinc-900 text-white rounded-md text-center mt-10 flex flex-col items-center gap-4">
        <h3 className="text-lg font-bold">Create your professional invoice today</h3>
        <p className="text-zinc-400 text-xs max-w-sm">
          Get paid faster with clean PDF invoices generated instantly. Fully free, no registration required.
        </p>
        <Link
          href="/"
          className="py-2.5 px-6 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-md transition-colors duration-150 shadow-sm cursor-pointer mt-2"
        >
          Create Invoice Now
        </Link>
      </div>
    </article>
  );
}
