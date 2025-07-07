import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE( request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) 

{
    const treatmentId = (await params).id;
    const id = parseInt(treatmentId);

    try {
        // Delete all treatments
        const deletedTreatments = await prisma.treatmentlist.delete({
            where: {
                treatment_id: id,
            },
        });

        // Return success response
        return NextResponse.json({
            message: "Treatment deleted successfully",
            deletedTreatments,
        }, { status: 200});

    } catch(error) {
        console.error("Error deleting treatments:", error);
        return NextResponse.json(
            { error: "Failed to delete treatments" },
            { status: 500 }
        );
    }
}