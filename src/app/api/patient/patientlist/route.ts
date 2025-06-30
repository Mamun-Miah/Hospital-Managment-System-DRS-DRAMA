import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        created_at: 'asc', // or 'desc' for descending order
      },
    });

    return NextResponse.json(patients, { status: 200 });

  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}
