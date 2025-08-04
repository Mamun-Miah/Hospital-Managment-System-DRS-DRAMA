import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const inputDateParam = searchParams.get('date');

    // Format input date
    let inputDate: string;
    if (inputDateParam) {
      if (isNaN(Date.parse(inputDateParam))) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
      }
      inputDate = inputDateParam;
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      inputDate = tomorrow.toISOString().split('T')[0];
    }

    const prescriptions = await prisma.$queryRaw<
      {
        prescription_id: number;
        patient_id: number;
        patient_name: string;
        patient_mobile_number: string | null;
        patient_email: string | null;
        prescribed_doctor_name: string;
        prescribed_at: Date;
        next_visit_date: Date | null;
      }[]
    >`
      SELECT 
        p.prescription_id,
        p.patient_id,
        pat.patient_name,
        pat.mobile_number AS patient_mobile_number,
        pat.email AS patient_email,
        p.prescribed_doctor_name,
        p.prescribed_at,
        p.next_visit_date
      FROM Prescription p
      JOIN Patient pat ON p.patient_id = pat.patient_id
      WHERE DATE(p.prescribed_at) = ${inputDate}
    `;

    return NextResponse.json({ date: inputDate, prescriptions });
  } catch (error) {
    console.error('Error fetching prescriptions by date:', error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}
