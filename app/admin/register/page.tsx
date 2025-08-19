'use client'
import AdminAuthForm from '@/components/AdminAuthForm'

export default function AdminRegisterPage() {
  return (
    <AdminAuthForm
      type="register"
      title="Admin Registration"
      subtitle="Create a new administrator account"
    />
  )
}
