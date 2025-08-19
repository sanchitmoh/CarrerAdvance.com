import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function DriversRegisterPage() {
  return (
    <AuthForm
      role="Drivers"
      type="register"
      title="Join as a Driver"
      subtitle="Find driving opportunities and grow your career"
    />
  )
}
