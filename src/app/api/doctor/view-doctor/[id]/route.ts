import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET( request: NextRequest,
  { params }: { params: Promise<{ id: string }> },) {

    const doctorId = (await params).id;
    const id = parseInt(doctorId);

    try{
        const doctorview = await prisma.doctor.findUnique({
            where: { doctor_id: id },}
        )

        if (!doctorview) {
            return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
        }
        return NextResponse.json(doctorview, { status: 200 });
    } catch (error) {
        alert("Error fetching doctor details: " + error);
        return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
}