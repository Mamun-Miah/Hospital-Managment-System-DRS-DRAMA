import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("prescription-list")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const id = (await params).id;
  const patient_id = parseInt(id);

  if (isNaN(patient_id)) {
    return NextResponse.json(
      { error: "Invalid patient_id parameter" },
      { status: 400 }
    );
  }

  try {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patient_id: patient_id,
        
      },
      orderBy: {
        prescribed_at: "desc",
      },
      select: {
        prescription_id: true,
        prescribed_at: true,
        patient_id: true,
        patient: {
          select: {
            patient_name: true,
            mobile_number: true,
          },
        },
        doctor: {
          select: {
            doctor_name: true,
          },
        },
      },
    });

    const formatted = prescriptions.map((p) => ({
      prescription_id: p.prescription_id,
      patient_id: p.patient_id,
      patient_name: p.patient?.patient_name || "",
      mobile_number: p.patient?.mobile_number || "",
      prescribed_at: p.prescribed_at.toISOString().slice(0, 10),
      doctor_name: p.doctor?.doctor_name || "",
    }));

    return NextResponse.json({ prescriptions: formatted }, { status: 200 });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "Error fetching prescriptions" },
      { status: 500 }
    );
  }
}
