/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

  if (!session?.user.roles?.includes("Super Admin")){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  try {
    const { name, email, password, role } = await req.json()
    // console.log(name,email,password,role)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and assign role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: {
            role: {
              connect: { id: Number(role) }
            }
          }
        }
      },
      include: {
        roles: {
          include: { role: true }
        }
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    console.error("Error creating user:", error)

    // Send actual error message in response
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    )
  }
}
