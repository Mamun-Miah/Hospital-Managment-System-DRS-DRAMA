import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE( request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) 

{

    const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("add-treatment")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
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