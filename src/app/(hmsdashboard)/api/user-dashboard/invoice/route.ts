import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1]; // Expect "Bearer <token>"

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hash the incoming token
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Validate hashed token in DB
    const userToken = await prisma.userToken.findUnique({
      where: { tokenHash }, // compare hashed token
    });

    if (!userToken || userToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token invalid or expired" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Missing phone number" }, { status: 400 });
    }

    // Find patient by phone number
    const patient = await prisma.patient.findUnique({
      where: { mobile_number: phone },
      select: { patient_id: true },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Fetch invoices
    const invoiceList = await prisma.invoice.findMany({
      where: { patient_id: patient.patient_id },
      include: {
        patient: { select: { patient_name: true, mobile_number: true } },
        doctor: { select: { doctor_name: true } },
        prescription: { select: { total_cost: true, prescribed_at: true, next_visit_date: true } },
      },
      orderBy: { invoice_creation_date: "desc" },
    });

    const formattedinvoiceList = invoiceList.map((invoice) => ({
      invoice_id: invoice.invoice_id,
      invoice_number: invoice.invoice_number,
      doctor_name: invoice.doctor?.doctor_name || "",
      patient_name: invoice.patient?.patient_name || "",
      mobile_number: invoice.patient?.mobile_number || "",
      prescribed_at: invoice.prescription?.prescribed_at,
      total_cost: invoice.prescription?.total_cost || 0,
      paid_amount: invoice.paid_amount || 0,
      due_amount: invoice.due_amount,
      next_appointment_date: invoice.prescription?.next_visit_date,
      payment_type: invoice.payment_type,
    }));

    return NextResponse.json({ formattedinvoiceList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching invoices." },
      { status: 500 }
    );
  }
}
