"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useInvoiceStore } from "@/lib/store";
import { Header } from "@/components/header";
import { InvoicePreview } from "@/components/invoice-preview";
import { EditorSidebar } from "@/components/invoice-editor/sidebar";

export default function TemplatePage() {
  const params = useParams();
  const type = params.type as string;
  const { updateFieldLabel } = useInvoiceStore();

  useEffect(() => {
    if (type === "quote-template") {
      updateFieldLabel("title", "QUOTE");
      updateFieldLabel("invoiceNumber", "Quote No");
    } else if (type === "credit-note-template") {
      updateFieldLabel("title", "CREDIT NOTE");
      updateFieldLabel("invoiceNumber", "Credit Note No");
    } else if (type === "purchase-order-template") {
      updateFieldLabel("title", "PURCHASE ORDER");
      updateFieldLabel("invoiceNumber", "Purchase Order No");
    }
  }, [type, updateFieldLabel]);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
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
