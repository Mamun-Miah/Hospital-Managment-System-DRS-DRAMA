import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("invoice-details")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
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

    // 3. Get invoice treatments with treatment details
    const invoiceTreatments = await prisma.invoiceTreatment.findMany({
      where: {
        invoice_id: invoiceId,
      },
      include: {
        treatment: {
          select: {
            treatment_id: true,
            treatment_name: true,
            total_cost: true,
          },
        },
      },
    });

    // 4. Fetch payable treatment amounts from prescriptionTreatmentItem for this prescription_id
    const prescriptionTreatmentItems = await prisma.prescriptionTreatmentItem.findMany({
      where: {
        prescription_id: invoice.prescription?.prescription_id ?? 0,
      },
      select: {
        treatment_id: true,
        payable_treatment_amount: true,
      },
    });

    // Map treatment_id to payable amount for easy lookup
    const payableAmountMap = new Map<number, number>();
    for (const item of prescriptionTreatmentItems) {
      payableAmountMap.set(item.treatment_id, item.payable_treatment_amount);
    }

    const formattedTreatments = invoiceTreatments.map((item) => ({
      treatment_id: item.treatment?.treatment_id,
      treatment_name: item.treatment?.treatment_name || "",
      treatment_cost: item.treatment?.total_cost ?? 0,
      discount_type: null,  // discount info not stored in invoiceTreatment
      discount_value: null,
      payable_treatment_amount: payableAmountMap.get(item.treatment?.treatment_id ?? 0) ?? 0,
    }));

    return NextResponse.json(
      {
        invoice,
        patient_name: invoice.patient?.patient_name ?? "",
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
