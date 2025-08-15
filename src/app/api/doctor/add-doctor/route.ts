import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';

interface EducationalInfo {
    degree: string;
    institution: string;
    from_date: string;
    to_date: string;
}

interface AwardInfo {
    name: string;
    institution: string;
    from_date: string;
    to_date: string;
}

interface CertificationInfo {
    name: string;
    institution: string;
    from_date: string;
    to_date: string;
}



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
        educational_info,
        awards_info,
        certification_info

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

    // Format the dates correctly before saving
    const formattedEducationalInfo = educational_info.map((edu: EducationalInfo) => ({
        ...edu,
        from_date: new Date(edu.from_date),
        to_date: new Date(edu.to_date),
    }));

    const formattedAwardsInfo = awards_info.map((award: AwardInfo) => ({
        ...award,
        from_date: new Date(award.from_date),
        to_date: new Date(award.to_date),
    }));

    const formattedCertificationInfo = certification_info.map((cert: CertificationInfo) => ({
        ...cert,
        from_date: new Date(cert.from_date),
        to_date: new Date(cert.to_date),
    }));
    // const formattedCertificationInfo = (certification_info || []).map(
    //     (cert: CertificationInfo) => ({
    //         ...cert,
    //         from_date: new Date(cert.from_date),
    //         to_date: new Date(cert.to_date),
    //     })

    // );
    // console.log('Certifications to create:', formattedCertificationInfo);

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
            doctor_image,
            educationalInfo: {
                create: formattedEducationalInfo,
            },
            awards: {
                create: formattedAwardsInfo,
            },
            certifications: {
                create: formattedCertificationInfo,
            },
        },
    });
    return NextResponse.json({ success: true, doctor: newDoctor }, { status: 201 });



}