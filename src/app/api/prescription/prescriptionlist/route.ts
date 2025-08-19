/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {

   const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("prescription-list")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    type Prescription = {
      prescription_id: number;
      prescribed_at: Date;
      is_drs_derma: boolean;
      patient_id: number;
      doctor_id: number;
    };

    const latestPrescriptions = await prisma.$queryRaw<Prescription[]>`
      SELECT p.*
      FROM Prescription p
      INNER JOIN (
        SELECT patient_id, MAX(prescribed_at) AS latest_date
        FROM Prescription
        GROUP BY patient_id
      ) latest ON p.patient_id = latest.patient_id AND p.prescribed_at = latest.latest_date
      ORDER BY p.prescription_id DESC
    `;
    

    const enrichedData = await Promise.all(
      latestPrescriptions.map(async (prescription: any) => {
        const [patient, doctor] = await Promise.all([
          prisma.patient.findUnique({
            where: { patient_id: prescription.patient_id },
            select: { patient_name: true, mobile_number: true },
          }),
          prisma.doctor.findUnique({
            where: { doctor_id: prescription.doctor_id },
            select: { doctor_name: true },
          }),
        ]);

        return {
          prescription_id: prescription.prescription_id,
          prescribed_at: prescription.prescribed_at.toISOString().slice(0, 10),
          is_prescribed: prescription.is_prescribed,
          is_drs_derma: prescription.is_drs_derma,
          patient_id: prescription.patient_id,
          patient_name: patient?.patient_name ?? "",
          mobile_number: patient?.mobile_number ?? "",
          doctor_id: prescription.doctor_id,
          doctor_name: doctor?.doctor_name ?? "",
        };
      })
    );

    return NextResponse.json({ prescriptionlist: enrichedData });
  } catch (error) {
    console.error("Error fetching latest prescriptions per patient:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching prescriptions." },
      { status: 500 }
    );
  }
}
