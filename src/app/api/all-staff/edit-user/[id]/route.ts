/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

   if (!session?.user.permissions?.includes("edit-staff") || !session?.user.permissions?.includes("all-staff")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id, name, email, password, role } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
    };

    // Update password only if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    // Update role if provided
    if (role) {
      // Remove existing roles and assign new role
      await prisma.userRole.deleteMany({ where: { userId: Number(id) } });
      await prisma.userRole.create({
        data: {
          userId: Number(id),
          roleId: Number(role),
        },
      });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
