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
        mobile_number:true,
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


 const prescriptionListData = prescriptionList.map((item) => ({
      prescription_id: item.prescription_id,
      prescribed_at: item.prescribed_at.toISOString().slice(0, 10),
      is_prescribed: item.is_prescribed,
      is_drs_derma: item.is_drs_derma,
      patient_id: item.patient_id,
      patient_name: item.patient?.patient_name ?? null,
      mobile_number: item.patient?.mobile_number ?? null,
      doctor_id: item.doctor_id,
      doctor_name: item.doctor?.doctor_name ?? null,
    }));





    return NextResponse.json({ prescriptionlist: prescriptionListData });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching prescriptions." },
      { status: 500 }
    );
  }
}
