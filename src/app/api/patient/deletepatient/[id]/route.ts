import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
