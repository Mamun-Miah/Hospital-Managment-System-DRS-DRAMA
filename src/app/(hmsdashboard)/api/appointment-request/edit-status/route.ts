import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    // Validate input
    if (!id || !status) {
      return NextResponse.json(
        { message: "id and status are required" },
        { status: 400 }
      );
    }

    // Find the appointment
    const appointment = await prisma.appointmentRequest.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Handle CONFIRMED -> Move to patient + delete appointment
    if (status === "CONFIRMED") {
      // Check if patient with same phone exists
      const existingPatient = await prisma.patient.findUnique({
        where: { mobile_number: appointment.phoneNumber },
      });

      let patient;

      if (existingPatient) {
        // Update existing patient
        patient = await prisma.patient.update({
          where: { patient_id: existingPatient.patient_id },
          data: {
            treatment_name: appointment.treatmentName || "",
            status: "Active",
            set_next_appoinmnet: appointment.date || null,
          },
        });
      } else {
        // Create new patient
        patient = await prisma.patient.create({
          data: {
            patient_name: appointment.fullName,
            email: appointment.email,
            treatment_name: appointment.treatmentName || "",
            mobile_number: appointment.phoneNumber,
            date_of_birth: appointment.dateOfBirth || null,
            set_next_appoinmnet: appointment.date || null,
            gender: appointment.gender,
            address_line1: appointment.address || "",
            note: appointment.notes || "",
            status: "Active",
          },
        });
      }

      // Delete appointment request
      await prisma.appointmentRequest.delete({
        where: { id },
      });

      return NextResponse.json(
        { message: "Appointment moved to Patient", patient },
        { status: 200 }
      );
    }

    // Handle REJECTED or PENDING -> Update appointment status
    if (status === "REJECTED" || status === "PENDING") {
      const updatedAppointment = await prisma.appointmentRequest.update({
        where: { id },
        data: { status },
      });

      return NextResponse.json(
        {
          message: `Appointment marked as ${status}`,
          appointment: updatedAppointment,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid status value" },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
