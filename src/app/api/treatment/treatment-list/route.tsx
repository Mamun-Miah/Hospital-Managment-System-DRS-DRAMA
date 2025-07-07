import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const treatmentsList = await prisma.treatmentlist.findMany({})

        return NextResponse.json(
            { treatments: treatmentsList }, 
        )
    } catch(error) {
        console.error("Error fetching treatments:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching treatments." }, 
            { status: 500 }
        );
    }
}