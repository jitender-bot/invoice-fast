import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Chapter static parameters
export async function generateStaticParams() {
  return [
    { slug: "introduction" },
    { slug: "how-to-make-invoices" },
    { slug: "getting-paid" },
    { slug: "client-billing" },
    { slug: "running-your-business" },
  ];
}

interface ChapterData {
  title: string;
  description: string;
  readingTime: string;
  content: React.ReactNode;
  faq?: Array<{ question: string; answer: string }>;
}

const chapters: Record<string, ChapterData> = {
  introduction: {
    title: "1. Introduction to Invoicing Fundamentals",
    description: "Learn the core basics of invoices, why they are essential for businesses, and how they protect cash flow.",
    readingTime: "4 min read",
    content: (
      <>
        <p className="mb-4">
          An invoice is a commercial document issued by a seller to a buyer, relating to a sale transaction and indicating the products, quantities, and agreed prices for products or services. In simple terms, it is a formal request for payment.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Why Invoicing Matters</h3>
        <p className="mb-4">
          Invoicing serves several crucial business purposes:
        </p>
        <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5">
          <li><strong>Legal Record:</strong> It acts as a legal agreement proving that services or goods were delivered.</li>
          <li><strong>Tax Compliance:</strong> Governments require invoices to track sales tax (VAT, GST) and business revenue.</li>
          <li><strong>Account Analytics:</strong> It allows business owners to manage invoices, monitor growth metrics, and reconcile cash flow.</li>
        </ul>
        <p className="mb-4">
          Setting up clean invoicing practices early prevents client misunderstandings and late fees later.
        </p>
      </>
    ),
    faq: [
      {
        question: "What makes an invoice legally binding?",
        answer: "An invoice becomes a legal record when it documents a mutual agreement where services/goods were delivered and the client acknowledged the pricing terms."
      }
    ]
  },
  "how-to-make-invoices": {
    title: "2. How to Make a Professional Invoice",
    description: "Step-by-step guidance on logo placement, address blocks, PO numbers, and line items layout.",
    readingTime: "5 min read",
    content: (
      <>
        <p className="mb-4">
          A professional invoice should be clear, detailed, and easy to read. Missing crucial fields is one of the leading causes of late client payments.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Key Invoice Fields</h3>
        <p className="mb-4">
          Every standard invoice should contain the following details:
        </p>
        <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5">
          <li><strong>Header Information:</strong> Your company name, contact info, and business logo.</li>
          <li><strong>Client Block:</strong> Clear billing address and, if necessary, shipping details.</li>
          <li><strong>Unique Identifiers:</strong> A sequential invoice number, date, and PO (Purchase Order) number.</li>
          <li><strong>Itemized Table:</strong> Descriptions of the services/goods, quantities, unit rates, and totals.</li>
          <li><strong>Totals & Taxes:</strong> Calculations showing subtotal, discounts, sales tax, and shipping fees.</li>
        </ul>
        <p className="mb-4">
          You can customize and generate a professional invoice instantly using our homepage editor.
        </p>
      </>
    ),
    faq: [
      {
        question: "Why do I need a Purchase Order (PO) number?",
        answer: "Many corporate clients require a PO number to match the invoice with their internal department budgets. Omitting it can delay payments."
      }
    ]
  },
  "getting-paid": {
    title: "3. Getting Paid on Time",
    description: "Establishing payment terms, implementing late payment policies, and offering online payment options.",
    readingTime: "6 min read",
    content: (
      <>
        <p className="mb-4">
          Setting clear payment terms upfront is key to avoiding late client cash flows. It is important to communicate payment options clearly.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Actionable Strategies for On-Time Payments</h3>
        <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5">
          <li><strong>Offer Online Payments:</strong> Letting clients pay instantly via credit card or ACH bank transfer significantly speeds up payment times compared to physical checks.</li>
          <li><strong>Use Standard Terms:</strong> Opt for clear durations like Net 15 or Net 30, and avoid overly complex language.</li>
          <li><strong>Set Late Fees:</strong> Define late payment penalty terms on the invoice sheet itself to encourage prompt compliance.</li>
        </ul>
        <p className="mb-4">
          InvoiceFast allows you to link credit card payment checkout pages directly onto sent invoices (available in Phase 2).
        </p>
      </>
    ),
    faq: [
      {
        question: "What does Net 30 mean?",
        answer: "Net 30 indicates that the client must pay the full invoice amount within 30 days of the invoice date."
      }
    ]
  },
  "client-billing": {
    title: "4. Client Billing & Relationship Management",
    description: "Handling deposits, recurring invoices, credit notes, and customer billing communications.",
    readingTime: "5 min read",
    content: (
      <>
        <p className="mb-4">
          Invoicing is a key touchpoint in client relationships. Keeping billing communications professional and organized fosters long-term client trust.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Complex Invoicing Scenarios</h3>
        <p className="mb-4">
          As your business grows, you may need to manage other billing documents:
        </p>
        <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5">
          <li><strong>Deposits/Downpayments:</strong> Requesting partial payment upfront to secure services.</li>
          <li><strong>Credit Notes:</strong> Issuing a credit to correct an overcharge or resolve a client dispute.</li>
          <li><strong>Recurring Retainers:</strong> Automating invoices on a set weekly or monthly schedule.</li>
        </ul>
        <p className="mb-4">
          InvoiceFast allows you to customize field labels to adapt the editor engine to credit notes and quotes.
        </p>
      </>
    ),
    faq: [
      {
        question: "When should I issue a Credit Note?",
        answer: "Issue a credit note when you need to cancel a portion of an outstanding invoice due to a billing error, discount correction, or project adjustment."
      }
    ]
  },
  "running-your-business": {
    title: "5. Running Your Business Finances",
    description: "Basic financial hygiene, tracking invoices, sitemaps, and taxation considerations.",
    readingTime: "6 min read",
    content: (
      <>
        <p className="mb-4">
          Healthy invoicing is the foundation of clean accounting. Good record-keeping makes tax season smooth and supports business planning.
        </p>
        <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Accounting Best Practices</h3>
        <ul className="list-disc pl-5 mb-4 flex flex-col gap-1.5">
          <li><strong>Separate Accounts:</strong> Always use a dedicated business bank account for client receipts.</li>
          <li><strong>Track Aging Reports:</strong> Monitor unpaid invoices regularly and follow up on overdue amounts promptly.</li>
          <li><strong>Back Up Invoices:</strong> Export and store copies of all paid invoices to comply with tax audit regulations.</li>
        </ul>
        <p className="mb-4">
          InvoiceFast&apos;s History dashboard (scaffolded in Phase 2) allows users to search, filter, and export invoice batches to CSV.
        </p>
      </>
    ),
    faq: [
      {
        question: "How long should I keep invoice records?",
        answer: "Tax authorities generally require businesses to retain invoice receipts and billing records for a minimum of 3 to 7 years depending on local laws."
      }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = chapters[slug];
  if (!chapter) return {};

  return {
    title: `${chapter.title} - Invoicing Course | InvoiceFast`,
    description: chapter.description,
  };
}

export default async function InvoicingGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = chapters[slug];

  if (!chapter) {
    notFound();
  }

  // Generate dynamic JSON-LD FAQ schema
  const faqSchema = chapter.faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": chapter.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <article className="max-w-2xl mx-auto flex flex-col gap-6">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Navigation breadcrumbs */}
      <div className="text-xs text-text-secondary select-none">
        <Link href="/guides" className="hover:text-text-primary">Guides</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-text-primary">Invoicing Course</span>
      </div>

      <div className="border-b border-border pb-6">
        <span className="text-xs text-accent font-bold uppercase tracking-wider block mb-2">
          Course Chapter &bull; {chapter.readingTime}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-3">
          {chapter.title}
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          {chapter.description}
        </p>
      </div>

      <div className="text-sm text-text-secondary leading-relaxed space-y-4">
        {chapter.content}
      </div>

      {/* FAQ Display if present */}
      {chapter.faq && (
        <div className="mt-8 pt-8 border-t border-border">
          <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Chapter FAQ</h4>
          <div className="flex flex-col gap-4">
            {chapter.faq.map((item, idx) => (
              <div key={idx} className="p-4 bg-background border border-border rounded-sm">
                <span className="text-xs font-semibold text-text-primary block mb-1">{item.question}</span>
                <p className="text-xs text-text-secondary leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funnel conversion CTA block */}
      <div className="p-8 bg-zinc-900 text-white rounded-md text-center mt-10 flex flex-col items-center gap-4">
        <h3 className="text-lg font-bold">Apply this chapter directly</h3>
        <p className="text-zinc-400 text-xs max-w-sm">
          Generate clean, itemized invoices in seconds. Download for free without signing up.
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
