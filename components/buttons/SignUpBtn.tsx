'use client'
import React from 'react'
import { Button } from '../ui/button'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SignUpBtn = () => {
  const router = useRouter()

  const handleSignUp = () => {
    router.push('/sign-up') // Navigate to your sign-in page
  }

  return (
    <Button
      onClick={handleSignUp}
      className="bg-gradient-to-r from-blue-500 to-blue-800 hover:bg-blue-500 hover:ring-2 duration-300 text-white text-m pl-4 rounded-full w-full flex items-center gap-4"
    >
      <LogIn size={15} className="animate-pulse" /> Sign Up
    </Button>
  )
}

export default SignUpBtn;
