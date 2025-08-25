import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
   const session = await getServerSession(authOptions)

   if (!session?.user.permissions?.includes("all-staff")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: {
            role: {
              select: {
                name: true, // Get the role name
              },
            },
          },
        },
      },
    });

    // Flatten roles for easier frontend use
    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      roles: u.roles.map((r) => r.role.name), // extract role names into an array
    }));

    return NextResponse.json(formattedUsers);
  } catch (err) {
    console.error("Error fetching users with roles:", err);
    return NextResponse.json({ error: "Failed to fetch users with roles" }, { status: 500 });
  }
}
