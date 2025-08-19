import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("prescription-list")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  try {
    const { id } = await params;
    const patientId = parseInt(id, 10);

    if (isNaN(patientId)) {
      return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
    }

    // Step 1: Get the latest prescription for this patient
    const latestPrescription = await prisma.prescription.findFirst({
      where: { patient_id: patientId },
      // orderBy: { prescribed_at: "desc" },
      // select: { prescription_id: true },
    });

    if (!latestPrescription) {
      return NextResponse.json(
        { message: "No prescriptions found for this patient" },
        { status: 404 }
      );
    }

    // Step 2: Get all treatments from that prescription
    const treatmentsRaw = await prisma.prescriptionTreatmentItem.findMany({
      // where: {
      //   prescription_id: latestPrescription.prescription_id,
      // },
      // orderBy: { created_at: "desc" },
      select: {
        id: true,
        prescription_id: true,
        treatment_id: true,
        patient_id:true,
        session_number: true,
        created_at: true,
        treatment: {
          select: {
            treatment_name: true,
            // total_cost: true,
          },
        },
      },
    });

    // Flatten treatment_name & total_cost
    const treatments = treatmentsRaw.map((t) => ({
      id: t.id,
      prescription_id: t.prescription_id,
      treatment_id: t.treatment_id,
      session_number: t.session_number,
      patient_id:t.patient_id,
      created_at: t.created_at,
      treatment_name: t.treatment?.treatment_name || null,
    }));

    return NextResponse.json(
      {
        prescription_id: latestPrescription.prescription_id,
        treatments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching treatments for latest prescription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
