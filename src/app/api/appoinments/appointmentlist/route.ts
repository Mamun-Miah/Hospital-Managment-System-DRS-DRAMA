import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("todays-appointment")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // start of next day

    const patients = await prisma.patient.findMany({
      orderBy: {
        created_at: "desc",
      },
      where: {
        status: "Active",
        set_next_appoinmnet: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
