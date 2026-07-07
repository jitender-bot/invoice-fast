import test from "node:test";
import assert from "node:assert";
import {
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
  calculateBalanceDue,
  runAllCalculations,
} from "./calculations";
import { LineItem } from "./types";

test("calculateSubtotal", () => {
  const items: LineItem[] = [
    { id: "1", description: "Item 1", quantity: 2, rate: 10.5, amount: 21.0 },
    { id: "2", description: "Item 2", quantity: 3, rate: 15.0, amount: 45.0 },
  ];
  assert.strictEqual(calculateSubtotal(items), 66.0);

  const itemsEmpty: LineItem[] = [];
  assert.strictEqual(calculateSubtotal(itemsEmpty), 0.0);

  const itemsRounding: LineItem[] = [
    { id: "1", description: "Item 1", quantity: 1, rate: 10.333, amount: 10.33 },
    { id: "2", description: "Item 2", quantity: 1, rate: 20.666, amount: 20.67 },
  ];
  assert.strictEqual(calculateSubtotal(itemsRounding), 31.0);
});

test("calculateDiscount", () => {
  assert.strictEqual(calculateDiscount(100, 10, "percent"), 10.0);
  assert.strictEqual(calculateDiscount(100, 15, "flat"), 15.0);
  assert.strictEqual(calculateDiscount(100, 0, "percent"), 0.0);
  assert.strictEqual(calculateDiscount(100, 150, "flat"), 100.0); // discount cannot exceed subtotal
});

test("calculateTax", () => {
  assert.strictEqual(calculateTax(100, 5, "percent"), 5.0);
  assert.strictEqual(calculateTax(100, 12.5, "flat"), 12.5);
  assert.strictEqual(calculateTax(100, 0, "percent"), 0.0);
});

test("calculateTotal", () => {
  assert.strictEqual(calculateTotal(100, 10, 5, 15), 110.0); // 100 - 10 + 5 + 15 = 110
  assert.strictEqual(calculateTotal(100, 120, 10, 5), 15.0); // Subtotal - discount cannot go below 0 (0 + 10 + 5 = 15)
});

test("calculateBalanceDue", () => {
  assert.strictEqual(calculateBalanceDue(100, 40), 60.0);
  assert.strictEqual(calculateBalanceDue(100, 120), -20.0);
});

test("runAllCalculations", () => {
  const items: LineItem[] = [
    { id: "1", description: "A", quantity: 2, rate: 50, amount: 100 },
  ];
  const result = runAllCalculations(items, 10, "percent", 5, "percent", 10, 20);
  assert.strictEqual(result.subtotal, 100.0);
  assert.strictEqual(result.discountAmount, 10.0);
  assert.strictEqual(result.taxAmount, 4.5);
  assert.strictEqual(result.total, 104.5);
  assert.strictEqual(result.balanceDue, 84.5);
});
