import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise< { filename: string }> }
) {
  const filePath = path.join(process.cwd(), "images",  (await params).filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    headers: { "Content-Type": "image/png" }, // adjust dynamically if needed
  });
}
