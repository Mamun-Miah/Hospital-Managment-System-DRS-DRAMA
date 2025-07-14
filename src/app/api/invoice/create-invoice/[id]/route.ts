import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
){

   const id = (await params).id;
   const patient_id = parseInt(id)
//    console.log(patient_id)


    try{

        const getInvoiceData = await prisma.prescription.findMany({
            where: {patient_id: patient_id}
        })

        return NextResponse.json({message: 'Patitient Data Fetch Succesfully', getInvoiceData}, {status: 200})
        
    } catch(error) {
        console.error('erro', error)

    }
}