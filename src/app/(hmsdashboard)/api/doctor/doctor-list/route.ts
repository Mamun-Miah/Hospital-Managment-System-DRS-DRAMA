import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"

export async function GET() {
  // const session = await getServerSession(authOptions)

  // if (!session?.user.permissions?.includes("list-doctor")){
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  // }
  try {
    const allDoctors = await prisma.doctor.findMany({
      
    });

    return NextResponse.json(allDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}