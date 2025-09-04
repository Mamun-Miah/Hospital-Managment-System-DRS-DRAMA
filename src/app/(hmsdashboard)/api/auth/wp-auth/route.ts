import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = "your-very-secret-key"; // must match UM_JWT_SECRET in WP

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { user_id: number; email: string; iat: number; exp: number };

    // Optional: You can store the user info in a cookie for session
    const response = NextResponse.redirect("/dashboard"); // redirect to your dashboard
    response.cookies.set("wp_session", token, {
      httpOnly: true,
      path: "/",
      maxAge: decoded.exp - Math.floor(Date.now() / 1000), // expire at same time as JWT
    });

    return response;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
