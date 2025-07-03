import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
     const {
    doctorName,
    phone_number,
    emailAddress,
    specialization,
    address,
    city,
    stateProvince,
    status,
    postal_code,
    doctor_image,
  } = await req.json();

  if (!doctorName || !phone_number || !status) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }


    const existing = await prisma.doctor.findFirst({
        where: { phone_number: phone_number }, // field name must match Prisma schema
    });

    if (existing) {
        return NextResponse.json(
            { error: 'Doctor with this phone number already exists' },  
        )
    }

    const newDoctor = await prisma.doctor.create({
        data: {
            doctor_name: doctorName,
            phone_number: phone_number,
            email: emailAddress,
            specialization,
            address_line1: address,
            city,
            state_province: stateProvince,
            postal_code: postal_code || null,
            status,
            doctor_image // Optional field, can be null
        },
    }); 
    return NextResponse.json({ success: true, doctor: newDoctor }, { status: 201 });


    
}