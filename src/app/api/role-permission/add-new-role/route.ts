/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { permissionId } = data;

    if (!Array.isArray(permissionId) || permissionId.length === 0) {
      return NextResponse.json(
        { error: "permissionId must be a non-empty array" },
        { status: 400 }
      );
    }

    // Save all permissions at once
    const permissions = await prisma.permission.createMany({
      data: permissionId.map((name: string) => ({ name })),
      skipDuplicates: true, // avoids duplicate errors if name already exists
    });

    return NextResponse.json(
      { message: "Permissions created successfully", count: permissions.count },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create permissions" },
      { status: 500 }
    );
  }
}
