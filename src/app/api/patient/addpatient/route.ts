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
    stateProvince,
    postalCode,
    emergencyContactNumber,
    gender,
    status,
    image_url
  } = await req.json();

  if (!patientName || !mobileNumber || !status) {
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
      emergency_contact_phone: emergencyContactNumber,
      gender,
      image_url: image_url || null,
      status,
    },
  });

  return NextResponse.json({ success: true, patient: newPatient }, { status: 201 });
}
