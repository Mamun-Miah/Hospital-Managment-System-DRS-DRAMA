import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("list-patient")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
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
