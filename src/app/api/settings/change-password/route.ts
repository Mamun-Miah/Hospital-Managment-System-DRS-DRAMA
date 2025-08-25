import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
const currentUser = (session?.user.name?.toLowerCase())
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // session.user contains id, email, name, roles, permissions
    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
