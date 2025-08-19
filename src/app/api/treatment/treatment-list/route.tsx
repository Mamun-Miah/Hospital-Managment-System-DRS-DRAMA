import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("list-treatment")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

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