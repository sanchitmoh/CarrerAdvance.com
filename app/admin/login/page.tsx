'use client'
import AdminAuthForm from '@/components/AdminAuthForm'

export default function AdminLoginPage() {
  return (
    <AdminAuthForm
      type="login"
      title="Admin Portal"
      subtitle="Secure access to system administration"
    />
  ) 
}
