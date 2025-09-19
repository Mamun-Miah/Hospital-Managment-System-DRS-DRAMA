import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  //   const session = await getServerSession(authOptions);

  //   if (!session?.user.permissions?.includes("delete-request")) {
  //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  //   }
  const patientId = (await params).id;
  const id = parseInt(patientId);
  console.log(id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
  }

  try {
    const deletedPatient = await prisma.appointmentRequest.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Patient deleted successfully",
        deletedPatient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}
