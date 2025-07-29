'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <span
      onClick={() => signOut({ callbackUrl: '/authentication/sign-in/' })}
      className="title leading-none"
    >
      Sign Out
    </span>
    
  )
}
