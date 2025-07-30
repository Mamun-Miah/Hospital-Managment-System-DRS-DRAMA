import prisma from "@/lib/prisma";

export async function generateInvoiceNumber(patientId: number): Promise<string> {
  const currentYear = new Date().getFullYear();

  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: { invoice_id: "desc" },
    select: { invoice_id: true },
  });

  const lastInvoiceId = lastInvoice?.invoice_id ?? 0;

  const increment = lastInvoiceId + 1;
  const combinedNumber = patientId + increment;

  return `INV-${currentYear}-${patientId}-${combinedNumber}`;
}
