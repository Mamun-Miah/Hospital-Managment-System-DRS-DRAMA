import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const inputDateParam = searchParams.get('date');

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

    // Fetch prescriptions by prescribed_at
    const prescriptions = await prisma.$queryRaw<
      {
        prescription_id: number;
        patient_id: number;
        patient_name: string;
        patient_mobile_number: string | null;
        patient_email: string | null;
        next_visit_date: string;
        prescribed_doctor_name: string;
        prescribed_at: Date;
      }[]
    >`
      SELECT 
        p.prescription_id,
        p.patient_id,
        p.next_visit_date,
        pat.patient_name,
        pat.mobile_number AS patient_mobile_number,
        pat.email AS patient_email,
        p.prescribed_doctor_name,
        p.prescribed_at
      FROM Prescription p
      JOIN Patient pat ON p.patient_id = pat.patient_id
      WHERE DATE(p.next_visit_date) = ${inputDate}
    `;

    // Fetch patients with a next appointment on inputDate
    const nextAppointments = await prisma.$queryRaw<
      {
        patient_id: number;
        patient_name: string;
        patient_mobile_number: string | null;
        patient_email: string | null;
        set_next_appoinmnet: Date | null;
      }[]
    >`
      SELECT 
        patient_id,
        patient_name,
        mobile_number AS patient_mobile_number,
        email AS patient_email,
        set_next_appoinmnet
      FROM Patient
      WHERE DATE(set_next_appoinmnet) = ${inputDate}
    `;

    return NextResponse.json({
      date: inputDate,
      prescriptions,
      nextAppointments,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
