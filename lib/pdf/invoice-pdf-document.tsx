import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { InvoiceData } from "../types";
import { runAllCalculations } from "../calculations";
import { formatCurrency } from "../currency";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1A1D21",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 35,
  },
  logo: {
    width: 140,
    height: 70,
    objectFit: "contain",
  },
  logoPlaceholder: {
    width: 140,
    height: 70,
  },
  titleContainer: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1D21",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 3,
  },
  metaLabel: {
    color: "#6B7280",
    width: 80,
    textAlign: "right",
    marginRight: 6,
  },
  metaValue: {
    color: "#1A1D21",
    width: 100,
    textAlign: "right",
  },
  addressesContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  addressCol: {
    flex: 1,
    paddingRight: 10,
  },
  addressLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  addressText: {
    fontSize: 9,
    lineHeight: 1.3,
    color: "#1A1D21",
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E5E9",
    paddingBottom: 5,
    marginBottom: 5,
  },
  thDesc: {
    flex: 1,
    color: "#6B7280",
    fontSize: 7.5,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  thQty: {
    width: 60,
    textAlign: "right",
    color: "#6B7280",
    fontSize: 7.5,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  thRate: {
    width: 90,
    textAlign: "right",
    color: "#6B7280",
    fontSize: 7.5,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  thAmount: {
    width: 90,
    textAlign: "right",
    color: "#6B7280",
    fontSize: 7.5,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E5E9",
    paddingVertical: 5,
    alignItems: "flex-start",
  },
  tdDesc: {
    flex: 1,
    fontSize: 9,
    color: "#1A1D21",
  },
  tdQty: {
    width: 60,
    textAlign: "right",
    fontSize: 9,
    color: "#1A1D21",
  },
  tdRate: {
    width: 90,
    textAlign: "right",
    fontSize: 9,
    color: "#1A1D21",
  },
  tdAmount: {
    width: 90,
    textAlign: "right",
    fontSize: 9,
    color: "#1A1D21",
  },
  bottomGrid: {
    flexDirection: "row",
    marginTop: 15,
  },
  bottomLeft: {
    flex: 1,
    paddingRight: 30,
  },
  bottomRight: {
    width: 220,
  },
  sectionTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 3,
    marginTop: 10,
  },
  sectionContent: {
    fontSize: 8,
    lineHeight: 1.3,
    color: "#6B7280",
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  calcLabel: {
    color: "#6B7280",
  },
  calcValue: {
    color: "#1A1D21",
  },
  calcTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#E2E5E9",
    marginTop: 2,
  },
  calcTotalLabel: {
    color: "#1A1D21",
  },
  calcTotalValue: {
    color: "#1A1D21",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#E2E5E9",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E5E9",
    marginTop: 4,
  },
  balanceLabel: {
    color: "#1A1D21",
    fontSize: 10,
  },
  balanceValue: {
    fontSize: 11,
  },
});

interface InvoicePdfDocumentProps {
  data: InvoiceData;
}

export function InvoicePdfDocument({ data }: InvoicePdfDocumentProps) {
  const {
    sender,
    billTo,
    shipTo,
    invoiceNumber,
    date,
    paymentTerms,
    dueDate,
    poNumber,
    currency,
    lineItems,
    notes,
    terms,
    taxRate,
    taxType,
    discountValue,
    discountType,
    shipping,
    amountPaid,
    fieldLabels,
  } = data;

  const titleStr = (fieldLabels.title || "INVOICE").toUpperCase();
  const isQuote = titleStr === "QUOTE";
  const isCreditNote = titleStr === "CREDIT NOTE";
  const isPurchaseOrder = titleStr === "PURCHASE ORDER";

  const calculations = runAllCalculations(
    lineItems,
    discountValue,
    discountType,
    taxRate,
    taxType,
    shipping,
    amountPaid
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header block */}
        <View style={styles.header}>
          {data.logoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={data.logoUrl} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder} />
          )}

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{fieldLabels.title || "INVOICE"}</Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{fieldLabels.invoiceNumber}:</Text>
              <Text style={styles.metaValue}>{invoiceNumber}</Text>
            </View>
             <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{fieldLabels.date}:</Text>
              <Text style={styles.metaValue}>{date}</Text>
            </View>
            {!isCreditNote ? (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>{fieldLabels.paymentTerms}:</Text>
                <Text style={styles.metaValue}>{paymentTerms}</Text>
              </View>
            ) : null}
            {!isQuote && !isCreditNote && !isPurchaseOrder ? (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>{fieldLabels.dueDate}:</Text>
                <Text style={styles.metaValue}>{dueDate}</Text>
              </View>
            ) : null}
            {!isPurchaseOrder && poNumber ? (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>{fieldLabels.poNumber}:</Text>
                <Text style={styles.metaValue}>{poNumber}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Addresses block */}
        <View style={styles.addressesContainer}>
          <View style={styles.addressCol}>
            <Text style={styles.addressLabel}>{fieldLabels.sender}</Text>
            <Text style={styles.addressText}>{sender}</Text>
          </View>
          <View style={styles.addressCol}>
            <Text style={styles.addressLabel}>{fieldLabels.billTo}</Text>
            <Text style={styles.addressText}>{billTo}</Text>
          </View>
          <View style={styles.addressCol}>
            {shipTo ? (
              <>
                <Text style={styles.addressLabel}>{fieldLabels.shipTo}</Text>
                <Text style={styles.addressText}>{shipTo}</Text>
              </>
            ) : null}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thDesc}>{fieldLabels.item || "Item"}</Text>
            <Text style={styles.thQty}>{fieldLabels.quantity || "Quantity"}</Text>
            <Text style={styles.thRate}>{fieldLabels.rate || "Rate"}</Text>
            <Text style={styles.thAmount}>{fieldLabels.amount || "Amount"}</Text>
          </View>

          {lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tdDesc}>{item.description}</Text>
              <Text style={styles.tdQty}>{item.quantity}</Text>
              <Text style={styles.tdRate}>{formatCurrency(item.rate, currency)}</Text>
              <Text style={styles.tdAmount}>{formatCurrency(item.amount, currency)}</Text>
            </View>
          ))}
        </View>

        {/* Notes & Totals block */}
        <View style={styles.bottomGrid}>
          {/* Notes/Terms on Left */}
          <View style={styles.bottomLeft}>
            {notes ? (
              <View>
                <Text style={styles.sectionTitle}>{fieldLabels.notes || "Notes"}</Text>
                <Text style={styles.sectionContent}>{notes}</Text>
              </View>
            ) : null}
            {terms ? (
              <View>
                <Text style={styles.sectionTitle}>{fieldLabels.terms || "Terms"}</Text>
                <Text style={styles.sectionContent}>{terms}</Text>
              </View>
            ) : null}
          </View>

          {/* Calculations on Right */}
          <View style={styles.bottomRight}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Subtotal</Text>
              <Text style={styles.calcValue}>{formatCurrency(calculations.subtotal, currency)}</Text>
            </View>

            {discountValue > 0 ? (
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>
                  Discount ({discountType === "percent" ? `${discountValue}%` : formatCurrency(discountValue, currency)})
                </Text>
                <Text style={styles.calcValue}>-{formatCurrency(calculations.discountAmount, currency)}</Text>
              </View>
            ) : null}

            {taxRate > 0 ? (
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>
                  Tax ({taxType === "percent" ? `${taxRate}%` : formatCurrency(taxRate, currency)})
                </Text>
                <Text style={styles.calcValue}>+{formatCurrency(calculations.taxAmount, currency)}</Text>
              </View>
            ) : null}

            {shipping > 0 ? (
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Shipping</Text>
                <Text style={styles.calcValue}>+{formatCurrency(shipping, currency)}</Text>
              </View>
            ) : null}

            <View style={styles.calcTotalRow}>
              <Text style={styles.calcTotalLabel}>Total</Text>
              <Text style={styles.calcTotalValue}>{formatCurrency(calculations.total, currency)}</Text>
            </View>

            {!isQuote && !isPurchaseOrder && amountPaid > 0 ? (
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Amount Paid</Text>
                <Text style={styles.calcValue}>-{formatCurrency(amountPaid, currency)}</Text>
              </View>
            ) : null}

            {!isQuote && !isCreditNote && !isPurchaseOrder ? (
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Balance Due</Text>
                <Text
                  style={[
                    styles.balanceValue,
                    { color: calculations.balanceDue > 0 ? "#C0362C" : "#1E8E5A" }
                  ]}
                >
                  {formatCurrency(calculations.balanceDue, currency)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
}
