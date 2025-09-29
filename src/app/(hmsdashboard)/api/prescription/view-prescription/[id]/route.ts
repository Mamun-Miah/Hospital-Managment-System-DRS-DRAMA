import prisma from "@/lib/prisma"; 
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Get NextAuth session
    const session = await getServerSession(authOptions);

    // 2. Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1]; // "Bearer <token>"

    // 3. Validate token via SHA256 hash
    let tokenValid = false;
    if (token) {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const userToken = await prisma.userToken.findFirst({
        where: { tokenHash },
      });
      tokenValid = !!userToken && userToken.expiresAt > new Date();
    }

    // 4. Allow access if session has permission OR token is valid
    if (!session?.user.permissions?.includes("prescription-list") && !tokenValid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // --- Fetch prescription logic remains unchanged ---
    const { id } = await params;
    const prescriptionId = parseInt(id);

    const prescription = await prisma.prescription.findUnique({
      where: { prescription_id: prescriptionId },
      select: {
        prescription_id: true,
        prescribed_at: true,
        is_prescribed: true,
        is_drs_derma: true,
        total_cost: true,
        patient_id: true,
        doctor_id: true,
        doctor_discount_type: true,
        doctor_discount_value: true,
        payable_doctor_amount: true,
        prescribed_doctor_name: true,
        next_visit_date: true,
        chief_complaint_cc: true,
        drug_history_dh: true,
        relevant_findings_rf: true,
        on_examination_oe: true,
        advise: true,
        patient: {
          select: {
            patient_name: true,
            city: true,
            mobile_number: true,
            gender: true,
            age: true,
            blood_group: true,
            weight: true,
          },
        },
        doctor: {
          select: {
            doctor_name: true,
            phone_number: true,
            designation: true,
            doctor_fee: true,
          },
        },
        items: {
          select: {
            item_id: true,
            dose_morning: true,
            dose_mid_day: true,
            dose_night: true,
            duration_days: true,
            medicine: { select: { name: true } },
          },
        },
        treatmentItems: {
          select: {
            id: true,
            discount_type: true,
            discount_value: true,
            payable_treatment_amount: true,
            next_treatment_session_interval_date: true,
            session_number: true,
            treatment: {
              select: {
                treatment_name: true,
                total_cost: true,
                duration_months: true,
              },
            },
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    // Format dates
    const prescribedDate = new Date(prescription.prescribed_at);
    const formattedPrescribedDate = `${String(prescribedDate.getDate()).padStart(2,"0")}.${String(prescribedDate.getMonth()+1).padStart(2,"0")}.${prescribedDate.getFullYear()}`;
    const nextVisitDate = prescription.next_visit_date ? new Date(prescription.next_visit_date) : null;
    const formattedNextVisitDate = nextVisitDate
      ? `${String(nextVisitDate.getDate()).padStart(2,"0")}.${String(nextVisitDate.getMonth()+1).padStart(2,"0")}.${nextVisitDate.getFullYear()}`
      : null;

    const formatted = {
      ...prescription,
      prescribed_at: formattedPrescribedDate,
      prescribed_at_time: `${String(prescribedDate.getUTCHours()).padStart(2,"0")}:${String(prescribedDate.getUTCMinutes()).padStart(2,"0")}`,
      next_visit_date: formattedNextVisitDate,
      items: prescription.items.map(item => ({
        ...item,
        medicine_name: item.medicine?.name ?? null,
        medicine: undefined,
      })),
      treatmentItems: prescription.treatmentItems.map(treat => ({
        ...treat,
        treatment_name: treat.treatment?.treatment_name ?? null,
        total_cost: treat.treatment?.total_cost ?? null,
        duration_months: treat.treatment?.duration_months ?? null,
        treatment: undefined,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
