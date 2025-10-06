'use client'
import AuthForm from '@/components/AuthForm'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function JobSeekersLoginPage() {
  const router = useRouter()

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('jobseeker_jwt') : null
      if (token) {
        router.replace('/job-seekers/dashboard')
      }
    } catch (_) {}
  }, [router])

  return (
    <AuthForm
      role="Job Seekers"
      type="login"
      title="Job Seeker Login"
      subtitle="Access your job search dashboard and applications"
    />
  )
}
