import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // sanitize file name (remove spaces + special chars)
  const originalName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
  const filename = `${randomUUID()}-${originalName}`;

  const filePath = path.join(process.cwd(), "images", filename);
  await writeFile(filePath, buffer);

  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const baseUrl = "https://hms.drsdermabd.com";
  const imageUrl = `${baseUrl}/api/images/${filename}`;

  return NextResponse.json({ imageUrl });
}
