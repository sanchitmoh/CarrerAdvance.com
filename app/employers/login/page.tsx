'use client'
import AuthForm from '@/components/AuthForm'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EmployersLoginPage() {
  const router = useRouter()

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('employer_jwt') : null
      if (token) {
        router.replace('/employers/dashboard')
      }
    } catch (_) {}
  }, [router])

  return (
    <AuthForm
      role="Employers"
      type="login"
      title="Employer Login"
      subtitle="Access your employer dashboard and manage job postings"
    />
  )
}
