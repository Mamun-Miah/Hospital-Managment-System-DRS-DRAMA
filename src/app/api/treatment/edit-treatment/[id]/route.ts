import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
    const treatmentId = (await params).id;
    const id = parseInt(treatmentId);

    try{    
        const editedTreatment = await request.json();
        const updatedTreatment = await prisma.treatmentlist.update({
            where: {
                treatment_id: id,
            },
            data: {
                treatment_name: editedTreatment.treatment_name,
                total_cost: parseFloat(editedTreatment.total_cost),
                duration_months: parseInt(editedTreatment.duration_months, 10),
                treatment_session_interval: parseInt(editedTreatment.treatment_session_interval, 10),
            },
        });


        return NextResponse.json({
            message: "Treatment updated successfully",  
            updatedTreatment,   
        }, { status: 200 });
    } catch(error) {
        console.error("Error updating treatment:", error);
        return NextResponse.json(
            { error: "Failed to update treatment" },
            { status: 500 }
        );
    }

}