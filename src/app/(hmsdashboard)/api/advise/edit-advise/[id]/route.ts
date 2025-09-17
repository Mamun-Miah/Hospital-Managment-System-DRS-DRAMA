import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const advise = await req.json();
  const id = Number((await params).id);

  if (!advise || !id) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }

  const updateAdvise = await prisma.advice.update({
    where: { id },
    data: { advice: advise.advise },
  });

  if (updateAdvise) {
    return NextResponse.json(
      {
        success: true,
        message: "Updated Successfully",
        advice: updateAdvise,
      },
      { status: 200 }
    );
  }
}