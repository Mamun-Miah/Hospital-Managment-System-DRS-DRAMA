import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser)
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 })

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  return NextResponse.json({ user })
}
