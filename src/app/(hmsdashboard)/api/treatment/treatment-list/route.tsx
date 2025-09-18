/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const allowedOrigin = process.env.WP_BASE_URL || "*";

// Helper for CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// GET request
export async function GET() {
  try {
    const treatmentsList = await prisma.treatmentlist.findMany();

    return NextResponse.json(
      { treatments: treatmentsList },
      { headers: corsHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching treatments" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS request (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}