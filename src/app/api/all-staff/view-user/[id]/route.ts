import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id; 
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
                id:true // Get role name
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
const flatenRole = user.roles.map((r) => r.role.id).join(", ");
    // Flatten roles for easier frontend usage
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: flatenRole,
    };

    return NextResponse.json(formattedUser);
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
