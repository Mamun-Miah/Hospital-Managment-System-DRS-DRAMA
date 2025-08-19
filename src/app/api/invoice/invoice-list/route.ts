import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("invoice-list")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  try {
    const invoiceList = await prisma.invoice.findMany({
      include: {
        patient: {
          select: {
            patient_name: true,
            mobile_number: true,
          },
        },
        doctor: {
          select: {
            doctor_name: true,
          },
        },
        prescription: {
          select: {
            total_cost: true,
          },
        },
      },
      orderBy: {
        invoice_creation_date: "desc",
      },
    });

    const formattedinvoiceList = invoiceList.map((invoice) => ({
      ...invoice,
      doctor_name: invoice.doctor?.doctor_name || "",
      patient_name: invoice.patient?.patient_name || "",
      mobile_number: invoice.patient?.mobile_number || "",
      total_cost: invoice.prescription?.total_cost || 0,
      paid_amount: invoice.paid_amount || 0,
      doctor: undefined,
      patient: undefined,
      prescription: undefined,
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
