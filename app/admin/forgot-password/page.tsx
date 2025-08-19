import AdminAuthForm from '@/components/AdminAuthForm'

export default function AdminForgotPasswordPage() {
  return (
    <AdminAuthForm
      type="forgot-password"
      title="Admin Password Reset"
      subtitle="Secure password recovery for administrators"
    />
  )
}
