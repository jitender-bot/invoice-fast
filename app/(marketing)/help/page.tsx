import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Frequently Asked Questions - InvoiceFast",
  description: "Learn how to create, download, and save invoices. Discover how our client-side storage guarantees privacy and speed.",
};

const faqs = [
  {
    question: "Why should I use InvoiceFast instead of other tools?",
    answer: "InvoiceFast is designed for speed and privacy. There is no signup required to create and download invoices. The editor runs instantly in your browser, and because your data is saved client-side, it never touches our servers unless you choose to create an account and send it through our mail service."
  },
  {
    question: "How do I create and download an invoice?",
    answer: "Fill out the sender and receiver details on the home screen, add your line items (quantity, rate, and description), toggle tax or discounts if needed, select your currency, and click the 'Download PDF' button in the sidebar. Your PDF generates instantly."
  },
  {
    question: "Where is my invoice data stored?",
    answer: "By default, all in-progress invoice data is autosaved locally to your browser's localStorage. This means you can refresh the page, close your browser, or come back days later and find your invoice exactly as you left it. None of this data is sent to our servers for logged-out users."
  },
  {
    question: "Is InvoiceFast free to use?",
    answer: "Yes, client-side PDF invoice generation and downloads are 100% free and unlimited. No payment, credit card, or account registration is required to download invoices."
  },
  {
    question: "Can I save templates and track client payments?",
    answer: "Yes! In Phase 2, we are launching Accounts (gated via Clerk). Creating a free account allows you to securely save your business template (logo, addresses, terms), check your historical invoices in a dashboard, email hosted pay links to clients via Resend, and accept card/bank payments online via Stripe."
  }
];

export default function HelpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <article className="max-w-2xl mx-auto flex flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">Help & FAQ</h1>
        <p className="text-text-secondary text-sm">
          Everything you need to know about creating, downloading, and managing invoices on InvoiceFast.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="p-5 bg-background border border-border rounded-md shadow-xs">
            <h3 className="font-semibold text-text-primary text-base mb-2">{faq.question}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Funnel conversion CTA block */}
      <div className="p-8 bg-zinc-900 text-white rounded-md text-center mt-6 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Ready to create an invoice?</h2>
        <p className="text-zinc-400 text-sm max-w-md">
          Generate professional, clean PDF invoices instantly. No login required, 100% free.
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
