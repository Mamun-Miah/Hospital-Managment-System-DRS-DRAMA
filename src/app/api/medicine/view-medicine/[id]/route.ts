import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
){
    const medicineId = (await params).id;
    const id = parseInt(medicineId);

    try {
        const viewMedicine = await prisma.medicine.findUnique({
            where: {medicine_id: id}
        })

        if(!viewMedicine){
            return NextResponse.json({message: 'Medicince Not Found'}, {status: 400});
        }

        return NextResponse.json({mesage:'Show Medicine Successfully', viewMedicine}, {status: 200})


    } catch(error){
        console.error('Server error', error);
        return NextResponse.json({error: 'server Error'}, {status: 500})
    }
}