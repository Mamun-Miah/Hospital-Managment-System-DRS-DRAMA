import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("add-patient")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const patient_id = (await params).id;
  const id = parseInt(patient_id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
  }

  try {
    const data = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      patient_name: data.patient_name,
      mobile_number: data.mobile_number,
      email: data.email,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
      address_line1: data.address_line1,
      city: data.city,
      state_province: data.state_province,
      postal_code: data.postal_code,
      set_next_appoinmnet: data.set_next_appoinmnet ? new Date(data.set_next_appoinmnet) : new Date(),
      age: data.age,
      blood_group: data.blood_group,
      marital_status: data.marital_status? data.marital_status : null,
      note: data.note,
      weight: data.weight !== undefined && data.weight !== null ? Number(data.weight).toFixed(2) : undefined,
      emergency_contact_phone: data.emergency_contact_phone,
      gender: data.gender,
      image_url: data.image_url,
      status: data.status,
      updated_at: new Date(),
    };

    // Clean undefined keys
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const result = await prisma.$transaction(async (tx) => {
      // Update patient data
      const updatedPatient = await tx.patient.update({
        where: { patient_id: id },
        data: updateData,
      });

      // Handle weight history only if weight is provided
      if (data.weight !== undefined && data.weight !== null) {
        // Check if weight history exists for today
        const existingWeightHistory = await tx.patientWeightHistory.findFirst({
          where: {
            patient_id: id,
            recorded_at: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        });

        if (existingWeightHistory) {
          // Update existing weight history
          await tx.patientWeightHistory.update({
            where: { id: existingWeightHistory.id },
            data: {
              weight: new Prisma.Decimal(Number(data.weight).toFixed(2)),
            },
          });
        } else {
          // Create new weight history
          await tx.patientWeightHistory.create({
            data: {
              patient_id: id,
              weight: new Prisma.Decimal(Number(data.weight).toFixed(2)),
            },
          });
        }
      }

      return updatedPatient;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating patient:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
