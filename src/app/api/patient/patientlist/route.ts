import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        created_at: 'desc', // or 'desc' for descending order
      },
      include: {
        Prescription: {
          select: {
            is_prescribed: true,
          },
        }}
    });

    return NextResponse.json(patients, { status: 200 });

  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}
