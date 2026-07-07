"use client";

import React, { useEffect } from "react";
import { useInvoiceStore } from "@/lib/store";
import { Header } from "@/components/header";
import { InvoicePreview } from "@/components/invoice-preview";
import { EditorSidebar } from "@/components/invoice-editor/sidebar";

export default function Home() {
  const { updateFieldLabel } = useInvoiceStore();

  useEffect(() => {
    updateFieldLabel("title", "INVOICE");
    updateFieldLabel("invoiceNumber", "Invoice No");
  }, [updateFieldLabel]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "InvoiceFast",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Create professional PDF invoices instantly in your browser. Fully free, no signup required, with automatic layout preview.",
    "browserRequirements": "Requires HTML5"
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Invoice Page WYSIWYG Sheet */}
        <div className="flex-1 w-full">
          <InvoicePreview isEditable={true} />
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-auto shrink-0 sticky top-6">
          <EditorSidebar />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full border-t border-border py-4 text-center text-xs text-text-secondary bg-background select-none">
        <p>&copy; {new Date().getFullYear()} InvoiceFast. All rights reserved. Always free client-side PDF downloads.</p>
      </footer>
    </div>
  );
}
