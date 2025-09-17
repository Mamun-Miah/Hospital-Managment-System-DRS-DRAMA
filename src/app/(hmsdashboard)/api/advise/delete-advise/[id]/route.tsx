// app/api/advise/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE: Delete an advise by ID from URL path parameter
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Destructuring params from the second argument

  if (!id) {
    return NextResponse.json(
      { error: "Advise ID is required" },
      { status: 400 }
    );
  }

  try {
    // Convert the 'id' from string to integer
    const deletedAdvise = await prisma.advice.delete({
      where: { id: parseInt(id) }, // Ensure id is an integer
    });

    return NextResponse.json({
      message: "Advise deleted successfully",
      deletedAdvise,
    });
  } catch (error) {
    console.error("Error deleting advise:", error);
    return NextResponse.json(
      { error: "Failed to delete advise" },
      { status: 500 }
    );
  }
}
