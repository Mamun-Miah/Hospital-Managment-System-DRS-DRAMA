import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
export async function GET(
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
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      select: {
        name: true, // get only role name
        permissions: {
          select: {
            permissionId: true, // get only permission IDs
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { error: "Role not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: role.name,
      permissions: role.permissions.map((rp) => rp.permissionId),
    });
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Failed to fetch role" },
      { status: 500 }
    );
  }
}
