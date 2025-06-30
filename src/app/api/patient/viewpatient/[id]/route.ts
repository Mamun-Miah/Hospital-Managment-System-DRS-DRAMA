import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";


export async function GET(req:NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const patientId = (await params).id;
  const id = parseInt(patientId);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid patient ID' }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_id: id },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
  }

}