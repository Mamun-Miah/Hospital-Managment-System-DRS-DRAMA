import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function POST( req: NextRequest) {

  //   const session = await getServerSession(authOptions);

  //   if (!session?.user.permissions?.includes("invoice")) {
  //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  //   }

  //   const invoiceId = parseInt(id, 10);

  try {
    const body = await req.json();

    const { advise } = body;

    if (!advise) {
      return NextResponse.json(
        { message: "Advise is missing" },
        { status: 400 }
      );
    }

    const createdAdvice = await prisma.advice.create({
      data: {
        advice:advise,
      },
    });

    console.log(createdAdvice);
    return NextResponse.json(
      {
        message: "Advise Created successfully",
        advise: createdAdvice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating advise:", error);
    return NextResponse.json(
      { error: "An error occurred while creating advise ." },
      { status: 500 }
    );
  }
}
