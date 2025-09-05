// app/api/auth/check-session/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function OPTIONS(req: Request) {
  // Handle CORS preflight
  const origin = req.headers.get("origin") || "*";
  return NextResponse.json({}, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-User-Email",
    },
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin") || "*";

  try {
    // Accept email from header or body
    let email = req.headers.get("X-User-Email");
    if (!email) {
      const body = await req.json();
      email = body.email;
    }

    console.log('email from api:', email);

    if (!email) {
      return NextResponse.json(
        { valid: false, error: "No email sent" },
        { status: 400, headers: { "Access-Control-Allow-Origin": origin } }
      );
    }

    // Check token in DB
    const userToken = await prisma.userToken.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!userToken) {
      return NextResponse.json(
        { valid: false, error: "No token found" },
        { status: 401, headers: { "Access-Control-Allow-Origin": origin } }
      );
    }

    // Optional: check expiry
    if (userToken.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, error: "Token expired" },
        { status: 401, headers: { "Access-Control-Allow-Origin": origin } }
      );
    }

    // Success
    return NextResponse.json(
      { valid: true, email },
      { headers: { "Access-Control-Allow-Origin": origin } }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { valid: false, error: "Server error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": origin } }
    );
  }
}
