import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
){
    const treatmentId = (await params).id;
    const id = parseInt(treatmentId)

    try{
        const getSingletreatment = await prisma.treatmentlist.findUnique({
            where: {treatment_id: id}
        })

       if (!getSingletreatment) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

       return NextResponse.json(getSingletreatment, { status: 200 });

    } catch(error){
        console.error('Server error', error);
         return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
    }
    


}