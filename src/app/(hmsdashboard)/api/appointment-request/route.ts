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
      status,
    } = body;

    //validation
    if (!fullName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: "fullName, email, and phoneNumber are required." },
        { status: 400 }
      );
    }

    // Get today's date (YYYY-MM-DD)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    //Check if same email or phone already requested today
    const existing = await prisma.appointmentRequest.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already sent a request today." },
        { status: 400 }
      );
    }

    // Create new appointment request
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
        status, // defaults to PENDING if not passed
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
