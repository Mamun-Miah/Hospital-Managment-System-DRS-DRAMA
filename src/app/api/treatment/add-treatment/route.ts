import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
     const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("add-treatment")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
    
    try{
        const body =await request.json();
        const { treatment_name, total_cost, duration_months, treatment_session_interval } = body;
        if (!treatment_name || !total_cost || !duration_months) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        const newTreatment = await prisma.treatmentlist.create({
            data: {
                treatment_name: treatment_name,
                total_cost: parseFloat(total_cost),
                duration_months: parseInt(duration_months, 10),
                treatment_session_interval: parseInt(treatment_session_interval, 10),
                
            },
        });

        return NextResponse.json(
            { message: "Treatment added successfully", treatment: newTreatment },
            { status: 201 }
        );

    } catch(error) {
        alert(error);
        return NextResponse.json(
            { error: "An error occurred while adding the treatment." }, )
    }

}