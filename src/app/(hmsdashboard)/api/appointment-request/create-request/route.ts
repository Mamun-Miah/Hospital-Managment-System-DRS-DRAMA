/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowedOrigin = "http://127.0.0.1:5501"; // your frontend

// Helper CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// POST handler
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

    // validation
    if (!fullName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: "fullName, email, and phoneNumber are required." },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check for duplicate request
    const existing = await prisma.appointmentRequest.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
        createdAt: { gte: today, lt: tomorrow },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already sent a request today." },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Create appointment
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
        status: status || "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, appointment },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS handler (preflight)
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
