'use client'
import dynamic from 'next/dynamic'

const AdminAuthForm = dynamic(() => import('@/components/AdminAuthForm'), { ssr: false })

export default function AdminRegisterPage() {
  return (
    <AdminAuthForm
      type="register"
      title="Admin Registration"
      subtitle="Create a new administrator account"
    />
  )
}
