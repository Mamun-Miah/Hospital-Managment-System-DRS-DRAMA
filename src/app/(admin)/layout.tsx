'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const { data: session, status } = useSession();
     const router = useRouter();
   
     useEffect(() => {
       if (status === 'loading') return;
   
       if (!session) {
         router.push('/authentication/sign-in/');
       } else {
         router.push('/dashboard/hospital/');
       }
     }, [session, status, router]);
   
     return <div>Loading...</div>;

  return <>{children}</>;
}
