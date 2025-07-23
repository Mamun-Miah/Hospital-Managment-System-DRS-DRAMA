import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prescriptionList = await prisma.prescription.findMany({
  where: {
    is_prescribed: "Yes",
    
  },
  select: {
    prescription_id: true,
    prescribed_at: true,
    is_prescribed: true,
    is_drs_derma: true,
    patient_id: true,
    patient: {
      select: {
        patient_name: true,
      },
    },
    doctor_id: true,
    doctor: {
      select: {
        doctor_name: true,
      },
    },
  },
});

    return NextResponse.json({ prescriptionlist: prescriptionList });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching prescriptions." },
      { status: 500 }
    );
  }
}
