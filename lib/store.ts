import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InvoiceData, LineItem, InvoiceFieldLabels } from "./types";

const initialLabels: InvoiceFieldLabels = {
  invoiceNumber: "Invoice No",
  date: "Date",
  paymentTerms: "Payment Terms",
  dueDate: "Due Date",
  poNumber: "PO Number",
  billTo: "Bill To",
  shipTo: "Ship To",
  sender: "From",
  item: "Item",
  quantity: "Quantity",
  rate: "Rate",
  amount: "Amount",
  notes: "Notes",
  terms: "Terms",
  title: "INVOICE",
};

const initialInvoiceData: Omit<InvoiceData, "id"> = {
  sender: "",
  billTo: "",
  shipTo: "",
  invoiceNumber: "INV-0001",
  date: "", // Initialized on client/store instantiation
  paymentTerms: "Due on Receipt",
  dueDate: "",     // Initialized on client/store instantiation
  poNumber: "",
  currency: "USD",
  lineItems: [], // Initialized as single item on create/reset
  notes: "",
  terms: "",
  taxRate: 0,
  taxType: "percent",
  discountValue: 0,
  discountType: "percent",
  shipping: 0,
  amountPaid: 0,
  fieldLabels: initialLabels,
};

export interface InvoiceStore {
  invoice: InvoiceData;
  updateField: <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => void;
  updateFieldLabel: (field: keyof InvoiceFieldLabels, value: string) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, updates: Partial<Omit<LineItem, "id" | "amount">>) => void;
  resetInvoice: () => void;
  setInvoice: (data: Partial<InvoiceData>) => void;
}

// Helper function to calculate due date
export function calculateDueDate(startDateStr: string, terms: string): string {
  if (!startDateStr) return startDateStr;
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return startDateStr;

  let days = 0;
  if (terms === "Net 15") days = 15;
  else if (terms === "Net 30") days = 30;
  else if (terms === "Net 60") days = 60;
  else if (terms === "Due on Receipt") days = 0;
  else return startDateStr; // Leave unchanged for custom/custom date setting

  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

const getUUID = () => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set) => ({
      invoice: {
        ...initialInvoiceData,
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date().toISOString().split("T")[0],
        lineItems: [
          { id: "item-1", description: "", quantity: 1, rate: 0, amount: 0 }
        ]
      } as InvoiceData,
      updateField: (field, value) =>
        set((state) => {
          const updatedInvoice = { ...state.invoice, [field]: value };
          if (field === "date" || field === "paymentTerms") {
            updatedInvoice.dueDate = calculateDueDate(updatedInvoice.date, updatedInvoice.paymentTerms);
          }
          return { invoice: updatedInvoice };
        }),
      updateFieldLabel: (field, value) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            fieldLabels: {
              ...state.invoice.fieldLabels,
              [field]: value,
            },
          },
        })),
      addLineItem: () =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            lineItems: [
              ...state.invoice.lineItems,
              {
                id: `item-${getUUID()}`,
                description: "",
                quantity: 1,
                rate: 0,
                amount: 0,
              },
            ],
          },
        })),
      removeLineItem: (id) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            lineItems: state.invoice.lineItems.filter((item) => item.id !== id),
          },
        })),
      updateLineItem: (id, updates) =>
        set((state) => {
          const lineItems = state.invoice.lineItems.map((item) => {
            if (item.id === id) {
              const qty = updates.quantity !== undefined ? updates.quantity : item.quantity;
              const rate = updates.rate !== undefined ? updates.rate : item.rate;
              return {
                ...item,
                ...updates,
                amount: (qty || 0) * (rate || 0),
              };
            }
            return item;
          });
          return { invoice: { ...state.invoice, lineItems } };
        }),
      resetInvoice: () =>
        set(() => ({
          invoice: {
            ...initialInvoiceData,
            date: new Date().toISOString().split("T")[0],
            dueDate: new Date().toISOString().split("T")[0],
            lineItems: [
              {
                id: `item-${getUUID()}`,
                description: "",
                quantity: 1,
                rate: 0,
                amount: 0,
              },
            ],
          } as InvoiceData,
        })),
      setInvoice: (data) =>
        set((state) => ({
          invoice: { ...state.invoice, ...data },
        })),
    }),
    {
      name: "invoice-fast-draft",
    }
  )
);
