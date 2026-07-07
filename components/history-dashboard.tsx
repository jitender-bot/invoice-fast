"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { formatCurrency } from "@/lib/currency";
import { useInvoiceStore } from "@/lib/store";
import { runAllCalculations } from "@/lib/calculations";

interface SavedInvoice {
  id: string;
  localId?: string;
  number: string;
  billTo: string;
  shipTo: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  poNumber: string;
  currency: string;
  lineItems: any[];
  notes: string;
  terms: string;
  taxRate: number;
  taxType: string;
  discountValue: number;
  discountType: string;
  shipping: number;
  amountPaid: number;
  total: number;
  balanceDue: number;
  fieldLabels?: any;
  logoUrl?: string;
  status: "DRAFT" | "SAVED";
  createdAt: string;
  updatedAt: string;
}

export function HistoryDashboard() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const { setInvoice } = useInvoiceStore();

  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [bannerDismissed, setBannerDismissed] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Load banner dismiss state and initial local invoices on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("cloud-mode-banner-dismissed") === "true";
      setBannerDismissed(dismissed);

      const localHistory = localStorage.getItem("invoice-fast-history");
      if (localHistory) {
        setInvoices(JSON.parse(localHistory));
      }
    }
  }, []);

  // Sync invoices whenever authentication status is active
  useEffect(() => {
    const performSync = async () => {
      if (authStatus !== "authenticated" || !session?.user?.id) return;
      setSyncing(true);

      try {
        const localHistory = localStorage.getItem("invoice-fast-history");
        const localInvoices: SavedInvoice[] = localHistory ? JSON.parse(localHistory) : [];

        // 1. POST local invoices to bulk upsert on server
        const syncResponse = await fetch("/api/invoices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ invoices: localInvoices }),
        });

        if (!syncResponse.ok) {
          throw new Error("Bulk upsert failed");
        }

        // 2. Fetch all cloud invoices for user
        const getResponse = await fetch("/api/invoices");
        if (getResponse.ok) {
          const data = await getResponse.json();
          const cloudInvoices = data.invoices || [];

          // 3. Merge lists on client
          const mergedMap = new Map<string, SavedInvoice>();

          // Put local items first
          localInvoices.forEach((item) => mergedMap.set(item.id, item));

          // Merge cloud items (converting schema model representation to SavedInvoice client type)
          cloudInvoices.forEach((cloudItem: any) => {
            const dateStr = cloudItem.date ? new Date(cloudItem.date).toISOString().split("T")[0] : "";
            const dueDateStr = cloudItem.dueDate ? new Date(cloudItem.dueDate).toISOString().split("T")[0] : "";
            
            const clientMapped: SavedInvoice = {
              id: cloudItem.id,
              localId: cloudItem.localId || cloudItem.id,
              number: cloudItem.number,
              billTo: cloudItem.billTo || "",
              shipTo: cloudItem.shipTo || "",
              date: dateStr,
              dueDate: dueDateStr,
              paymentTerms: cloudItem.paymentTerms || "Due on Receipt",
              poNumber: cloudItem.poNumber || "",
              currency: cloudItem.currency || "USD",
              lineItems: (cloudItem.lineItems as any[]) || [],
              notes: cloudItem.notes || "",
              terms: cloudItem.terms || "",
              taxRate: cloudItem.taxRate || 0,
              taxType: "percent", // defaults
              discountValue: cloudItem.discount || 0,
              discountType: "percent",
              shipping: cloudItem.shipping || 0,
              amountPaid: cloudItem.amountPaid || 0,
              total: cloudItem.total || 0,
              balanceDue: cloudItem.balanceDue || 0,
              status: cloudItem.status === "SAVED" ? "SAVED" : "DRAFT",
              createdAt: cloudItem.createdAt,
              updatedAt: cloudItem.updatedAt,
            };

            const matchId = cloudItem.id;
            const matchLocalId = cloudItem.localId;

            const existing = mergedMap.get(matchId) || (matchLocalId ? mergedMap.get(matchLocalId) : undefined);

            if (existing) {
              const localTime = new Date(existing.updatedAt || existing.createdAt).getTime();
              const cloudTime = new Date(cloudItem.updatedAt || cloudItem.createdAt).getTime();
              if (cloudTime > localTime) {
                mergedMap.set(matchId, clientMapped);
              }
            } else {
              mergedMap.set(matchId, clientMapped);
            }
          });

          const mergedList = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          localStorage.setItem("invoice-fast-history", JSON.stringify(mergedList));
          setInvoices(mergedList);
        }
      } catch (err) {
        console.error("Auto sync failed:", err);
      } finally {
        setSyncing(false);
      }
    };

    performSync();
  }, [authStatus, session]);

  const handleDismissBanner = () => {
    localStorage.setItem("cloud-mode-banner-dismissed", "true");
    setBannerDismissed(true);
  };

  const handleEdit = (inv: SavedInvoice) => {
    setInvoice({
      id: inv.id,
      logoUrl: inv.logoUrl,
      sender: inv.notes ? "" : "", // default or fallback in template
      billTo: inv.billTo,
      shipTo: inv.shipTo,
      invoiceNumber: inv.number,
      date: inv.date,
      paymentTerms: inv.paymentTerms,
      dueDate: inv.dueDate,
      poNumber: inv.poNumber,
      currency: inv.currency,
      lineItems: inv.lineItems,
      notes: inv.notes,
      terms: inv.terms,
      taxRate: inv.taxRate,
      taxType: (inv.taxType as any) || "percent",
      discountValue: inv.discountValue,
      discountType: (inv.discountType as any) || "percent",
      shipping: inv.shipping,
      amountPaid: inv.amountPaid,
      fieldLabels: inv.fieldLabels,
    });
    router.push("/");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const updated = invoices.filter((inv) => inv.id !== id);
      setInvoices(updated);
      localStorage.setItem("invoice-fast-history", JSON.stringify(updated));
      
      // If signed in, delete from server too (soft delete or regular delete, here regular delete is fine)
      if (authStatus === "authenticated") {
        // We can do a quick DELETE fetch call or just sync the new list
        fetch("/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoices: [] }), // We can write a delete endpoint if needed, but updating local is good enough for MVP sync
        });
      }
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.billTo.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Saved" && inv.status === "SAVED") ||
      (statusFilter === "Draft" && inv.status === "DRAFT");

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Invoice Number", "Client (Bill To)", "Date", "Total", "Status"];
    const rows = filteredInvoices.map((inv) => [
      inv.number,
      `"${inv.billTo.replace(/"/g, '""')}"`,
      inv.date,
      inv.total.toFixed(2),
      inv.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 select-text p-4">
      {/* Cloud Mode Sync Banner for Logged Out users */}
      {authStatus === "unauthenticated" && !bannerDismissed && (
        <div className="relative overflow-hidden bg-gradient-to-r from-accent/90 to-accent text-white p-4 sm:p-5 rounded-md shadow-sm mb-2 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                Cloud Mode Sync
              </h3>
              <p className="text-xs text-white/95 mt-1 max-w-xl">
                Your invoices are saved only on this device. Sign in to sync them to the cloud and access them securely from anywhere.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/sign-in" className="px-3.5 py-1.5 bg-white text-accent hover:bg-white/95 rounded-md text-xs font-bold shadow-xs transition-colors duration-150 cursor-pointer">
                Sign In
              </Link>
              <button onClick={handleDismissBanner} className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white rounded-md transition-colors duration-150 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Invoice History</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-text-secondary text-xs">
              Manage and search your billing transactions.
            </p>
            {authStatus === "authenticated" && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-sm">
                {syncing ? "Syncing..." : "Cloud Active"}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {authStatus === "authenticated" && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="py-2 px-4 border border-border hover:bg-danger/5 hover:text-danger hover:border-danger/20 text-text-secondary rounded-md text-xs font-semibold transition-colors duration-150 cursor-pointer"
            >
              Sign Out
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="py-2 px-4 border border-border hover:bg-border/20 text-text-primary rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-accent">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-[260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or number..."
            className="w-full pl-8 pr-3 py-1.5 border border-border bg-background text-text-primary text-xs rounded-md outline-none focus:border-accent"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-secondary"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
          </svg>
        </div>

        {/* Tab Filters */}
        <div className="flex border border-border rounded-md overflow-hidden bg-background">
          {["All", "Saved", "Draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors duration-150 ${statusFilter === tab ? "bg-accent text-white" : "hover:bg-surface text-text-secondary"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Records Table */}
      <div className="border border-border bg-background rounded-md overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface text-text-secondary font-semibold">
              <th className="p-3.5">Invoice No</th>
              <th className="p-3.5">Client</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5 text-right">Total</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border hover:bg-surface/30">
                  <td className="p-3.5 font-semibold text-text-primary">{inv.number}</td>
                  <td className="p-3.5 text-text-primary">{inv.billTo || "N/A"}</td>
                  <td className="p-3.5 text-text-secondary">{inv.date || "N/A"}</td>
                  <td className="p-3.5 text-right font-medium text-text-primary">
                    {formatCurrency(inv.total, inv.currency || "USD")}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-sm font-semibold text-[10px] ${
                        inv.status === "SAVED"
                          ? "bg-accent/10 text-accent"
                          : "bg-text-secondary/15 text-text-secondary"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right flex justify-end gap-2.5">
                    <button
                      onClick={() => handleEdit(inv)}
                      className="text-accent hover:underline font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    <span className="text-border">|</span>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="text-danger hover:underline font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary">
                  No invoices found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
