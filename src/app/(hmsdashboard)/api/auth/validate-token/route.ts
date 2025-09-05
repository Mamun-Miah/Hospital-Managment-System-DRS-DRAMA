import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // <- use this
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies(); // get cookies from request
    const email = cookieStore.get("user_email")?.value;

    console.log(email)

    if (!email) {
      return NextResponse.json({ valid: false, error: "No email cookie found" }, { status: 401 });
    }

    // Get the latest token for this email from the database
    const userToken = await prisma.userToken.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });


    console.log(userToken)
    if (!userToken) {
      return NextResponse.json({ valid: false, error: "Token not found" }, { status: 401 });
    }

    const token = userToken.token;
    console.log('token2',token)

    // Verify token with WordPress
    const res = await fetch(`${process.env.WP_BASE_URL}/jwt-auth/v1/token/validate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
console.log(res)
    if (!res.ok) return NextResponse.json({ valid: false }, { status: 401 });

    return NextResponse.json({ valid: true, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}
