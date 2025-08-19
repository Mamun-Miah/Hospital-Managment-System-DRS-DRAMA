import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(){

    const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("list-medicine")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

    const getMedicinelist = await prisma.medicine.findMany({})
    if (!getMedicinelist) {
        return NextResponse.json({ error:' Medecine List Not Found'},{status: 400});
    }

    return NextResponse.json({ success: true, Getmedicine: getMedicinelist }, { status: 201 });
}