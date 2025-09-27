import dynamic from 'next/dynamic'

const AdminAuthForm = dynamic(() => import('@/components/AdminAuthForm'), { ssr: false })

export default function AdminForgotPasswordPage() {
  return (
    <AdminAuthForm
      type="forgot-password"
      title="Admin Password Reset"
      subtitle="Secure password recovery for administrators"
    />
  )
}
