'use client'
import AuthForm from '@/components/AuthForm'

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
