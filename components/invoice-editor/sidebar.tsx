"use client";

import React, { useState } from "react";
import { useInvoiceStore } from "@/lib/store";
import { currencies } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { runAllCalculations } from "@/lib/calculations";

export function EditorSidebar() {
  const { invoice, updateField, resetInvoice } = useInvoiceStore();
  const { data: session, status: authStatus } = useSession();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoice.invoiceNumber || "draft"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("PDF download error occurred. Please try again.");
    }
  };

  const handleSave = async () => {
    setSaveState("saving");
    try {
      const invoiceId = invoice.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
      
      // Update state in Zustand store
      updateField("id", invoiceId);
      updateField("status", "SAVED");

      // Calculate totals for saving using calculations engine
      const { total, balanceDue } = runAllCalculations(
        invoice.lineItems,
        invoice.discountValue,
        invoice.discountType,
        invoice.taxRate,
        invoice.taxType,
        invoice.shipping,
        invoice.amountPaid
      );

      // Determine createdAt date
      let createdAt = new Date().toISOString();
      try {
        const localHistory = localStorage.getItem("invoice-fast-history");
        if (localHistory) {
          const list = JSON.parse(localHistory);
          const found = list.find((item: any) => item.id === invoiceId);
          if (found && found.createdAt) {
            createdAt = found.createdAt;
          }
        }
      } catch (e) {
        console.error("Failed to parse local history for createdAt sync:", e);
      }

      const localRecord = {
        id: invoiceId,
        localId: invoiceId,
        number: invoice.invoiceNumber,
        billTo: invoice.billTo,
        shipTo: invoice.shipTo,
        date: invoice.date,
        dueDate: invoice.dueDate,
        paymentTerms: invoice.paymentTerms,
        poNumber: invoice.poNumber,
        currency: invoice.currency,
        lineItems: invoice.lineItems,
        notes: invoice.notes,
        terms: invoice.terms,
        taxRate: invoice.taxRate,
        taxType: invoice.taxType,
        discountValue: invoice.discountValue,
        discountType: invoice.discountType,
        shipping: invoice.shipping,
        amountPaid: invoice.amountPaid,
        total,
        balanceDue,
        fieldLabels: invoice.fieldLabels,
        logoUrl: invoice.logoUrl,
        status: "SAVED",
        createdAt,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const localHistory = localStorage.getItem("invoice-fast-history");
      const historyList = localHistory ? JSON.parse(localHistory) : [];
      const updatedList = historyList.filter((item: any) => item.id !== invoiceId);
      updatedList.unshift(localRecord);
      localStorage.setItem("invoice-fast-history", JSON.stringify(updatedList));

      // Sync to cloud if authenticated
      if (authStatus === "authenticated" && session?.user?.id) {
        const response = await fetch("/api/invoices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ invoices: [localRecord] }),
        });

        if (!response.ok) {
          throw new Error("Failed to sync to cloud");
        }
      }

      setSaveState("success");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      console.error("Save/Sync error:", err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  return (
    <aside className="w-full lg:w-[280px] flex flex-col gap-6 select-none">
      {/* Primary Actions Group */}
      <div className="flex flex-col gap-3 p-4 bg-surface border border-border rounded-md shadow-xs">
        {/* Download Action */}
        <button
          onClick={handleDownload}
          className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-md shadow-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PDF
        </button>

        {/* Save Action */}
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className={`w-full py-2.5 px-4 font-semibold text-sm rounded-md shadow-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            saveState === "success"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : saveState === "error"
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-surface hover:bg-border/30 text-text-primary border border-border"
          }`}
        >
          {saveState === "saving" ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : saveState === "success" ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Saved!
            </>
          ) : saveState === "error" ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              Save Error
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
              </svg>
              Save Invoice
            </>
          )}
        </button>

        {/* Clear/Reset Draft Action */}
        <button
          onClick={() => {
            if (confirm("Are you sure you want to clear this draft? All progress will be lost.")) {
              resetInvoice();
            }
          }}
          className="w-full py-1.5 px-4 text-xs text-text-secondary hover:text-danger hover:bg-danger/5 rounded-md transition-colors duration-150 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reset Draft
        </button>
      </div>

      {/* Collapsible Invoice Settings */}
      <div className="border border-border rounded-md bg-surface overflow-hidden">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full p-4 flex items-center justify-between font-semibold text-sm text-text-primary hover:bg-border/20 cursor-pointer border-b border-border bg-surface"
        >
          <span>Invoice Settings</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isSettingsOpen ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isSettingsOpen && (
          <div className="p-4 flex flex-col gap-4">
            {/* Currency Selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="currency-select" className="text-xs font-semibold text-text-secondary">
                Currency
              </label>
              <select
                id="currency-select"
                value={invoice.currency}
                onChange={(e) => updateField("currency", e.target.value)}
                className="w-full p-2 text-sm border border-border bg-background text-text-primary rounded-md outline-none focus:border-accent"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol}) — {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
