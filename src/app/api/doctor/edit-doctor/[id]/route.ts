import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

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

export async function PATCH(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },) {

  const doctorId = (await params).id;
  const id = parseInt(doctorId);

  try {
    const data = await request.json();

    // Update the doctor by ID
    const updatedDoctor = await prisma.doctor.update({
      where: { doctor_id: id },
      data: {
        // doctor_image: data.doctor_image,
        doctor_name: data.doctorName,
        specialization: data.specialization,
        email: data.emailAddress,
        phone_number: data.phone_number,
        address_line1: data.address,
        city: data.city,
        state_province: data.stateProvince,
        postal_code: data.postal_code,
        status: data.status,
        doctor_fee: data.doctorFee,
        short_bio: data.short_bio,
        license_number: data.license_number,
        date_of_birth: data.date_of_birth,
        blood_group: data.blood_group,
        gender: data.gender,
        yrs_of_experience: data.yrs_of_experience,
        educationalInfo: {
          create: (data.educationalInfo || []).map((edu: EducationalInfo) => ({
            degree: edu.degree,
            institution: edu.institution,
            from_date: new Date(edu.from_date),
            to_date: new Date(edu.to_date),
          })),
        },
        awards: {
          create: (data.awards || []).map((award: AwardInfo) => ({
            name: award.name,
            institution: award.institution,
            from_date: new Date(award.from_date),
            to_date: new Date(award.to_date),
          })),
        },
        certifications: {
          create: (data.certifications || []).map((cert: CertificationInfo) => ({
            name: cert.name,
            institution: cert.institution,
            from_date: new Date(cert.from_date),
            to_date: new Date(cert.to_date),
          })),
        },
      },
    });

    // Return a success response
    return NextResponse.json({ message: "Doctor updated successfully", updatedDoctor }, { status: 200 });
  } catch (error) {
    console.error("Error updating doctor:", error);
    // Return an error response
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }


}