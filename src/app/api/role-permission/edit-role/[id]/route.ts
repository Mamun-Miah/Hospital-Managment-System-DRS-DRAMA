import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await getServerSession(authOptions)

   if (!session?.user.permissions?.includes("create-role") || !session?.user.permissions?.includes("edit-role")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const id = (await params).id;
  const roleId = parseInt(id);

  try {
    const { name, permissionId } = await request.json();
    // console.log(name,permissionId)
  
    const updatedRole = await prisma.role.update({
      where: { id: roleId },
      data: { name },
    });

    // Delete old permissions
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

   
    if (permissionId && permissionId.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionId.map((pid: number) => ({
          roleId: roleId,
          permissionId: Number(pid),
        })),
      });
    }

    return NextResponse.json({
      message: "Role updated successfully",
      updatedRole,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update Role" },
      { status: 500 }
    );
  }
}
