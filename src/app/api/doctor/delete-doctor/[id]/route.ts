import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },) {

    const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("add-doctor")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

     const doctorId = (await params).id;
    const id = parseInt(doctorId);

    try {
        // Delete the doctor by ID
        const deletedDoctor = await prisma.doctor.delete({
            where: { doctor_id: id },
        });

        // Return a success response
        return NextResponse.json({ message: "Doctor deleted successfully", deletedDoctor }, { status: 200 });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        // Return an error response
        return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });
    }
}