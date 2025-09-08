import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    // Delete the user's token from the database
    await prisma.userToken.deleteMany({
      where: { email },
    });

    // Return the WordPress logout URL
    const wpLogoutUrl = "http://localhost/mysite/logout/?redirect_to=http://localhost/mysite/login/";

    return NextResponse.json({
      success: true,
      redirectUrl: wpLogoutUrl,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
