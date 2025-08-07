import prisma from "@/lib/prisma";

export async function generatePrescriptionNumber(
  patientId: number,
  doctorId: number
): Promise<string> {
  const latestPrescription = await prisma.prescription.findFirst({
    orderBy: { prescription_id: "desc" },
    select: { prescription_id: true },
  });

  const lastPrescriptionId = latestPrescription?.prescription_id ?? 0;
  const newPrescriptionId = lastPrescriptionId + 1;
  const year = new Date().getFullYear();

  // Format: PRX-2025-<newId>-<patientId>-<doctorId>
  return `PRX-${year}-${newPrescriptionId}-${patientId}-${doctorId}`;
}
