import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const invoiceId = parseInt(id);

  try {
    // 1. Get invoice with patient and prescription info
    const invoice = await prisma.invoice.findUnique({
      where: { invoice_id: invoiceId },
      include: {
        patient: {
          select: { patient_name: true },
        },
        doctor: {
          select: { doctor_name: true },
        },
        prescription: {
          select: {
            prescription_id: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // 2. Get previous invoice for patient (for previous due)
    const previousInvoice = await prisma.invoice.findFirst({
      where: {
        patient_id: invoice.patient_id,
        invoice_id: { lt: invoiceId },
      },
      orderBy: {
        invoice_id: "desc",
      },
      select: {
        due_amount: true,
        invoice_number: true,
      },
    });

    // 3. Get treatments from prescription with full details (including total_cost from treatmentlist)
    const treatments = await prisma.prescriptionTreatmentItem.findMany({
      where: {
        prescription_id: invoice.prescription?.prescription_id ?? 0,
      },
      include: {
        treatment: {
          select: {
            treatment_name: true,
            total_cost: true, // <-- This gets the cost from Treatmentlist
          },
        },
      },
    });

    const formattedTreatments = treatments.map((t) => ({
      treatment_name: t.treatment?.treatment_name || "",
      treatment_cost: t.treatment?.total_cost ?? 0,
      discount_type: t.discount_type,
      discount_value: t.discount_value,
      payable_treatment_amount: t.payable_treatment_amount,
    }));

    return NextResponse.json(
      {
        invoice,
        patient_name: invoice.patient?.patient_name ?? "",
        doctor_name: invoice.doctor?.doctor_name ?? "N/A",
        previous_due: previousInvoice?.due_amount ?? 0,
        previous_invoice_number: previousInvoice?.invoice_number ?? null,
        treatments: formattedTreatments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching invoice data." },
      { status: 500 }
    );
  }
}
