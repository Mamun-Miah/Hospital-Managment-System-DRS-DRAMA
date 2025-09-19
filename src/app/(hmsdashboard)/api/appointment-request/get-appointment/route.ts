import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const appointments = await prisma.appointmentRequest.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json({ success: true, appointments }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
