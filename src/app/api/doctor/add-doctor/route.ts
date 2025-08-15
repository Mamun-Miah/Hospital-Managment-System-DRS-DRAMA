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
        designation,
        doctorFee,
        status,
        postal_code,
        short_bio,
        license_number,
        blood_group,
        gender,
        yrs_of_experience,
        date_of_birth,
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
            designation: designation,
            state_province: stateProvince,
            postal_code: postal_code || null,
            short_bio: short_bio || null,
            license_number: license_number || null,
            blood_group,
            gender,
            yrs_of_experience: parseInt(yrs_of_experience) || null,
            date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
            doctor_fee: parseInt(doctorFee),
            status,
            doctor_image
        },
    });
    return NextResponse.json({ success: true, doctor: newDoctor }, { status: 201 });



}