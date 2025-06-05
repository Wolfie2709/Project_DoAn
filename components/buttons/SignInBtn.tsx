'use client'
import React from 'react'
import { Button } from '../ui/button'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SignInBtn = () => {
  const router = useRouter()

  const handleSignIn = () => {
    router.push('/sign-in') // Navigate to your sign-in page
  }

  return (
    <Button
      onClick={handleSignIn}
      className="bg-gradient-to-r from-blue-500 to-blue-800 hover:bg-blue-500 hover:ring-2 duration-300 text-white text-xl p-4 rounded-full flex items-center gap-2"
    >
      <LogIn size={30} className="animate-pulse" /> Sign In
    </Button>
  )
}

export default SignInBtn;
