import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const patientId = parseInt(params.id);

  if (isNaN(patientId)) {
    return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_id: patientId },
      include: {
        Prescription: {
          orderBy: { prescribed_at: "desc" },
          include: {
            doctor: true,
            items: {
              include: {
                medicine: true,
              },
            },
            treatmentItems: {
              include: {
                treatment: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Format the response nicely
    const formatted = {
      patient_id: patient.patient_id,
      patient_name: patient.patient_name,
      age: patient.age,
      gender: patient.gender,
      prescriptions: patient.Prescription.map((prescription) => ({
        prescription_id: prescription.prescription_id,
        prescribed_at: prescription.prescribed_at.toISOString().split("T")[0],
        doctor_name: prescription.doctor?.doctor_name || "Unknown",
        doctor_image: prescription.doctor?.doctor_image || "/uploads/default.avif",
        total_cost: prescription.total_cost,
        is_prescribed: prescription.is_prescribed,
        advise: prescription.advise || "",
        medicines: prescription.items.map((item) => ({
          item_id: item.item_id,
          medicine_id: item.medicine_id,
          medicine_name: item.medicine?.name || "Unknown",
          dose_morning: item.dose_morning || "",
          dose_mid_day: item.dose_mid_day || "",
          dose_night: item.dose_night || "",
          duration_days: item.duration_days || 0,
        })),
        treatments: prescription.treatmentItems.map((treatmentItem) => ({
          id: treatmentItem.id,
          treatment_id: treatmentItem.treatment_id,
          treatment_name: treatmentItem.treatment?.treatment_name || "Unknown",
          discount_type: treatmentItem.discount_type,
          discount_value: treatmentItem.discount_value,
          payable_amount: treatmentItem.payable_treatment_amount,
        })),
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching patient history:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


