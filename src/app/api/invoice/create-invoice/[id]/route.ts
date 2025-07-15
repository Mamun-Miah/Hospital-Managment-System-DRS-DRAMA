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
            where: {
                patient_id: patient_id, // replace with your variable
            },
            select: {
                prescription_id: true,
                total_cost: true,
                doctor_id: true,
                doctor: {
                select: {
                    doctor_id: true,
                    doctor_name: true,
                },
                },
                items: {
                select: {
                    treatment_id: true,
                    discount_type: true,
                    discount_value:true,
                    treatment: {
                    select: {
                        treatment_id: true,
                        treatment_name: true,
                        total_cost: true,
                        duration_months: true,
                    },
                    },
                },
                },
            },
            });


        return NextResponse.json({message: 'Patitient Data Fetch Succesfully', getInvoiceData}, {status: 200})
        
    } catch(error) {
        console.error('erro', error)

    }
}