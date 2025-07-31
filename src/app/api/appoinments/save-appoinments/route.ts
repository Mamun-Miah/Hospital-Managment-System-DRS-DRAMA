import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/invoice";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      patient_id,
      doctor_name,
      doctor_fee,
      doctorDiscountType,
      doctorDiscountAmount,
      payableDoctorFee,
      totalPayableAmount,
      advise,
      next_appoinment,
      is_drs_derma,
      medicines,
      treatments,
    } = data;

    // Find doctor by name
    const doctor = await prisma.doctor.findFirst({
      where: { doctor_name },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        patient_id,
        doctor_id: doctor.doctor_id,
        total_cost: parseInt(totalPayableAmount || "0"),
        is_drs_derma: is_drs_derma || "No",
        prescribed_at: new Date(),
        next_visit_date: next_appoinment ? new Date(next_appoinment) : null,
        is_prescribed: "Yes",
        advise: advise,
        prescribed_doctor_name: doctor_name,
      },
    });

    const prescriptionId = prescription.prescription_id;

    // Save doctor info
    if (doctor_fee || doctorDiscountAmount) {
      await prisma.prescriptionItem.create({
        data: {
          prescription_id: prescriptionId,
          doctor_discount_type:
            doctorDiscountType === "Flat Rate"
              ? "Flat"
              : doctorDiscountType === "Percentage"
              ? "Percentage"
              : "None",
          doctor_discount_value: parseInt(doctorDiscountAmount || "0"),
          payable_doctor_amount: parseInt(payableDoctorFee || "0"),
        },
      });
    }

    // Save medicines
    if (Array.isArray(medicines)) {
      for (const med of medicines) {
        const medicine = await prisma.medicine.findFirst({
          where: { name: med.name },
        });
        if (!medicine) continue;

        const dosages = {
          dose_morning: "",
          dose_mid_day: "",
          dose_night: "",
        };

        for (const d of med.dosages) {
          const time = d.time.toLowerCase();
          const amount = String(d.amount);

          if (time === "morning") dosages.dose_morning = amount;
          else if (time === "mid day" || time === "midday")
            dosages.dose_mid_day = amount;
          else if (time === "night") dosages.dose_night = amount;
        }

        await prisma.prescriptionItem.create({
          data: {
            prescription_id: prescriptionId,
            medicine_id: medicine.medicine_id,
            dose_morning: dosages.dose_morning,
            dose_mid_day: dosages.dose_mid_day,
            dose_night: dosages.dose_night,
            duration_days: parseInt(med.duration),
          },
        });
      }
    }

    // Save treatments
    if (Array.isArray(treatments)) {
      for (const treat of treatments) {
        const treatment = await prisma.treatmentlist.findFirst({
          where: { treatment_name: treat.treatment_name },
        });

        if (!treatment) continue;

        await prisma.prescriptionTreatmentItem.create({
          data: {
            prescription_id: prescriptionId,
            treatment_id: treatment.treatment_id,
            discount_type:
              treat.discountType === "Flat Rate"
                ? "Flat"
                : treat.discountType === "Percentage"
                ? "Percentage"
                : "None",
            discount_value: parseInt(treat.discountAmount || "0"),
            payable_treatment_amount: parseInt(treat.treatmentCost || "0"),
          },
        });
      }
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(patient_id);

    // Create Invoice record
    const invoice = await prisma.invoice.create({
      data: {
        invoice_number: invoiceNumber,
        patient_id: patient_id,
        doctor_id: doctor.doctor_id,
        previous_due: 0,
        total_treatment_cost: 0,
        paid_amount: 0,
        doctor_fee: parseInt(doctor_fee || "0"),
        due_amount: 0,
        invoice_creation_date: new Date(),
        next_session_date: next_appoinment ? new Date(next_appoinment) : null,
        prescription_id: prescriptionId,
      },
    });


    await prisma.patient.update({
      where: { patient_id: patient_id },
      data: {
        status: "Deactivated",
      },
    });

    return NextResponse.json({
      message: "Prescription and Invoice saved successfully",
      prescription_id: prescriptionId,
      invoice_id: invoice.invoice_id,
      invoice_number: invoice.invoice_number,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
