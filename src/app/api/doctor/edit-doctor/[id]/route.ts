import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },){

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
        doctor_fee: data.doctorFee
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