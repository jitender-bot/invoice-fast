import React from "react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 select-text">
        {children}
      </main>

      {/* Marketing Footer */}
      <footer className="w-full border-t border-border py-6 text-center text-xs text-text-secondary bg-background select-none mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} InvoiceFast. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
            <Link href="/" className="hover:text-text-primary">Invoice Tool</Link>
            <Link href="/templates/quote-template" className="hover:text-text-primary">Quote Template</Link>
            <Link href="/templates/credit-note-template" className="hover:text-text-primary">Credit Note Template</Link>
            <Link href="/templates/purchase-order-template" className="hover:text-text-primary">Purchase Order Template</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
