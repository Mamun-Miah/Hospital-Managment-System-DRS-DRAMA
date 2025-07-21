import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    
   

    try{
            const getIsPrescribed = await prisma.prescription.findMany({
                   select: {
                    patient_id: true,
                    is_prescribed:true,
                   }
    })

    return NextResponse.json({Message: 'Is Prescribed Fetched Successfully',getIsPrescribed},{status: 200})

    } catch(error){
        console.error('Something Went Wrong', error)
    }
    

}