"use client";

import React, { useRef } from "react";
import { useInvoiceStore } from "@/lib/store";
import { runAllCalculations } from "@/lib/calculations";
import { formatCurrency } from "@/lib/currency";

interface InvoicePreviewProps {
  isEditable?: boolean;
}

export function InvoicePreview({ isEditable = true }: InvoicePreviewProps) {
  const { invoice, updateField, updateFieldLabel, addLineItem, removeLineItem, updateLineItem } = useInvoiceStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { lineItems, currency, discountValue, discountType, taxRate, taxType, shipping, amountPaid } = invoice;

  const title = (invoice.fieldLabels.title || "INVOICE").toUpperCase();
  const isQuote = title === "QUOTE";
  const isCreditNote = title === "CREDIT NOTE";
  const isPurchaseOrder = title === "PURCHASE ORDER";

  // Run all money math
  const calculations = runAllCalculations(
    lineItems,
    discountValue,
    discountType,
    taxRate,
    taxType,
    shipping,
    amountPaid
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }
      // Max 2MB for base64 storage
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateField("logoUrl", event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    if (isEditable) {
      fileInputRef.current?.click();
    }
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateField("logoUrl", undefined);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-zinc-900 border border-zinc-200 rounded-md shadow-lg p-8 sm:p-12 min-h-[1050px] flex flex-col justify-between select-text">
      <div>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
          {/* Logo Area */}
          <div className="w-full sm:w-[240px]">
            {invoice.logoUrl ? (
              <div className="relative group inline-block max-w-[240px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={invoice.logoUrl}
                  alt="Company Logo"
                  className="max-w-full max-h-[140px] w-auto h-auto object-contain cursor-pointer rounded-sm"
                  onClick={isEditable ? handleLogoClick : undefined}
                />
                {isEditable && (
                  <button
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer shadow-xs"
                    aria-label="Remove Logo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              isEditable && (
                <div
                  onClick={handleLogoClick}
                  className="w-[180px] h-[100px] border border-dashed border-zinc-300 hover:border-accent rounded-sm flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100/50 cursor-pointer transition-colors duration-150 text-zinc-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-xs font-medium">Add Logo</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )
            )}
          </div>

          {/* Invoice Metadata Block */}
          <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-2 text-sm">
            {isEditable ? (
              <input
                value={invoice.fieldLabels.title || ""}
                onChange={(e) => updateFieldLabel("title", e.target.value)}
                placeholder="INVOICE"
                className="text-3xl font-bold tracking-tight text-zinc-900 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none text-left sm:text-right uppercase w-full max-w-[360px] mb-4 bg-transparent"
              />
            ) : (
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4 uppercase">
                {invoice.fieldLabels.title || "INVOICE"}
              </h2>
            )}

            {/* Invoice Number */}
            <div className="flex items-center gap-2">
              {isEditable ? (
                <>
                  <input
                    value={invoice.fieldLabels.invoiceNumber}
                    onChange={(e) => updateFieldLabel("invoiceNumber", e.target.value)}
                    className="w-36 text-right font-medium text-zinc-500 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none"
                  />
                  <input
                    value={invoice.invoiceNumber}
                    onChange={(e) => updateField("invoiceNumber", e.target.value)}
                    className="w-32 border border-zinc-200 focus:border-accent rounded-sm px-2 py-0.5 outline-none text-zinc-800"
                  />
                </>
              ) : (
                <>
                  <span className="font-medium text-zinc-500">{invoice.fieldLabels.invoiceNumber}:</span>
                  <span className="text-zinc-800 font-semibold">{invoice.invoiceNumber}</span>
                </>
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              {isEditable ? (
                <>
                  <input
                    value={invoice.fieldLabels.date}
                    onChange={(e) => updateFieldLabel("date", e.target.value)}
                    className="w-36 text-right font-medium text-zinc-500 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none"
                  />
                  <input
                    type="date"
                    value={invoice.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="w-32 border border-zinc-200 focus:border-accent rounded-sm px-2 py-0.5 outline-none text-zinc-850"
                  />
                </>
              ) : (
                <>
                  <span className="font-medium text-zinc-500">{invoice.fieldLabels.date}:</span>
                  <span className="text-zinc-850">{invoice.date}</span>
                </>
              )}
            </div>

            {/* Payment Terms */}
            {!isCreditNote && (
              <div className="flex items-center gap-2">
                {isEditable ? (
                  <>
                    <input
                      value={invoice.fieldLabels.paymentTerms}
                      onChange={(e) => updateFieldLabel("paymentTerms", e.target.value)}
                      className="w-36 text-right font-medium text-zinc-500 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none"
                    />
                    <select
                      value={invoice.paymentTerms}
                      onChange={(e) => updateField("paymentTerms", e.target.value)}
                      className="w-32 border border-zinc-200 focus:border-accent rounded-sm px-1 py-0.5 outline-none text-zinc-850 bg-white"
                    >
                      <option value="Due on Receipt">Due on Receipt</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-zinc-500">{invoice.fieldLabels.paymentTerms}:</span>
                    <span className="text-zinc-850">{invoice.paymentTerms}</span>
                  </>
                )}
              </div>
            )}

            {/* Due Date */}
            {!isQuote && !isCreditNote && !isPurchaseOrder && (
              <div className="flex items-center gap-2">
                {isEditable ? (
                  <>
                    <input
                      value={invoice.fieldLabels.dueDate}
                      onChange={(e) => updateFieldLabel("dueDate", e.target.value)}
                      className="w-36 text-right font-medium text-zinc-500 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none"
                    />
                    <input
                      type="date"
                      value={invoice.dueDate}
                      onChange={(e) => updateField("dueDate", e.target.value)}
                      className="w-32 border border-zinc-200 focus:border-accent rounded-sm px-2 py-0.5 outline-none text-zinc-850"
                    />
                  </>
                ) : (
                  <>
                    <span className="font-medium text-zinc-500">{invoice.fieldLabels.dueDate}:</span>
                    <span className="text-zinc-850 font-semibold">{invoice.dueDate}</span>
                  </>
                )}
              </div>
            )}

            {/* PO Number */}
            {!isPurchaseOrder && (
              <div className="flex items-center gap-2">
                {isEditable ? (
                  <>
                    <input
                      value={invoice.fieldLabels.poNumber}
                      onChange={(e) => updateFieldLabel("poNumber", e.target.value)}
                      className="w-36 text-right font-medium text-zinc-500 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none"
                    />
                    <input
                      value={invoice.poNumber}
                      placeholder="PO-12345"
                      onChange={(e) => updateField("poNumber", e.target.value)}
                      className="w-32 border border-zinc-200 focus:border-accent rounded-sm px-2 py-0.5 outline-none text-zinc-850"
                    />
                  </>
                ) : (
                  invoice.poNumber && (
                    <>
                      <span className="font-medium text-zinc-500">{invoice.fieldLabels.poNumber}:</span>
                      <span className="text-zinc-850">{invoice.poNumber}</span>
                    </>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sender / Recipients Block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {/* Sender */}
          <div className="flex flex-col gap-1.5">
            {isEditable ? (
              <>
                <input
                  value={invoice.fieldLabels.sender}
                  onChange={(e) => updateFieldLabel("sender", e.target.value)}
                  className="font-semibold text-zinc-500 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none text-sm w-full"
                />
                <textarea
                  value={invoice.sender}
                  onChange={(e) => updateField("sender", e.target.value)}
                  placeholder="Who is this invoice from?&#10;Your Business Name&#10;address@example.com"
                  rows={4}
                  className="border border-zinc-200 focus:border-accent rounded-sm px-2 py-1.5 outline-none text-sm resize-none text-zinc-800 leading-relaxed"
                />
              </>
            ) : (
              <>
                <span className="font-semibold text-zinc-500 text-sm">{invoice.fieldLabels.sender}</span>
                <p className="text-sm text-zinc-850 whitespace-pre-wrap leading-relaxed">{invoice.sender}</p>
              </>
            )}
          </div>

          {/* Bill To */}
          <div className="flex flex-col gap-1.5">
            {isEditable ? (
              <>
                <input
                  value={invoice.fieldLabels.billTo}
                  onChange={(e) => updateFieldLabel("billTo", e.target.value)}
                  className="font-semibold text-zinc-500 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none text-sm w-full"
                />
                <textarea
                  value={invoice.billTo}
                  onChange={(e) => updateField("billTo", e.target.value)}
                  placeholder="Who is this invoice to?&#10;Client Name&#10;billing@client.com"
                  rows={4}
                  className="border border-zinc-200 focus:border-accent rounded-sm px-2 py-1.5 outline-none text-sm resize-none text-zinc-800 leading-relaxed"
                />
              </>
            ) : (
              <>
                <span className="font-semibold text-zinc-500 text-sm">{invoice.fieldLabels.billTo}</span>
                <p className="text-sm text-zinc-850 whitespace-pre-wrap leading-relaxed">{invoice.billTo}</p>
              </>
            )}
          </div>

          {/* Ship To */}
          <div className="flex flex-col gap-1.5">
            {isEditable ? (
              <>
                <input
                  value={invoice.fieldLabels.shipTo}
                  onChange={(e) => updateFieldLabel("shipTo", e.target.value)}
                  className="font-semibold text-zinc-500 border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none text-sm w-full"
                />
                <textarea
                  value={invoice.shipTo}
                  onChange={(e) => updateField("shipTo", e.target.value)}
                  placeholder="(Optional) Shipping address..."
                  rows={4}
                  className="border border-zinc-200 focus:border-accent rounded-sm px-2 py-1.5 outline-none text-sm resize-none text-zinc-800 leading-relaxed"
                />
              </>
            ) : (
              invoice.shipTo && (
                <>
                  <span className="font-semibold text-zinc-500 text-sm">{invoice.fieldLabels.shipTo}</span>
                  <p className="text-sm text-zinc-850 whitespace-pre-wrap leading-relaxed">{invoice.shipTo}</p>
                </>
              )
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-300 text-zinc-500 text-xs font-semibold uppercase tracking-wider select-none">
                <th className="py-2 font-semibold text-left">
                  {isEditable ? (
                    <input
                      value={invoice.fieldLabels.item || ""}
                      onChange={(e) => updateFieldLabel("item", e.target.value)}
                      className="bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none font-semibold text-left uppercase text-zinc-500 text-xs tracking-wider w-full"
                    />
                  ) : (
                    invoice.fieldLabels.item || "Item"
                  )}
                </th>
                <th className="py-2 px-3 font-semibold text-right w-[110px]">
                  {isEditable ? (
                    <input
                      value={invoice.fieldLabels.quantity || ""}
                      onChange={(e) => updateFieldLabel("quantity", e.target.value)}
                      className="bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none font-semibold text-right uppercase text-zinc-500 text-xs tracking-wider w-full"
                    />
                  ) : (
                    invoice.fieldLabels.quantity || "Quantity"
                  )}
                </th>
                <th className="py-2 px-3 font-semibold text-right w-[120px]">
                  {isEditable ? (
                    <input
                      value={invoice.fieldLabels.rate || ""}
                      onChange={(e) => updateFieldLabel("rate", e.target.value)}
                      className="bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none font-semibold text-right uppercase text-zinc-500 text-xs tracking-wider w-full"
                    />
                  ) : (
                    invoice.fieldLabels.rate || "Rate"
                  )}
                </th>
                <th className="py-2 pl-3 font-semibold text-right w-[120px]">
                  {isEditable ? (
                    <input
                      value={invoice.fieldLabels.amount || ""}
                      onChange={(e) => updateFieldLabel("amount", e.target.value)}
                      className="bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none font-semibold text-right uppercase text-zinc-500 text-xs tracking-wider w-full"
                    />
                  ) : (
                    invoice.fieldLabels.amount || "Amount"
                  )}
                </th>
                {isEditable && <th className="py-2 w-[40px]"><span className="sr-only">Actions</span></th>}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id} className="border-b border-zinc-150 align-top group/row">
                  {/* Description */}
                  <td className="py-3 pr-2">
                    {isEditable ? (
                      <input
                        value={item.description}
                        placeholder="Item description or service details..."
                        onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                        className="w-full border border-zinc-200 focus:border-accent rounded-sm px-2 py-1 text-sm outline-none text-zinc-800"
                      />
                    ) : (
                      <span className="text-sm text-zinc-800 block whitespace-pre-wrap">{item.description}</span>
                    )}
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-2">
                    {isEditable ? (
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity === 0 ? "" : item.quantity}
                        onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                        className="w-full text-right border border-zinc-200 focus:border-accent rounded-sm px-2 py-1 text-sm outline-none text-zinc-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <span className="text-sm text-zinc-850 block text-right">{item.quantity}</span>
                    )}
                  </td>

                  {/* Rate */}
                  <td className="py-3 px-2">
                    {isEditable ? (
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.rate === 0 ? "" : item.rate}
                        onChange={(e) => updateLineItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                        className="w-full text-right border border-zinc-200 focus:border-accent rounded-sm px-2 py-1 text-sm outline-none text-zinc-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <span className="text-sm text-zinc-850 block text-right">
                        {formatCurrency(item.rate, currency)}
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-3 pl-3 text-right">
                    <span className="text-sm text-zinc-850 font-medium block">
                      {formatCurrency(item.amount, currency)}
                    </span>
                  </td>

                  {/* Actions (Delete button) */}
                  {isEditable && (
                    <td className="py-3 text-center align-middle">
                      {lineItems.length > 1 && (
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="text-zinc-400 hover:text-danger p-1 rounded-md transition-colors duration-150 cursor-pointer opacity-0 group-hover/row:opacity-100"
                          title="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.96-1.89c.31.15.68.27 1.05.33l.2.03m-17.2-.03-.2-.03c.37-.06.74-.18 1.05-.33M18.9 7.03 18 18.03A2.25 2.25 0 0 1 15.75 20H8.25A2.25 2.25 0 0 1 6.03 18.03L5.1 7.03M9 4.18c0-.62.42-1.12 1-1.24h4c.58.12 1 .62 1 1.24" />
                          </svg>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        {isEditable && (
          <button
            onClick={addLineItem}
            className="flex items-center gap-1 text-sm text-accent hover:text-accent-hover font-semibold transition-colors duration-150 cursor-pointer py-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Line Item
          </button>
        )}
      </div>

      {/* Calculations & Notes Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mt-12 pt-8 border-t border-zinc-200">
        {/* Notes & Terms Columns */}
        <div className="flex flex-col gap-6">
          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            {isEditable ? (
              <>
                <input
                  value={invoice.fieldLabels.notes || ""}
                  onChange={(e) => updateFieldLabel("notes", e.target.value)}
                  className="bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none font-semibold text-left uppercase text-zinc-500 text-xs tracking-wider w-full"
                />
                <textarea
                  value={invoice.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Notes - client payment options, payment bank accounts..."
                  rows={3}
                  className="border border-zinc-200 focus:border-accent rounded-sm px-2 py-1.5 outline-none text-xs resize-none text-zinc-800 leading-relaxed"
                />
              </>
            ) : (
              invoice.notes && (
                <>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{invoice.fieldLabels.notes || "Notes"}</span>
                  <p className="text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
                </>
              )
            )}
          </div>

          {/* Terms */}
          <div className="flex flex-col gap-1.5">
            {isEditable ? (
              <>
                <input
                  value={invoice.fieldLabels.terms || ""}
                  onChange={(e) => updateFieldLabel("terms", e.target.value)}
                  className="bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 rounded-sm px-1 py-0.5 outline-none font-semibold text-left uppercase text-zinc-500 text-xs tracking-wider w-full"
                />
                <textarea
                  value={invoice.terms}
                  onChange={(e) => updateField("terms", e.target.value)}
                  placeholder="Terms - late fee guidelines, delivery conditions..."
                  rows={3}
                  className="border border-zinc-200 focus:border-accent rounded-sm px-2 py-1.5 outline-none text-xs resize-none text-zinc-800 leading-relaxed"
                />
              </>
            ) : (
              invoice.terms && (
                <>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{invoice.fieldLabels.terms || "Terms"}</span>
                  <p className="text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed">{invoice.terms}</p>
                </>
              )
            )}
          </div>
        </div>

        {/* Calculations Block */}
        <div className="flex flex-col gap-3 text-sm text-zinc-600">
          {/* Subtotal */}
          <div className="flex justify-between items-center py-0.5">
            <span className="font-medium text-zinc-500">Subtotal</span>
            <span className="text-zinc-850 font-medium">{formatCurrency(calculations.subtotal, currency)}</span>
          </div>

          {/* Discount Block */}
          {(invoice.discountValue > 0 || isEditable) && (
            <div className="flex justify-between items-center py-0.5 gap-4">
              <span className="font-medium text-zinc-500 flex-1 flex items-center gap-1.5">
                Discount
                {isEditable && (
                  <div className="flex items-center rounded-sm border border-zinc-200 overflow-hidden bg-zinc-50 scale-90">
                    <button
                      onClick={() => updateField("discountType", "percent")}
                      className={`px-1.5 py-0.5 text-[10px] font-semibold cursor-pointer ${discountType === "percent" ? "bg-accent text-white" : "hover:bg-zinc-150"}`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => updateField("discountType", "flat")}
                      className={`px-1.5 py-0.5 text-[10px] font-semibold cursor-pointer ${discountType === "flat" ? "bg-accent text-white" : "hover:bg-zinc-150"}`}
                    >
                      $
                    </button>
                  </div>
                )}
              </span>
              <div className="flex items-center gap-2">
                {isEditable ? (
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={invoice.discountValue === 0 ? "" : invoice.discountValue}
                    onChange={(e) => updateField("discountValue", parseFloat(e.target.value) || 0)}
                    className="w-20 text-right border border-zinc-200 focus:border-accent rounded-sm px-1.5 py-0.5 outline-none text-zinc-800"
                    placeholder="0"
                  />
                ) : (
                  <span className="text-zinc-500 mr-2">
                    ({discountType === "percent" ? `${invoice.discountValue}%` : formatCurrency(invoice.discountValue, currency)})
                  </span>
                )}
                <span className="text-zinc-850 font-medium">
                  -{formatCurrency(calculations.discountAmount, currency)}
                </span>
              </div>
            </div>
          )}

          {/* Tax Block */}
          {(invoice.taxRate > 0 || isEditable) && (
            <div className="flex justify-between items-center py-0.5 gap-4">
              <span className="font-medium text-zinc-500 flex-1 flex items-center gap-1.5">
                Tax
                {isEditable && (
                  <div className="flex items-center rounded-sm border border-zinc-200 overflow-hidden bg-zinc-50 scale-90">
                    <button
                      onClick={() => updateField("taxType", "percent")}
                      className={`px-1.5 py-0.5 text-[10px] font-semibold cursor-pointer ${taxType === "percent" ? "bg-accent text-white" : "hover:bg-zinc-150"}`}
                    >
                      %
                    </button>
                    <button
                      onClick={() => updateField("taxType", "flat")}
                      className={`px-1.5 py-0.5 text-[10px] font-semibold cursor-pointer ${taxType === "flat" ? "bg-accent text-white" : "hover:bg-zinc-150"}`}
                    >
                      $
                    </button>
                  </div>
                )}
              </span>
              <div className="flex items-center gap-2">
                {isEditable ? (
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={invoice.taxRate === 0 ? "" : invoice.taxRate}
                    onChange={(e) => updateField("taxRate", parseFloat(e.target.value) || 0)}
                    className="w-20 text-right border border-zinc-200 focus:border-accent rounded-sm px-1.5 py-0.5 outline-none text-zinc-800"
                    placeholder="0"
                  />
                ) : (
                  <span className="text-zinc-500 mr-2">
                    ({taxType === "percent" ? `${invoice.taxRate}%` : formatCurrency(invoice.taxRate, currency)})
                  </span>
                )}
                <span className="text-zinc-850 font-medium">
                  +{formatCurrency(calculations.taxAmount, currency)}
                </span>
              </div>
            </div>
          )}

          {/* Shipping Block */}
          {(invoice.shipping > 0 || isEditable) && (
            <div className="flex justify-between items-center py-0.5 gap-4">
              <span className="font-medium text-zinc-500">Shipping</span>
              {isEditable ? (
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={invoice.shipping === 0 ? "" : invoice.shipping}
                  onChange={(e) => updateField("shipping", parseFloat(e.target.value) || 0)}
                  className="w-20 text-right border border-zinc-200 focus:border-accent rounded-sm px-1.5 py-0.5 outline-none text-zinc-800"
                  placeholder="0"
                />
              ) : (
                <span className="text-zinc-850 font-medium">
                  +{formatCurrency(shipping, currency)}
                </span>
              )}
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center py-1 border-t border-zinc-200">
            <span className="font-semibold text-zinc-700">Total</span>
            <span className="text-zinc-950 font-bold">{formatCurrency(calculations.total, currency)}</span>
          </div>

          {/* Amount Paid */}
          {!isQuote && !isPurchaseOrder && (
            <div className="flex justify-between items-center py-0.5">
              <span className="font-medium text-zinc-500">Amount Paid</span>
              {isEditable ? (
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={invoice.amountPaid === 0 ? "" : invoice.amountPaid}
                  onChange={(e) => updateField("amountPaid", parseFloat(e.target.value) || 0)}
                  className="w-20 text-right border border-zinc-200 focus:border-accent rounded-sm px-1.5 py-0.5 outline-none text-zinc-800"
                  placeholder="0"
                />
              ) : (
                <span className="text-zinc-850 font-medium">
                  -{formatCurrency(amountPaid, currency)}
                </span>
              )}
            </div>
          )}

          {/* Balance Due (The only text on the page allowed to be visually loud) */}
          {!isQuote && !isCreditNote && !isPurchaseOrder && (
            <div className="flex justify-between items-center py-2.5 border-t border-b border-zinc-200 mt-2 bg-zinc-50/50 px-2 rounded-sm">
              <span className="font-semibold text-zinc-800 text-base">Balance Due</span>
              <span className={`text-xl font-bold ${calculations.balanceDue > 0 ? "text-danger" : "text-accent"}`}>
                {formatCurrency(calculations.balanceDue, currency)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
