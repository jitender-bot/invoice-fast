export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number; // auto-calculated
}

export type TaxType = "percent" | "flat";
export type DiscountType = "percent" | "flat";

export interface InvoiceFieldLabels {
  invoiceNumber: string;
  date: string;
  paymentTerms: string;
  dueDate: string;
  poNumber: string;
  billTo: string;
  shipTo: string;
  sender: string;
  item: string;
  quantity: string;
  rate: string;
  amount: string;
  notes: string;
  terms: string;
  title: string;
}

export interface InvoiceData {
  id?: string; // unique identifier for saving/syncing
  status?: "DRAFT" | "SAVED";
  logoUrl?: string;
  sender: string;
  billTo: string;
  shipTo: string;
  invoiceNumber: string;
  date: string;
  paymentTerms: string; // Net 15, Net 30, etc.
  dueDate: string;
  poNumber: string;
  currency: string;
  lineItems: LineItem[];
  notes: string;
  terms: string;
  taxRate: number;
  taxType: TaxType;
  discountValue: number;
  discountType: DiscountType;
  shipping: number;
  amountPaid: number;
  fieldLabels: InvoiceFieldLabels;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}
