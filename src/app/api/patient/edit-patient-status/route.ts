/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { patient_id, status } = await req.json();

    if (!patient_id || !status) {
      return NextResponse.json(
        { error: "patient_id and status are required" },
        { status: 400 }
      );
    }

    const updatedPatient = await prisma.patient.update({
      where: { patient_id: Number(patient_id) },
      data: { status },
    });

    return NextResponse.json({
      message: "Patient status updated successfully",
      patient: updatedPatient,
    });
  } catch (error: any) {
    console.error("Error updating patient status:", error);
    return NextResponse.json(
      { error: "Failed to update patient status" },
      { status: 500 }
    );
  }
}
