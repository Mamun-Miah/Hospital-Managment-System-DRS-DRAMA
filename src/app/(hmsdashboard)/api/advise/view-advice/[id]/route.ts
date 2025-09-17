import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Destructuring params from the second argument
  // console.log(id);
  if (!id) {
    return NextResponse.json(
      { error: "Advise ID is required" },
      { status: 400 }
    );
  }

  try {
    // Find the advise by its 'id'
    const advise = await prisma.advice.findUnique({
      where: { id: parseInt(id) }, // Ensure 'id' is parsed to an integer
    });

    if (!advise) {
      return NextResponse.json({ error: "Advise not found" }, { status: 404 });
    }

    return NextResponse.json(advise);
  } catch (error) {
    console.error("Error creating advise:", error);
    return NextResponse.json(
      { error: "An error occurred while get all advise ." },
      { status: 500 }
    );
  }
}
