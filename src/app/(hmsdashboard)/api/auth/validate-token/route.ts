import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const encodedEmail = url.searchParams.get("url"); // e.g., "bWFtdW5AZ21haWwuY29t:200"

    if (!encodedEmail) {
      return NextResponse.json(
        { valid: false, message: "Email not provided" },
        { status: 400 }
      );
    }

    // Remove the ":200" part if present
    const [base64Email] = encodedEmail.split(":");
    const email = Buffer.from(base64Email, "base64").toString("utf-8");
    // console.log("Decoded email:", email);

    // Find user token by email
    const userToken = await prisma.userToken.findFirst({
      where: { email },
    });

    if (!userToken) {
      return NextResponse.json(
        { valid: false, message: "User not found" },
        { status: 401 }
      );
    }

    // Check expiry
    if (userToken.expiresAt && userToken.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, message: "Token expired" },
        { status: 401 }
      );
    }

    // User is valid
    return NextResponse.json({
      code: "jwt_auth_valid_token",
      data: { status: 200 },
      valid: true,
      email,
      token: userToken.token,
      username: userToken.username,
      phoneNumber: userToken.phone_number,
    });
  } catch (error) {
    console.error("check-session error:", error);
    return NextResponse.json(
      { valid: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
