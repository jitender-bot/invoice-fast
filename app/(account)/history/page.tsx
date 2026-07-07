import React from "react";
import { HistoryDashboard } from "@/components/history-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice History - InvoiceFast",
  description: "Manage, search, and export invoice records securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryPage() {
  return <HistoryDashboard />;
}
