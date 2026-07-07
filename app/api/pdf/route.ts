import React from "react";
import { pdf, DocumentProps } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "@/lib/pdf/invoice-pdf-document";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data || !data.lineItems) {
      return new Response(JSON.stringify({ error: "Invalid invoice data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Safely cast the template element to prevent strict type conflicts with @react-pdf/renderer
    const doc = React.createElement(InvoicePdfDocument, { data }) as unknown as React.ReactElement<DocumentProps>;
    const buffer = await pdf(doc).toBuffer();
    
    // Safely cast Node Buffer to standard Web BodyInit type
    const responseBody = buffer as unknown as BodyInit;

    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${data.invoiceNumber || "draft"}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF API handler failure:", error);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
