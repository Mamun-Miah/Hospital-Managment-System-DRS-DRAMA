import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },) {

     const id = (await params).id;
     const invoiceId = parseInt(id);

  try {
    const viewInvoiceList = await prisma.invoice.findMany({

        where: {
            invoice_id:invoiceId
        },
    })
      

    return NextResponse.json({ viewInvoiceList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching invoices." },
      { status: 500 }
    );
  }
}
