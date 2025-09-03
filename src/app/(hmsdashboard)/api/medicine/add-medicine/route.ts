import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("add-medicine")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

    const response = await req.json()

    if (!response) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const addMedicine = await prisma.medicine.create({
        data: {
            name: response.medicineName,
            // quantity: parseInt(response.quantity, 10)
            brand_name: response.brandName,
        },
    })

    return NextResponse.json({ success: true, medicine: addMedicine }, { status: 201 });


}