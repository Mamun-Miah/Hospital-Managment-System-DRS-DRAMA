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
    }
    
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading Dashboard Home...</div>;
  }

  //Wait until session is loaded and valid
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
