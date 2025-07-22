/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      patient_id,
      doctor_name,
      payableDoctorFee,
      doctorDiscountType,
      doctorDiscountAmount,
      advise,
      is_drs_derma,
      next_appoinment,
      treatments,
      medicines
    } = data;

    // 1. Get doctor_id by name
    const doctor = await prisma.doctor.findFirst({
      where: { doctor_name }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const doctor_id = doctor.doctor_id;

    // 2. Calculate total treatment cost
    const totalTreatmentCost = treatments.reduce(
      (sum: number, t: any) => sum + (parseFloat(t.treatmentCost) || 0),
      0
    );
    const total_cost = Math.round(totalTreatmentCost + (parseFloat(payableDoctorFee) || 0));

    // 3. Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        patient_id,
        doctor_id,
        total_cost,
        is_drs_derma,
        is_prescribed: 'Yes',
      },
    });

    const prescription_id = prescription.prescription_id;

    // 4. Save prescription items (treatments with or without medicines)
    for (const treatment of treatments) {
      const treatmentRecord = await prisma.treatmentlist.findFirst({
        where: { treatment_name: treatment.treatment_name }
      });

      if (!treatmentRecord) continue;

      const treatment_id = treatmentRecord.treatment_id;

      // Map treatment discount
      const treatment_discount_type =
        treatment.discountType === 'Flat Rate' ? 'Flat' :
        treatment.discountType === 'Percentage' ? 'Percentage' : 'None';

      const doctor_discount_type =
        doctorDiscountType === 'Flat Rate' ? 'Flat' :
        doctorDiscountType === 'Percentage' ? 'Percentage' : 'None';

      // If medicines exist
      if (medicines && medicines.length > 0) {
        for (const med of medicines) {
          const medRecord = await prisma.medicine.findFirst({
            where: { name: med.name }
          });

          if (!medRecord) continue;

          const doseMap: { [key: string]: number } = {};
          med.dosages?.forEach((dose: any) => {
            doseMap[dose.time] = dose.amount;
          });

          await prisma.prescriptionItem.create({
            data: {
              prescription_id,
              medicine_id: medRecord.medicine_id,
              dose_morning: doseMap['Morning']?.toString() ?? '0',
              dose_mid_day: doseMap['Mid Day']?.toString() ?? '0',
              dose_night: doseMap['Night']?.toString() ?? '0',
              duration_days: parseInt(med.duration) || 0,
              advice: advise,
              treatment_id,
              discount_type: treatment_discount_type,
              discount_value: parseFloat(treatment.discountAmount) || 0,
              doctor_discount_type: doctor_discount_type,
              doctor_discount_value: parseInt(doctorDiscountAmount) || 0,
              is_prescribed: 'Yes',
              next_visit_date: next_appoinment && !isNaN(Date.parse(next_appoinment)) ? new Date(next_appoinment) : null,
              payable_doctor_amount: parseFloat(payableDoctorFee) || 0,
              payable_treatment_amount: parseFloat(treatment.treatmentCost) || 0,
              prescribed_doctor_name: doctor_name
            }
          });
        }
      } else {
        // No medicines — save only treatment-related item
        await prisma.prescriptionItem.create({
          data: {
            prescription_id,
            treatment_id,
            advice: advise,
            discount_type: treatment_discount_type,
            discount_value: parseFloat(treatment.discountAmount) || 0,
            doctor_discount_type: doctor_discount_type,
            doctor_discount_value: parseInt(doctorDiscountAmount) || 0,
            is_prescribed: 'Yes',
            next_visit_date: next_appoinment && !isNaN(Date.parse(next_appoinment)) ? new Date(next_appoinment) : null,
            payable_doctor_amount: parseFloat(payableDoctorFee) || 0,
            payable_treatment_amount: parseFloat(treatment.treatmentCost) || 0,
            prescribed_doctor_name: doctor_name,
            dose_morning: '0',
            dose_mid_day: '0',
            dose_night: '0',
            duration_days: 0
          }
        });
      }
    }

    return NextResponse.json({
      message: 'Prescription saved successfully',
      prescription_id
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}
