import { LineItem, TaxType, DiscountType } from "./types";

/**
 * Rounds a number to exactly two decimal places.
 */
export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates subtotal as sum of line item quantity * rate.
 */
export function calculateSubtotal(lineItems: LineItem[]): number {
  const subtotal = lineItems.reduce((acc, item) => {
    const itemAmount = (item.quantity || 0) * (item.rate || 0);
    return acc + itemAmount;
  }, 0);
  return roundToTwo(subtotal);
}

/**
 * Calculates discount amount.
 * Discount is calculated on subtotal.
 */
export function calculateDiscount(
  subtotal: number,
  discountValue: number,
  discountType: DiscountType
): number {
  if (!discountValue || discountValue <= 0) return 0;
  
  let discountAmount = 0;
  if (discountType === "percent") {
    discountAmount = subtotal * (discountValue / 100);
  } else {
    discountAmount = discountValue;
  }
  
  return roundToTwo(Math.min(discountAmount, subtotal)); // Discount cannot exceed subtotal
}

/**
 * Calculates tax amount.
 * Tax is calculated on (subtotal - discount).
 */
export function calculateTax(
  taxableAmount: number,
  taxRate: number,
  taxType: TaxType
): number {
  if (!taxRate || taxRate <= 0) return 0;
  
  let taxAmount = 0;
  if (taxType === "percent") {
    taxAmount = taxableAmount * (taxRate / 100);
  } else {
    taxAmount = taxRate;
  }
  
  return roundToTwo(taxAmount);
}

/**
 * Calculates final total.
 * Total = Subtotal - Discount + Tax + Shipping
 */
export function calculateTotal(
  subtotal: number,
  discountAmount: number,
  taxAmount: number,
  shipping: number
): number {
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const total = discountedSubtotal + taxAmount + (shipping || 0);
  return roundToTwo(total);
}

/**
 * Calculates balance due.
 * Balance Due = Total - Amount Paid
 */
export function calculateBalanceDue(total: number, amountPaid: number): number {
  const balance = total - (amountPaid || 0);
  return roundToTwo(balance);
}
export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  balanceDue: number;
}

export function runAllCalculations(
  lineItems: LineItem[],
  discountValue: number,
  discountType: DiscountType,
  taxRate: number,
  taxType: TaxType,
  shipping: number,
  amountPaid: number
): InvoiceCalculations {
  const subtotal = calculateSubtotal(lineItems);
  const discountAmount = calculateDiscount(subtotal, discountValue, discountType);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = calculateTax(taxableAmount, taxRate, taxType);
  const total = calculateTotal(subtotal, discountAmount, taxAmount, shipping);
  const balanceDue = calculateBalanceDue(total, amountPaid);

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
    balanceDue,
  };
}
