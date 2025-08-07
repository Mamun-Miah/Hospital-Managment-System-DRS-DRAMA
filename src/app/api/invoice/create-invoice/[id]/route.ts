import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const invoiceId = parseInt((await params).id);

  try {
    const body = await request.json();

    const {
      payment_method,
      payment_type,
      previous_due,
      total_treatment_cost,
      paid_amount,
      doctor_fee,
      due_amount,
      treatment_ids, // array of treatment_id
    } = body;

    // 1. Check if invoice exists
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoice_id: invoiceId },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 }
      );
    }

    // 2. Update only NULL fields
    const updatedInvoice = await prisma.invoice.update({
            where: { invoice_id: invoiceId },
            data: {
                payment_method: payment_method ?? existingInvoice.payment_method,
                payment_type: payment_type ?? existingInvoice.payment_type,
                previous_due: previous_due ?? existingInvoice.previous_due,
                total_treatment_cost: total_treatment_cost ?? existingInvoice.total_treatment_cost,
                paid_amount: paid_amount ?? existingInvoice.paid_amount,
                doctor_fee: doctor_fee ?? existingInvoice.doctor_fee,
                due_amount: due_amount ?? existingInvoice.due_amount,
            },
            });


    // 3. Save treatment IDs (if provided)
    if (Array.isArray(treatment_ids)) {
        await prisma.invoiceTreatment.deleteMany({
            where: { invoice_id: invoiceId },
        });

        if (treatment_ids.length > 0) {
            await prisma.invoiceTreatment.createMany({
            data: treatment_ids.map((treatment_id: number) => ({
                invoice_id: invoiceId,
                treatment_id,
            })),
            skipDuplicates: true,
            });
        }
        }

    return NextResponse.json(
      {
        message: "Invoice updated successfully",
        invoice: updatedInvoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the invoice." },
      { status: 500 }
    );
  }
}
