'use client'
import AuthForm from '@/components/AuthForm'

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
