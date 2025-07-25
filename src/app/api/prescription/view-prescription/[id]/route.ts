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
        prescribed_doctor_name: true,
        next_visit_date: true,
        advise: true,
        patient: {
          select: { patient_name: true,
            city: true,
            mobile_number: true,
            gender:true,
            age:true,
            blood_group:true,
            weight:true,
           },
        },
        doctor: {
          select: { doctor_name: true,
            phone_number: true,
            designation: true,
           },
          
        },
        items: {
          select: {
            item_id: true,
            doctor_discount_type: true,
            doctor_discount_value: true,
            payable_doctor_amount: true,
            dose_morning: true,
            dose_mid_day: true,
            dose_night: true,
            duration_days: true,
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
                duration_months:true,
              },
            },
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    //Change date formate
    const prescribedDate = new Date(prescription.prescribed_at);
    const formattedPrescribedDate = `${String(prescribedDate.getDate()).padStart(2, "0")}.${String(prescribedDate.getMonth() + 1).padStart(2, "0")}.${prescribedDate.getFullYear()}`;

    const nextVisitDate = prescription.next_visit_date
      ? new Date(prescription.next_visit_date)
      : null;

    const formattedNextVisitDate = nextVisitDate
      ? `${String(nextVisitDate.getDate()).padStart(2, "0")}.${String(nextVisitDate.getMonth() + 1).padStart(2, "0")}.${nextVisitDate.getFullYear()}`
      : null;
    
    const formatted = {
      ...prescription,
      prescribed_at: formattedPrescribedDate,   
      next_visit_date: formattedNextVisitDate,
      items: prescription.items.map((item) => {
        return {
          ...item,
          medicine_name: item.medicine?.name ?? null,
          medicine: undefined, // remove nested object after extracting name
        };
      }),
      treatmentItems: prescription.treatmentItems.map((treat) => ({
        ...treat,
        treatment_name: treat.treatment?.treatment_name ?? null,
        duration_months: treat.treatment?.duration_months ?? null,
        treatment: undefined,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
