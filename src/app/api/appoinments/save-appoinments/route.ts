/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // make sure this is correctly set
import { DiscountType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      patient_id,
      doctor_name,
      treatment_name,
      treatmentAmount,
      discountType,
      discountAmount,
      medicines,
      advise,
    } = body;

    // 1. Get doctor_id
    const doctor = await prisma.doctor.findFirst({
      where: { doctor_name },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // 2. Get medicine_ids
    const medicineNames = medicines.map((m: any) => m.name);
    

    const medicineRecords = await prisma.medicine.findMany({
      where: { name: { in: medicineNames } },
    });
    const medicineMap = new Map(medicineRecords.map((m) => [m.name, m.medicine_id]));
console.log(medicineMap)
    // 3. Calculate total cost (simplified)
    const doctor_fee = Number(doctor.doctor_fee) ?? 0;
    const discount = parseFloat(discountAmount) || 0;
    const treatment_cost = parseFloat(treatmentAmount) || 0;
    const total_cost = discountType.toLowerCase().includes('percent')
      ? doctor_fee + treatment_cost - (treatment_cost * discount) / 100
      : doctor_fee + treatment_cost - discount;

    // 4. Create Prescription and related PrescriptionItems
    const prescription = await prisma.prescription.create({
      data: {
        patient_id,
        doctor_id: doctor.doctor_id,
        total_cost: Math.max(0, Math.floor(total_cost)), // Round down, prevent negative
        prescribed_at: new Date(),
        items: {
          create: medicines.map((med: any) => ({
            medicine_id: medicineMap.get(med.name),
            dose_morning: med.dosages.find((d: any) => d.time === 'Morning')?.amount.toString() ?? '0',
            dose_mid_day: med.dosages.find((d: any) => d.time === 'Mid Day')?.amount.toString() ?? '0',
            dose_night: med.dosages.find((d: any) => d.time === 'Night')?.amount.toString() ?? '0',
            duration_days: med.duration,
            treatment_name,
            discount_type: parseDiscountType(discountType),
            discount_value: parseFloat(discountAmount),
            advice: advise || null,
          })),
        },
      },
    });

    return NextResponse.json({ message: 'Prescription created', prescription }, { status: 201 });

  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json({ error: 'Remove Empty Field. Internal server error' }, { status: 500 });
  }
}

// Utility: Convert string to DiscountType enum
function parseDiscountType(type: string): DiscountType | null {
  const normalized = type?.toLowerCase().trim();
  if (normalized === 'flat rate' || normalized === 'flat') return 'Flat';
  if (normalized === 'percentage') return 'Percentage';
  if (normalized === 'no discount') return 'None';
  return null;
}
