import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

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
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existing = await prisma.patient.findUnique({
    where: { mobile_number: mobileNumber }, // field name must match Prisma schema
  });

  if (existing) {
    return NextResponse.json(
      { error: 'Patient with this mobile number already exists' },
      { status: 409 }
    );
  }

  const newPatient = await prisma.patient.create({
    data: {
      patient_name: patientName,
      mobile_number: mobileNumber,
      email: emailAddress,
      date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
      address_line1: address,
      city,
      state_province: stateProvince,
      postal_code: postalCode,
      set_next_appoinmnet:setNextAppoinmnets ?  new Date(setNextAppoinmnets) : null,
      age: age,
      blood_group: blood_group,
      marital_status: marital_status,
      note: note,
      weight: weight,
      emergency_contact_phone: emergencyContactNumber,
      gender,
      image_url: image_url || null,
      status: status || "Active",
    },
  });

  return NextResponse.json({ success: true, patient: newPatient }, { status: 201 });
}
