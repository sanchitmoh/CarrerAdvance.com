import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function DriversLoginPage() {
  return (
    <AuthForm
      role="Drivers"
      type="login"
      title="Driver Login"
      subtitle="Access your driver dashboard and manage your profile"
    />
  )
}
