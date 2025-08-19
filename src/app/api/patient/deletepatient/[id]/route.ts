import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("delete-patient")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
    const patientId = (await params).id;
  const id = parseInt(patientId);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid patient ID' }, { status: 400 });
  }

  try {
    const deletedPatient = await prisma.patient.delete({
      where: {
        patient_id: id,
      },
    });

    return NextResponse.json(
      { message: 'Patient deleted successfully', deletedPatient },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}
