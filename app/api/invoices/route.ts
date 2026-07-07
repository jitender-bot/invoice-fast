import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@/generated/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Fetch invoices error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invoices } = await request.json();

    if (!Array.isArray(invoices)) {
      return NextResponse.json({ error: "Invalid payload: invoices must be an array" }, { status: 400 });
    }

    const userId = session.user.id;
    const syncedInvoices = [];

    for (const inv of invoices) {
      // Basic validation
      if (!inv.id || !inv.number) {
        continue;
      }

      // Map values carefully to fit the schema
      const status = inv.status === "SAVED" ? InvoiceStatus.SAVED : InvoiceStatus.DRAFT;
      const date = inv.date ? new Date(inv.date) : null;
      const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;
      const discount = typeof inv.discount === "number" ? inv.discount : (typeof inv.discountValue === "number" ? inv.discountValue : 0);

      // Check if invoice exists by id or localId for this user
      const existing = await prisma.invoice.findFirst({
        where: {
          OR: [
            { id: inv.id },
            { localId: inv.localId || inv.id, userId }
          ]
        }
      });

      let record;
      if (existing) {
        record = await prisma.invoice.update({
          where: { id: existing.id },
          data: {
            number: inv.number,
            status,
            billTo: inv.billTo || "",
            shipTo: inv.shipTo || "",
            date,
            dueDate,
            paymentTerms: inv.paymentTerms || "",
            poNumber: inv.poNumber || "",
            currency: inv.currency || "USD",
            lineItems: inv.lineItems || [],
            notes: inv.notes || "",
            terms: inv.terms || "",
            taxRate: typeof inv.taxRate === "number" ? inv.taxRate : 0,
            discount,
            shipping: typeof inv.shipping === "number" ? inv.shipping : 0,
            amountPaid: typeof inv.amountPaid === "number" ? inv.amountPaid : 0,
            total: typeof inv.total === "number" ? inv.total : 0,
            balanceDue: typeof inv.balanceDue === "number" ? inv.balanceDue : 0,
            localId: inv.localId || inv.id,
          }
        });
      } else {
        record = await prisma.invoice.create({
          data: {
            id: inv.id,
            userId,
            localId: inv.localId || inv.id,
            number: inv.number,
            status,
            billTo: inv.billTo || "",
            shipTo: inv.shipTo || "",
            date,
            dueDate,
            paymentTerms: inv.paymentTerms || "",
            poNumber: inv.poNumber || "",
            currency: inv.currency || "USD",
            lineItems: inv.lineItems || [],
            notes: inv.notes || "",
            terms: inv.terms || "",
            taxRate: typeof inv.taxRate === "number" ? inv.taxRate : 0,
            discount,
            shipping: typeof inv.shipping === "number" ? inv.shipping : 0,
            amountPaid: typeof inv.amountPaid === "number" ? inv.amountPaid : 0,
            total: typeof inv.total === "number" ? inv.total : 0,
            balanceDue: typeof inv.balanceDue === "number" ? inv.balanceDue : 0,
          }
        });
      }
      syncedInvoices.push(record);
    }

    return NextResponse.json({ success: true, count: syncedInvoices.length, invoices: syncedInvoices });
  } catch (error) {
    console.error("Sync invoices error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
