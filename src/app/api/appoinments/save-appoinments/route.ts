import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
      advise,
      next_appoinment,
      is_drs_derma,
      medicines,
      treatments,
    } = data;

    // Resolve doctor ID by name
    const doctor = await prisma.doctor.findFirst({
      where: { doctor_name },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Create the prescription
    const prescription = await prisma.prescription.create({
      data: {
        patient_id,
        doctor_id: doctor.doctor_id,
        total_cost: 0, // You can calculate later
        is_drs_derma: is_drs_derma || "No",
        prescribed_at: new Date(),
        is_prescribed: "Yes",
      },
    });

    const prescriptionId = prescription.prescription_id;

    // Save doctor info (even if others not selected)
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
          doctor_discount_value: parseFloat(doctorDiscountAmount || "0"),
          payable_doctor_amount: parseFloat(payableDoctorFee || "0"),
          prescribed_doctor_name: doctor_name,
          is_prescribed: "Yes",
          next_visit_date: next_appoinment ? new Date(next_appoinment) : null,
          advice: advise,
        },
      });
    }

    // Save medicines if any
    if (Array.isArray(medicines)) {
      for (const med of medicines) {
        const medicine = await prisma.medicine.findFirst({
          where: { name: med.name },
        });

        if (!medicine) continue;

        // ✅ Fixed dosage mapping
        const dosages = {
          dose_morning: "",
          dose_mid_day: "",
          dose_night: "",
        };

        for (const d of med.dosages) {
          const time = d.time.toLowerCase();
          const amount = String(d.amount);

          if (time === "morning") {
            dosages.dose_morning = amount;
          } else if (time === "mid day" || time === "midday") {
            dosages.dose_mid_day = amount;
          } else if (time === "night") {
            dosages.dose_night = amount;
          }
        }

        await prisma.prescriptionItem.create({
          data: {
            prescription_id: prescriptionId,
            medicine_id: medicine.medicine_id,
            dose_morning: dosages.dose_morning,
            dose_mid_day: dosages.dose_mid_day,
            dose_night: dosages.dose_night,
            duration_days: med.duration,
            is_prescribed: "Yes",
          },
        });
      }
    }

    // Save treatments if any
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
            discount_value: parseFloat(treat.discountAmount || "0"),
            payable_treatment_amount: parseFloat(treat.treatmentCost || "0"),
          },
        });
      }
    }

    return NextResponse.json({
      message: "Prescription saved successfully",
      prescription_id: prescriptionId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
