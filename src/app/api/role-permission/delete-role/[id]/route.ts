import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const roleId = parseInt(id);

  try {
    // Find the role
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });

    if (!role) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    // Prevent deletion if it's the Admin role
    if (role.name.toLowerCase() === "super admin") {
      return NextResponse.json(
        { error: "Cannot delete the Super Admin role" },
        { status: 400 }
      );
    }

    // (Optional) If you want to check if any of its permissions are 'admin' related:
    // Assuming you have a special permission ID or name for Admin permission
    const adminPermissionIds: number[] = [/* put admin-only permission IDs here */];
    const hasAdminPermission = role.permissions.some(rp =>
      adminPermissionIds.includes(Number(rp.permissionId))
    );
    if (hasAdminPermission) {
      return NextResponse.json(
        { error: "Cannot delete role with Admin-level permissions" },
        { status: 400 }
      );
    }

    // Delete all rolePermissions first
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Then delete the role itself
    const deleteRole = await prisma.role.delete({
      where: { id: roleId },
    });

    return NextResponse.json({
      message: "Role and related permissions deleted successfully",
      deleteRole,
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { error: "Failed to delete Role", details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
