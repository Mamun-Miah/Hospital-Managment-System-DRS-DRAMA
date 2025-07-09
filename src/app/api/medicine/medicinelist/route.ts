import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){

    const getMedicinelist = await prisma.medicine.findMany({})
    if (!getMedicinelist) {
        return NextResponse.json({ error:' Medecine List Not Found'},{status: 400});
    }

    return NextResponse.json({ success: true, Getmedicine: getMedicinelist }, { status: 201 });
}