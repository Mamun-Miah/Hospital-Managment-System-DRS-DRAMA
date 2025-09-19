/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Allowed origins from env
const allowedOrigin = [
  process.env.NEXT_CORS_URL || "",
  process.env.WP_BASE_URL || "",
].filter(Boolean); // remove empty strings

// Helper: CORS headers based on request origin
function corsHeaders(reqOrigin: string | null) {
  const origin = reqOrigin && allowedOrigin.includes(reqOrigin) ? reqOrigin : "";
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// POST handler
export async function POST(req: Request) {
  try {
    const reqOrigin = req.headers.get("origin");
    const headers = corsHeaders(reqOrigin);

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

    // Validation
    if (!fullName || !email || !phoneNumber || !date) {
      return NextResponse.json(
        { error: "fullName, email, and phoneNumber are required." },
        { status: 400, headers }
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
        { status: 400, headers }
      );
    }

    // Create appointment
    const appointment = await prisma.appointmentRequest.create({
      data: {
        fullName,
        email,
        phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        date: date ? new Date(date) : null,
        address,
        treatmentName,
        notes,
        status: status || "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, appointment },
      { status: 201, headers }
    );
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    const reqOrigin = req.headers.get("origin");
    const headers = corsHeaders(reqOrigin);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers }
    );
  }
}

// OPTIONS handler (preflight)
export function OPTIONS(req: Request) {
  const reqOrigin = req.headers.get("origin");
  const headers = corsHeaders(reqOrigin);
  return new NextResponse(null, { status: 204, headers });
}
