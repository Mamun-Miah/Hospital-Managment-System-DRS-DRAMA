import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
){
     const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("add-medicine")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
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