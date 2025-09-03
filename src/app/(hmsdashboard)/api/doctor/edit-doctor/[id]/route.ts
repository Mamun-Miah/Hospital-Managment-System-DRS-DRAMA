import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface EducationalInfo {
  id?: number;
  name: string;
  institution: string;
  from_date?: string;
  to_date?: string;
}

interface AwardInfo {
  id?: number;
  name: string;
  institution: string;
  from_date?: string;
  to_date?: string;
}

interface CertificationInfo {
  id?: number;
  name: string;
  institution: string;
  from_date?: string;
  to_date?: string;
}

const parseDate = (v?: string | null) => (v && v.trim() ? new Date(v) : null);

const isNonEmptyEdu = (e: EducationalInfo) =>
  !!(e && (e.name?.trim() || e.institution?.trim()));

const isNonEmptyAward = (a: AwardInfo) =>
  !!(a && (a.name?.trim() || a.institution?.trim()));

const isNonEmptyCert = (c: CertificationInfo) =>
  !!(c && (c.name?.trim() || c.institution?.trim()));

export async function PATCH(
  request: NextRequest,
  // The 'params' object is  a Promise, 
  { params }: { params: Promise<{ id: string }> }
) {


  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("add-doctor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  //  Await the params promise to get the resolved object.
  const resolvedParams = await params;
  //  Now you can safely access the 'id' property.
  const doctorId = Number(resolvedParams.id);

  if (!Number.isFinite(doctorId)) {
    return NextResponse.json({ error: "Invalid doctor id" }, { status: 400 });
  }

  try {
    const data = await request.json();
    // console.log(data);
    const incomingEdu: EducationalInfo[] = Array.isArray(data.educationalInfo)
      ? data.educationalInfo
      : Array.isArray(data.educations)
        ? data.educations
        : [];

    const incomingAwards: AwardInfo[] = Array.isArray(data.awardsInfo)
      ? data.awardsInfo
      : Array.isArray(data.awards)
        ? data.awards
        : [];

    const incomingCerts: CertificationInfo[] = Array.isArray(
      data.certificationInfo
    )
      ? data.certificationInfo
      : Array.isArray(data.certifications)
        ? data.certifications
        : [];

    const eduClean = incomingEdu.filter(isNonEmptyEdu);
    const awardsClean = incomingAwards.filter(isNonEmptyAward);
    const certsClean = incomingCerts.filter(isNonEmptyCert);

    const updated = await prisma.$transaction(async (tx) => {
      // Update main doctor fields
      await tx.doctor.update({
        where: { doctor_id: doctorId },
        data: {
          doctor_name: data.doctorName,
          specialization: data.specialization,
          email: data.emailAddress,
          phone_number: data.phone_number,
          address_line1: data.address,
          city: data.city,
          state_province: data.stateProvince,
          designation: data.designation,
          postal_code: data.postal_code,
          status: data.status,
          doctor_fee: data.doctorFee ? Number(data.doctorFee) : null,
          short_bio: data.short_bio,
          license_number: data.license_number,
          date_of_birth: data.date_of_birth
            ? new Date(`${data.date_of_birth}T00:00:00.000Z`)
            : null,
          blood_group: data.blood_group,
          gender: data.gender,
          yrs_of_experience: data.yrs_of_experience
            ? parseInt(String(data.yrs_of_experience), 10)
            : null,
          ...(data.doctor_image ? { doctor_image: data.doctor_image } : {}),
        },
      });

      //  EDUCATION
      const existingEdu = await tx.doctorEducationalInfo.findMany({
        where: { doctor_id: doctorId },
        select: { id: true },
      });
      const existingEduIds = new Set(existingEdu.map((e) => e.id));
      const incomingEduIds = new Set(
        eduClean.filter((e) => e.id).map((e) => e.id!)
      );
      const toDeleteEdu = [...existingEduIds].filter(
        (id) => !incomingEduIds.has(id)
      );

      if (toDeleteEdu.length) {
        await tx.doctorEducationalInfo.deleteMany({
          where: { doctor_id: doctorId, id: { in: toDeleteEdu } },
        });
      }

      for (const e of eduClean) {
        const payload = {
          name: e.name!.trim(),
          institution: e.institution!.trim(),
          from_date: parseDate(e.from_date),
          to_date: parseDate(e.to_date),
        };

        if (e.id) {
          await tx.doctorEducationalInfo.update({
            where: { id: e.id },
            data: payload,
          });
        } else if (payload.name || payload.institution) {
          await tx.doctorEducationalInfo.create({
            data: { ...payload, doctor_id: doctorId },
          });
        }
      }

      //AWARDS
      const existingAwards = await tx.doctorAwardsAndRecognitionInfo.findMany({
        where: { doctor_id: doctorId },
        select: { id: true },
      });
      const existingAwardIds = new Set(existingAwards.map((a) => a.id));
      const incomingAwardIds = new Set(
        awardsClean.filter((a) => a.id).map((a) => a.id!)
      );
      const toDeleteAwards = [...existingAwardIds].filter(
        (id) => !incomingAwardIds.has(id)
      );

      if (toDeleteAwards.length) {
        await tx.doctorAwardsAndRecognitionInfo.deleteMany({
          where: { doctor_id: doctorId, id: { in: toDeleteAwards } },
        });
      }

      for (const a of awardsClean) {
        const payload = {
          name: a.name!.trim(),
          institution: a.institution!.trim(),
          from_date: parseDate(a.from_date),
          to_date: parseDate(a.to_date),
        };

        if (a.id) {
          await tx.doctorAwardsAndRecognitionInfo.update({
            where: { id: a.id },
            data: payload,
          });
        } else if (payload.name || payload.institution) {
          await tx.doctorAwardsAndRecognitionInfo.create({
            data: { ...payload, doctor_id: doctorId },
          });
        }
      }

      // CERTIFICATIONS
      const existingCerts = await tx.doctorCertificationInfo.findMany({
        where: { doctor_id: doctorId },
        select: { id: true },
      });
      const existingCertIds = new Set(existingCerts.map((c) => c.id));
      const incomingCertIds = new Set(
        certsClean.filter((c) => c.id).map((c) => c.id!)
      );
      const toDeleteCerts = [...existingCertIds].filter(
        (id) => !incomingCertIds.has(id)
      );

      if (toDeleteCerts.length) {
        await tx.doctorCertificationInfo.deleteMany({
          where: { doctor_id: doctorId, id: { in: toDeleteCerts } },
        });
      }

      for (const c of certsClean) {
        const payload = {
          name: c.name!.trim(),
          institution: c.institution!.trim(),
          from_date: parseDate(c.from_date),
          to_date: parseDate(c.to_date),
        };

        if (c.id) {
          await tx.doctorCertificationInfo.update({
            where: { id: c.id },
            data: payload,
          });
        } else if (payload.name || payload.institution) {
          await tx.doctorCertificationInfo.create({
            data: { ...payload, doctor_id: doctorId },
          });
        }
      }

      // Return updated doctor with relations
      return tx.doctor.findUnique({
        where: { doctor_id: doctorId },
        include: {
          educationalInfo: true,
          awards: true,
          certifications: true,
        },
      });
    });

    return NextResponse.json(
      { message: "Doctor updated successfully", updatedDoctor: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating doctor:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to update doctor" },
      { status: 500 }
    );
  }
}