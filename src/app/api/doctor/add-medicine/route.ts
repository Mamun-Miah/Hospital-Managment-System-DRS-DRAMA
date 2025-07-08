import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest ){
    const response = await req.json()

    if(!response){
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const addMedicine = await prisma.medicine.create({
        data: {
            name: response.medicineName,
            quantity: parseInt(response.quantity, 10)
        },
    })

      return NextResponse.json({ success: true, medicine: addMedicine }, { status: 201 });


}