import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

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
