
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 6 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
  if (user) {
    token.role = user.role;
    token.iat = Math.floor(Date.now() / 1000);
    token.exp = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  }
  return token;
  },
    async session({ session, token }) {
      if (token) session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: '/authentication/sign-in/',
    signOut: '/authentication/signout',
  }
})

export { handler as GET, handler as POST }
