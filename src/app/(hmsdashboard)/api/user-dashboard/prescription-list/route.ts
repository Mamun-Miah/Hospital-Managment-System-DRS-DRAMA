import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  //   const session = await getServerSession(authOptions);

  //   if (!session?.user.permissions?.includes("prescription-list")) {
  //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  //   }

  // Get phone number from query params
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  console.log(phone);

  if (!phone) {
    return NextResponse.json(
      { error: "Missing phone number" },
      { status: 400 }
    );
  }

  try {
    // First find patient by phone number
    const patient = await prisma.patient.findUnique({
      where: {
        mobile_number: phone,
      },
      select: {
        patient_id: true,
        patient_name: true,
        mobile_number: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Then get prescriptions by patient_id
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patient_id: patient.patient_id,
      },
      orderBy: {
        prescribed_at: "desc",
      },
      select: {
        prescription_id: true,
        prescribed_at: true,
        patient_id: true,
        next_visit_date: true,
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
      patient_name: patient.patient_name,
      mobile_number: patient.mobile_number,
      prescribed_at: p.prescribed_at.toISOString().slice(0, 10),
      doctor_name: p.doctor?.doctor_name || "",
      next_visit_date: p.next_visit_date,
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
