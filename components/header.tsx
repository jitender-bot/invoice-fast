"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useInvoiceStore } from "@/lib/store";

export function Header() {
  const { data: session, status } = useSession();
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const { resetInvoice } = useInvoiceStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shadow-xs select-none relative z-50">
      <div className="flex items-center gap-6">
        <Link href="/" onClick={() => resetInvoice()} className="flex items-center gap-2">
          <span className="font-semibold text-lg text-text-primary tracking-tight">InvoiceFast</span>
          <span className="text-[10px] uppercase font-bold bg-accent/10 text-accent rounded-sm px-1.5 py-0.5">
            Free
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-text-secondary">
          <Link href="/history" className="hover:text-text-primary transition-colors duration-150">
            History
          </Link>
          <Link href="/guides" className="hover:text-text-primary transition-colors duration-150">
            Guides
          </Link>
          <Link href="/help" className="hover:text-text-primary transition-colors duration-150">
            Help
          </Link>
          
          {/* Templates Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
              className="hover:text-text-primary transition-colors duration-150 flex items-center gap-1 cursor-pointer"
            >
              Templates
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-text-secondary">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {isTemplatesOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsTemplatesOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg py-1 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link 
                    href="/templates/quote-template" 
                    onClick={() => {
                      resetInvoice();
                      setIsTemplatesOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-surface text-text-primary"
                  >
                    Quote Template
                  </Link>
                  <Link 
                    href="/templates/credit-note-template" 
                    onClick={() => {
                      resetInvoice();
                      setIsTemplatesOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-surface text-text-primary"
                  >
                    Credit Note Template
                  </Link>
                  <Link 
                    href="/templates/purchase-order-template" 
                    onClick={() => {
                      resetInvoice();
                      setIsTemplatesOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-surface text-text-primary"
                  >
                    Purchase Order Template
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary hidden md:inline">
              {session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="py-1.5 px-3 border border-border hover:bg-danger/5 hover:text-danger hover:border-danger/20 text-text-secondary rounded-md text-xs font-semibold transition-colors duration-150 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors duration-150">
              Sign In
            </Link>
            <Link href="/sign-up" className="py-1.5 px-3 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-md shadow-sm transition-colors duration-150">
              Sign Up
            </Link>
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
