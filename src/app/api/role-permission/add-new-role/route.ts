/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, permissionId } = data;

    if (!name && !permissionId || !Array.isArray(permissionId)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Create role
    const role = await prisma.role.create({
      data: { name },
    });

    // Map permissions with correct type
    const rolePermissions = permissionId.map((permId: string) => ({
      roleId: role.id,
      permissionId: Number(permId),
    }));

    await prisma.rolePermission.createMany({
      data: rolePermissions,
    });

    return NextResponse.json(
      { message: "Role and permissions created successfully", role },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create role and permissions" },
      { status: 500 }
    );
  }
}
