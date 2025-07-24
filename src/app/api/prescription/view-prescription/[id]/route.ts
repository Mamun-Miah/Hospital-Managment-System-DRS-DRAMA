import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prescriptionId = parseInt(id);

    const prescription = await prisma.prescription.findUnique({
      where: { prescription_id: prescriptionId },
      select: {
        prescription_id: true,
        prescribed_at: true,
        is_prescribed: true,
        is_drs_derma: true,
        total_cost: true,
        patient_id: true,
        doctor_id: true,
        patient: {
          select: { patient_name: true },
        },
        doctor: {
          select: { doctor_name: true },
        },
        items: {
          select: {
            item_id: true,
            prescribed_doctor_name: true,
            doctor_discount_type: true,
            doctor_discount_value: true,
            payable_doctor_amount: true,
            advice: true,
            next_visit_date: true,
            dose_morning: true,
            dose_mid_day: true,
            dose_night: true,
            duration_days: true,
            is_prescribed: true,
            medicine: {
              select: {
                name: true,
              },
            },
          },
        },
        treatmentItems: {
          select: {
            id: true,
            discount_type: true,
            discount_value: true,
            payable_treatment_amount: true,
            treatment: {
              select: {
                treatment_name: true,
              },
            },
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    // Format date to 'YYYY-MM-DD'
    const formatted = {
      ...prescription,
      prescribed_at: prescription.prescribed_at.toISOString().slice(0, 10),
      items: prescription.items.map((item) => ({
        ...item,
        next_visit_date: item.next_visit_date
          ? item.next_visit_date.toISOString().slice(0, 10)
          : null,
        medicine_name: item.medicine?.name ?? null,
        medicine: undefined, // remove nested object after extracting name
      })),
      treatmentItems: prescription.treatmentItems.map((treat) => ({
        ...treat,
        treatment_name: treat.treatment?.treatment_name ?? null,
        treatment: undefined,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
