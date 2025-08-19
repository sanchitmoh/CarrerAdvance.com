import AuthForm from '@/components/AuthForm'

export default function CompaniesLoginPage() {
  return (
    <AuthForm
      role="Companies"
      type="login"
      title="Company Login"
      subtitle="Access your company dashboard and manage your team"
    />
  )
}
