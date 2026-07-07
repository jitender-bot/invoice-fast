import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoicing Guides & Best Practices - InvoiceFast",
  description: "Browse our comprehensive Invoicing Guide course and standalone articles. Learn how to write invoices, get paid faster, and manage client billing.",
};

const courseChapters = [
  {
    slug: "introduction",
    title: "1. Introduction to Invoicing",
    description: "Understand the fundamentals of billing, why it matters, and how invoicing keeps cash flow healthy.",
    time: "4 min read"
  },
  {
    slug: "how-to-make-invoices",
    title: "2. How to Make an Invoice",
    description: "Step-by-step breakdown of required invoice fields, logo layouts, and clear payment details.",
    time: "5 min read"
  },
  {
    slug: "getting-paid",
    title: "3. Getting Paid on Time",
    description: "Setting payment terms, late fee policies, and streamlining accepted checkout methods.",
    time: "6 min read"
  },
  {
    slug: "client-billing",
    title: "4. Client Billing Management",
    description: "Handling recurring contracts, shipping fields, deposit requests, and credit notes.",
    time: "5 min read"
  },
  {
    slug: "running-your-business",
    title: "5. Running Your Business Finances",
    description: "Basic accounting practices, ledger tracking, sitemap record management, and taxation basics.",
    time: "6 min read"
  }
];

const standaloneArticles = [
  {
    slug: "invoice-to-cash",
    title: "The Invoice-to-Cash Process Flow",
    description: "Optimize your entire sales cycle from quotation submission to final bank reconciliation.",
    time: "5 min read"
  },
  {
    slug: "how-to-get-paid-faster",
    title: "How to Get Paid Faster: 7 Actionable Tips",
    description: "Proven billing strategies, automated payment reminders, and credit-card enablement benefits.",
    time: "6 min read"
  },
  {
    slug: "how-to-reduce-late-payments",
    title: "How to Reduce Late Client Payments",
    description: "Billing workflows to handle late payment fee definitions, communication templates, and reminders.",
    time: "5 min read"
  },
  {
    slug: "invoice-payment-terms",
    title: "Understanding Common Invoice Payment Terms",
    description: "Deciphering Net 15, Net 30, Net 60, COD, CIA, and select credit line terms.",
    time: "4 min read"
  }
];

export default function GuidesHubPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Title */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">Invoicing Guides & Course</h1>
        <p className="text-text-secondary text-sm">
          Learn how to professionalize your invoicing, set clean payment expectations, and accelerate cash flows.
        </p>
      </div>

      {/* 5-Part Course Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-primary border-l-2 border-accent pl-3">
          The 5-Part Invoicing Course
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseChapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/guides/invoicing-guide/${chapter.slug}`}
              className="group p-5 bg-background border border-border hover:border-accent/40 rounded-md transition-all duration-150 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-accent font-semibold uppercase tracking-wider block mb-1">
                  Course Chapter &bull; {chapter.time}
                </span>
                <h3 className="font-semibold text-text-primary text-base group-hover:text-accent transition-colors duration-150 mb-2">
                  {chapter.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed mb-4">
                  {chapter.description}
                </p>
              </div>
              <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-150">
                Start Chapter
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Standalone Articles Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text-primary border-l-2 border-accent pl-3">
          Deep-Dive Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standaloneArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/guides/${article.slug}`}
              className="group p-5 bg-background border border-border hover:border-accent/40 rounded-md transition-all duration-150 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider block mb-1">
                  Article &bull; {article.time}
                </span>
                <h3 className="font-semibold text-text-primary text-base group-hover:text-accent transition-colors duration-150 mb-2">
                  {article.title}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed mb-4">
                  {article.description}
                </p>
              </div>
              <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-150">
                Read Article
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
