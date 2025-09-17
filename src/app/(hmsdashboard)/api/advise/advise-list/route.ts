import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const advises = await prisma.advice.findMany();
    return NextResponse.json({ message: "success", advises }, { status: 200 });
  } catch (error) {
    console.error("Error creating advise:", error);
    return NextResponse.json(
      { error: "An error occurred while get all advise ." },
      { status: 500 }
    );
  }
}
