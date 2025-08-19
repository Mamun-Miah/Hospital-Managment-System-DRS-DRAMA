import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {

     const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("add-medicine")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

    const medicineId = (await params).id;
    const id = parseInt(medicineId);

    const data = await request.json()

    try {
        const medicineEdit = await prisma.medicine.update({
            where: { medicine_id: id },
            data: {
                name: data.medicineName,
                // quantity: parseInt(data.quantity),
                brand_name: data.brandName,

            }
        })

        if (!medicineEdit) {
            return NextResponse.json({ message: 'Medicine Not Found' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Medicine added Successfully' }, { status: 201 })

    } catch (error) {
        console.error('Server Error', error);
        return NextResponse.json({ error: 'Failed to update Medicine' }, { status: 500 })
    }


}