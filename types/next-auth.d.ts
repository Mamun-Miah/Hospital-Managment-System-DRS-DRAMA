import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number // or string, depending on your Prisma model
      roles: string[]
      permissions: string[]
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: number
    roles: string[]
    permissions: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number
    roles: string[]
    permissions: string[]
  }
}
