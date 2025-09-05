import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    // Call WordPress JWT endpoint
    const wpRes = await fetch(`${process.env.WP_BASE_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await wpRes.json();

    if (!wpRes.ok) {
      return NextResponse.json({ error: data.message || "Login failed" }, { status: 401 });
    }

    // Calculate token expiry (1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Delete existing token for this email
    await prisma.userToken.deleteMany({
      where: { email: data.user_email },
    });

    // Create new token
    await prisma.userToken.create({
      data: { username, email: data.user_email, token: data.token, expiresAt },
    });

    // Return token + user info
    return NextResponse.json({
      token: data.token,
      user: {
        id: data.user_id,
        username: data.user_nicename,
        email: data.user_email,
        displayName: data.user_display_name,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
