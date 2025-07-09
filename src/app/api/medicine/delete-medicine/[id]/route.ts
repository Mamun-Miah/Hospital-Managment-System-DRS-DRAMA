import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
){
    const medicineId = (await params).id;
    const id = parseInt(medicineId);


    try{
            const deleteMedicine = await prisma.medicine.delete({
                    where: {medicine_id: id}
                })
                if (!deleteMedicine){
                    return NextResponse.json({ message: "Medicine not found"}, {status: 400});
            }
                return NextResponse.json({message: 'Medicine Deleted Successfully'}, {status: 200});
    } catch(error) {
        console.error('Server error Occured', error);
        return NextResponse.json({message: 'Server error'}, {status: 500})
    }
    

}