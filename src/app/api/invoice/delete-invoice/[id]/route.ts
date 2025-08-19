import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await getServerSession(authOptions)

  if (!session?.user.permissions?.includes("invoice")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const id = (await params).id;
  if (!id) {
    return NextResponse.json({ message: "Cannot find id" });
  }
  try {
    const deleted = await prisma.invoice.delete({
      where: {
        invoice_id: Number(id),
      },
    });

    return NextResponse.json(
      { message: "Invoice deleted successfully", deleted },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete patient", error },
      { status: 500 }
    );
  }
}