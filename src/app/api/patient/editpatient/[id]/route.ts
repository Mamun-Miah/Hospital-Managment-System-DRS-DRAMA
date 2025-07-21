import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
 const patient_id = (await params).id;

  const id = parseInt(patient_id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid patient ID' }, { status: 400 });
  }

  try {
    const data = await req.json();

    // Only allow fields that match your Prisma schema
    const allowedFields = {
      patient_name: data.patient_name,
      mobile_number: data.mobile_number,
      email: data.email,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
      gender: data.gender,
      address_line1: data.address_line1,
       age:data.age,
      blood_group:data.blood_group,
      weight:data.weight,
      city: data.city,
      state_province: data.state_province,
      postal_code: data.postal_code,
      emergency_contact_phone: data.emergency_contact_phone,
      status: data.status,
    };

    const updatedPatient = await prisma.patient.update({
      where: { patient_id: id },
      data: {
        ...allowedFields,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}
