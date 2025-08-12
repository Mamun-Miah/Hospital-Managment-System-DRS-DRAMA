import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const patient_id = (await params).id;
  const id = parseInt(patient_id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
  }

  try {
    const data = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      patient_name: data.patientName,
      mobile_number: data.mobileNumber,
      email: data.emailAddress,
      date_of_birth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      address_line1: data.address,
      city: data.city,
      state_province: data.stateProvince,
      postal_code: data.postalCode,
      set_next_appoinmnet: data.setNextAppoinmnets ? new Date(data.setNextAppoinmnets) : undefined,
      age: data.age,
      blood_group: data.blood_group,
      marital_status: data.marital_status,
      note: data.note,
      weight: data.weight !== undefined && data.weight !== null ? Number(data.weight).toFixed(2) : undefined,
      emergency_contact_phone: data.emergencyContactNumber,
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
