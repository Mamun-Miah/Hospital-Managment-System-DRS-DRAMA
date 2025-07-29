'use client'

import { signOut } from 'next-auth/react'
import SignOutButton2 from '@/components/SignOutButton';

export default function SignOutButton() {
  return (
    <span
      onClick={() => signOut({ callbackUrl: '/authentication/sign-in/' })}
      className="title leading-none"
    >
      Sign Out  <SignOutButton2/> 
    </span>
    
  )
}
