'use client'
import dynamic from 'next/dynamic'

const AdminAuthForm = dynamic(() => import('@/components/AdminAuthForm'), { ssr: false })

export default function AdminLoginPage() {
  return (
    <AdminAuthForm
      type="login"
      title="Admin Portal"
      subtitle="Secure access to system administration"
    />
  )
}
