import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const invoiceList = await prisma.invoice.findMany({
      include: {
        patient: {
          select: {
            patient_name: true,
          },
        },
        doctor: {
          select: {
            doctor_name: true,
          },
        },
      },
      orderBy: {
        invoice_creation_date: "desc",
      },
    });

    const formattedinvoiceList = invoiceList.map((invoice) => ({
      ...invoice,
      doctor_name: invoice.doctor?.doctor_name || null,
      patient_name: invoice.patient?.patient_name || null,
      doctor: undefined,
      patient: undefined,
    }));

    return NextResponse.json({ formattedinvoiceList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching invoices." },
      { status: 500 }
    );
  }
}
