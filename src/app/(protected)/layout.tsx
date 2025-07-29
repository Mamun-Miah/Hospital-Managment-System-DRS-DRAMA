'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.replace('/authentication/sign-in/')
    } else {
      setChecked(true)
    }
  }, [status, session, router])

  if (status === 'loading' || !checked) return <div>Loading...</div>

  return <>{children}</>
}
