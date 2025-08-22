import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const userId = parseInt(id);

    // Fetch the user's roles
    const userWithRoles = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true, // get role details including name
          },
        },
      },
    });

    if (!userWithRoles) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if any of the user's roles is 'super admin'
    const hasSuperAdminRole = userWithRoles.roles.some(
      (ur) => ur.role.name.toLowerCase() === "super admin"
    );

    if (hasSuperAdminRole) {
      return NextResponse.json(
        { error: "Cannot delete user with 'super admin' role" },
        { status: 403 }
      );
    }

    // Delete UserRole first
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    // Delete User
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User and related roles deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
