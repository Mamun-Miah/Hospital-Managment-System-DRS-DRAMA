import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest,
  { params }: { params: Promise<{ id: string }> },) {

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