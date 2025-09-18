/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowedOrigins = [
  process.env.NEXT_CORS_URL || "",
  process.env.WP_BASE_URL || "",
];

// Helper for CORS headers
function getCorsHeaders(origin: string | null): Record<string, string> {
  if (origin && allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
  }
  // fallback: return empty headers (all values must be string)
  return {};
}

// GET request
export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const headers = getCorsHeaders(origin);

  try {
    const treatmentsList = await prisma.treatmentlist.findMany();
    return NextResponse.json({ treatments: treatmentsList }, { headers });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching treatments" },
      { status: 500, headers }
    );
  }
}

// OPTIONS request (preflight)
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const headers = getCorsHeaders(origin);

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}
