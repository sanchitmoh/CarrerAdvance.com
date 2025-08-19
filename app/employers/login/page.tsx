'use client'
import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function EmployersLoginPage() {
  return (
    <AuthForm
      role="Employers"
      type="login"
      title="Employer Login"
      subtitle="Access your employer dashboard and manage job postings"
    />
  )
}
