import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  if (!phone) {
    return NextResponse.json(
      { message: "Phone Number is required" },
      { status: 400 }
    );
  }

  try {
    const patient = await prisma.patient.findFirst({
      where: { mobile_number: phone },
      select: {
        patient_id: true,
        status: true,
        set_next_appoinmnet: true,
      },
    });

    if (patient) {
      const invoice = await prisma.invoice.findFirst({
        where: { patient_id: patient.patient_id },
        orderBy: {
          invoice_creation_date: "desc",
        },
        select: {
          paid_amount: true,
          due_amount: true,
        },
      });

      return NextResponse.json(
        {
          appointment: {
            date: patient?.set_next_appoinmnet,
            status: patient.status,
            treatmentName: "",
          },
          invoice,
        },
        { status: 200 }
      );
    }

    // If no patient, check requestedAppointment
    const requestedAppointment = await prisma.appointmentRequest.findMany({
      where: { phoneNumber: phone },
      select: {
        treatmentName: true,
        date: true,
        status: true,
      },
    });

    return NextResponse.json(
      { appointment: requestedAppointment[0] },
      { status: 200 }
    );
  } catch (error) {
    if (error) {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
