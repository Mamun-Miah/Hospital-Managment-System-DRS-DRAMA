// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET(request: Request, context: { params: { id: string } }) {
//   // Await the params object before accessing its properties
//   const { id } = await context.params;

//   const patientId = parseInt(id);

//   if (isNaN(patientId)) {
//     return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
//   }

//   try {
//     const patient = await prisma.patient.findUnique({
//       where: { patient_id: patientId },
//       include: {
//         Prescription: {
//           orderBy: { prescribed_at: "desc" },
//           include: {
//             doctor: true,
//             items: {
//               include: {
//                 medicine: true,
//               },
//             },
//             treatmentItems: {
//               include: {
//                 treatment: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!patient) {
//       return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//     }

//     const formatted = {
//       patient_id: patient.patient_id,
//       patient_name: patient.patient_name,
//       age: patient.age,
//       gender: patient.gender,
//       prescriptions: patient.Prescription.map((prescription) => ({
//         prescription_id: prescription.prescription_id,
//         prescribed_at: prescription.prescribed_at.toISOString().split("T")[0],
//         doctor_name: prescription.doctor?.doctor_name || "Unknown",
//         doctor_image: prescription.doctor?.doctor_image || "/uploads/default.avif",
//         total_cost: prescription.total_cost,
//         is_prescribed: prescription.is_prescribed,
//         advise: prescription.advise || "",
//         medicines: prescription.items.map((item) => ({
//           item_id: item.item_id,
//           medicine_id: item.medicine_id,
//           medicine_name: item.medicine?.name || "Unknown",
//           dose_morning: item.dose_morning || "",
//           dose_mid_day: item.dose_mid_day || "",
//           dose_night: item.dose_night || "",
//           duration_days: item.duration_days || 0,
//         })),
//         treatments: prescription.treatmentItems.map((treatmentItem) => ({
//           id: treatmentItem.id,
//           treatment_id: treatmentItem.treatment_id,
//           treatment_name: treatmentItem.treatment?.treatment_name || "Unknown",
//           discount_type: treatmentItem.discount_type,
//           discount_value: treatmentItem.discount_value,
//           payable_amount: treatmentItem.payable_treatment_amount,
//         })),
//       })),
//     };

//     return NextResponse.json(formatted);
//   } catch (error) {
//     console.error("Error fetching patient history:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET(
//   request: Request,
//   context: { params: { id: string } }
// ) {
//   const patientId = parseInt(context.params.id);

//   if (isNaN(patientId)) {
//     return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
//   }

//   try {
//     const patient = await prisma.patient.findUnique({
//       where: { patient_id: patientId },
//       include: {
//         Prescription: {
//           orderBy: { prescribed_at: "asc" },
//           include: {
//             doctor: true,
//             items: {
//               include: {
//                 medicine: true,
//               },
//             },
//             treatmentItems: {
//               include: {
//                 treatment: true,
//               },
//             },
//           },
//         },
//         Invoice: {
//           orderBy: { invoice_creation_date: "asc" },
//           include: {
//             doctor: true,
//             prescription: true,
//           },
//         },
//       },
//     });

//     if (!patient) {
//       return NextResponse.json({ error: "Patient not found" }, { status: 404 });
//     }

//     const patientInfo = {
//       patient_id: patient.patient_id,
//       patient_name: patient.patient_name,
//       email: patient.email || "",
//       mobile_number: patient.mobile_number || "",
//       gender: patient.gender || "",
//       age: patient.age || "",
//       blood_group: patient.blood_group || "",
//       weight: patient.weight || "",
//       emergency_contact_phone: patient.emergency_contact_phone || "",
//       image_url: patient.image_url || "/uploads/default.avif",
//     };

//     const prescriptions = patient.Prescription.map((prescription) => ({
//       prescription_id: prescription.prescription_id,
//       prescribed_at: prescription.prescribed_at.toISOString(),
//       total_cost: prescription.total_cost || 0,
//       prescribed_doctor_name: prescription.doctor?.doctor_name || "Unknown",
//       doctor_image_url: prescription.doctor?.doctor_image || "/uploads/default.avif",
//       advise: prescription.advise || "",
//       next_visit_date: prescription.next_visit_date?.toISOString() || null,
//       medicine_items: prescription.items.map((item) => ({
//         item_id: item.item_id,
//         medicine_name: item.medicine?.name || "Unknown",
//         dose_morning: item.dose_morning || "",
//         dose_mid_day: item.dose_mid_day || "",
//         dose_night: item.dose_night || "",
//         duration_days: item.duration_days || 0,
//       })),
//       treatment_items: prescription.treatmentItems.map((treatmentItem) => ({
//         treatment_name: treatmentItem.treatment?.treatment_name || "Unknown",
//         duration_months: treatmentItem.duration_months || 0,
//         payable_treatment_amount: treatmentItem.payable_treatment_amount || 0,
//         discount_type: treatmentItem.discount_type || "None",
//         discount_value: treatmentItem.discount_value || 0,
//       })),
//     }));

//     const payments = patient.Invoice.map((invoice) => ({
//       payment_id: invoice.invoice_id,
//       paid_at: invoice.invoice_creation_date?.toISOString() || null,
//       amount: invoice.paid_amount || 0,
//       payment_method: invoice.payment_method || "Unknown",
//       collected_by: invoice.doctor?.doctor_name || "Unknown",
//     }));

//     const appointments = patient.Prescription.filter(p => p.next_visit_date).map(p => ({
//       appointment_id: p.prescription_id,
//       booked_at: p.prescribed_at.toISOString(),
//       appointment_date: p.next_visit_date?.toISOString() || "",
//       department: "Dermatology",
//       doctor_name: p.doctor?.doctor_name || "Unknown",
//     }));

//     const finalResponse = {
//       patient: patientInfo,
//       prescriptions: prescriptions,
//       payments: payments,
//       appointments: appointments,
//     };

//     return NextResponse.json(finalResponse);
//   } catch (error) {
//     console.error("Error fetching patient history:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const patientId = parseInt(context.params.id);

  if (isNaN(patientId)) {
    return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_id: patientId },
      include: {
        Prescription: {
          orderBy: { prescribed_at: "asc" },
          include: {
            doctor: true,
            items: {
              include: {
                medicine: true,
              },
            },
            treatmentItems: {
              include: {
                treatment: true,
              },
            },
          },
        },
        Invoice: {
          orderBy: { invoice_creation_date: "asc" },
          include: {
            doctor: true,
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const patientInfo = {
      patient_id: patient.patient_id,
      patient_name: patient.patient_name,
      email: patient.email || "",
      mobile_number: patient.mobile_number || "",
      gender: patient.gender || "",
      age: patient.age || "",
      blood_group: patient.blood_group || "",
      weight: patient.weight || "",
      emergency_contact_phone: patient.emergency_contact_phone || "",
      image_url: patient.image_url || "/uploads/default.avif",
    };

    const prescriptions = patient.Prescription.map((prescription) => ({
      prescription_id: prescription.prescription_id,
      prescribed_at: prescription.prescribed_at.toISOString(),
      total_cost: prescription.total_cost || 0,
      prescribed_doctor_name: prescription.doctor?.doctor_name || "Unknown",
      doctor_image_url: prescription.doctor?.doctor_image || "/uploads/default.avif",
      advise: prescription.advise || "",
      next_visit_date: prescription.next_visit_date?.toISOString() || "",
      medicine_items: prescription.items.map((item) => ({
        item_id: item.item_id,
        medicine_name: item.medicine?.name || "Unknown",
        dose_morning: item.dose_morning || "",
        dose_mid_day: item.dose_mid_day || "",
        dose_night: item.dose_night || "",
        duration_days: item.duration_days || 0,
      })),
      treatment_items: prescription.treatmentItems.map((treatmentItem) => ({
        treatment_name: treatmentItem.treatment?.treatment_name || "Unknown",
        // duration_months: treatmentItem.duration_months || 0,
        payable_treatment_amount: treatmentItem.payable_treatment_amount || 0,
        discount_type: treatmentItem.discount_type || "None",
        discount_value: treatmentItem.discount_value || 0,
      })),
    }));

    const payments = patient.Invoice.map((invoice) => ({
      payment_id: invoice.invoice_id,
      paid_at: invoice.invoice_creation_date?.toISOString() || null,
      amount: invoice.paid_amount || 0,
      payment_method: invoice.payment_method || "Unknown",
      collected_by: invoice.doctor?.doctor_name || "Unknown",
    }));

    const finalResponse = {
      patient: patientInfo,
      prescriptions: prescriptions,
      payments: payments,
    };

    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error("Error fetching patient history:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}