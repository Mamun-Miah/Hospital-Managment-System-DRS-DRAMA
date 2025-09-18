/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phoneNumber,
      dateOfBirth,
      gender,
      date,
      address,
      treatmentName,
      notes,
      status, // optional (defaults to PENDING)
    } = body;

    //  Basic validation
    if (!fullName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: "fullName, email, and phoneNumber are required." },
        { status: 400 }
      );
    }

    //  Create appointment
    const appointment = await prisma.appointmentRequest.create({
      data: {
        fullName,
        email,
        phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        date: date ? new Date(date) : null,
        address,
        treatmentName,
        notes,
        status, // will default to PENDING if not passed
      },
    });

    return NextResponse.json(
      { success: true, appointment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
