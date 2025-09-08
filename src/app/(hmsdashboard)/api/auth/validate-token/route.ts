import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust based on your project

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { valid: false, message: "Email required" },
        { status: 400 }
      );
    }

    const userToken = await prisma.userToken.findFirst({
      where: { email },
    });

    if (!userToken) {
      return NextResponse.json(
        { valid: false, message: "Token not found" },
        { status: 401 }
      );
    }

    // 🔹 Expiry validation
    if (userToken.expiresAt && userToken.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, message: "Token expired" },
        { status: 401 }
      );
    }

    //  Token is valid
    return NextResponse.json({
      code: "jwt_auth_valid_token",
      data: { status: 200 },
      valid: true,
    });
  } catch (error) {
    console.error("check-session error:", error);
    return NextResponse.json(
      { valid: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
