'use client'
import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function JobSeekersLoginPage() {
  return (
    <AuthForm
      role="Job Seekers"
      type="login"
      title="Job Seeker Login"
      subtitle="Access your job search dashboard and applications"
    />
  )
}
