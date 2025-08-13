import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


export async function POST(req: Request) {
  const {
    patientName,
    mobileNumber,
    emailAddress,
    dateOfBirth,
    address,
    city,
    age,
    blood_group,
    weight,
    stateProvince,
    postalCode,
    setNextAppoinmnets,
    emergencyContactNumber,
    gender,
    status,
    note,
    marital_status,
    image_url
  } = await req.json();

  if (!patientName || !mobileNumber) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.patient.findUnique({
    where: { mobile_number: mobileNumber },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Patient with this mobile number already exists" },
      { status: 409 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1️ Create patient
    const newPatient = await tx.patient.create({
      data: {
        patient_name: patientName,
        mobile_number: mobileNumber,
        email: emailAddress,
        date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
        address_line1: address,
        city,
        state_province: stateProvince,
        postal_code: postalCode,
        set_next_appoinmnet: setNextAppoinmnets
          ? new Date(setNextAppoinmnets)
          : new Date(),
        age,
        blood_group,
        marital_status,
        note,
        weight: weight || null, // latest weight
        emergency_contact_phone: emergencyContactNumber,
        gender,
        image_url: image_url || null,
        status: status || "Active",
      },
    });

    // 2️ If weight provided, insert into weight history
    if (weight) {
      await tx.patientWeightHistory.create({
        data: {
          patient_id: newPatient.patient_id,
          weight: new Prisma.Decimal(Number(weight).toFixed(2)), // store as string
        },
      });
    }

    return newPatient;
  });

  return NextResponse.json({ success: true, patient: result }, { status: 201 });
}
