import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("todays-appointment")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const patientId = (await params).id;
  const id = parseInt(patientId);

  try {
    // Get patient_id & patient_name by link_id
    const patient = await prisma.patient.findUnique({
      where: { patient_id: id },
      select: {
        patient_id: true,
        patient_name: true,
        mobile_number:true,
        age: true,
        city: true,
        gender: true,
        blood_group: true,
        weight: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ message: "Patient not found" }, { status: 404 });
    }

    // Get all users (only name)
    const users = await prisma.user.findMany({
      select: { name: true },
    });

    // Get all treatments
    const treatments = await prisma.treatmentlist.findMany({
      select: {
        treatment_id: true,
        treatment_name: true,
        total_cost: true,
        duration_months: true,
        treatment_session_interval:true,
      },
    });

    // Get all doctors
    const doctors = await prisma.doctor.findMany({
      select: {
        doctor_id: true,
        doctor_name: true,
        doctor_fee: true,
      },
    });

    // Get all medicine names
    const medicines = await prisma.medicine.findMany({
      select: {
        name: true,
      },
    });

    return NextResponse.json({
      message: "Fetched Successfully",
      data: {
        patient,
        users,
        treatments,
        doctors,
        medicines,
      },
    });
  } catch (error) {
    console.error("Error fetching details:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
