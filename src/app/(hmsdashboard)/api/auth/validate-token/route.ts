import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ valid: false }, { status: 401 });

  try {
    const res = await fetch(`${process.env.WP_BASE_URL}/wp-json/jwt-auth/v1/token/validate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return NextResponse.json({ valid: false }, { status: 401 });

    return NextResponse.json({ valid: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
