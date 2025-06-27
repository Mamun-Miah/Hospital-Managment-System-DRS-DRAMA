'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const { data: session, status } = useSession()
console.log('Session:', session, 'Status:', status) 


  if (status === 'loading') return <div>Loading...</div>

  if (!session) return redirect('/authentication/sign-in/')

  return <>{children}</>;
}
