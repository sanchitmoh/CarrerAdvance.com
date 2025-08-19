import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function TeachersRegisterPage() {
  return (
    <AuthForm
      role="Teachers"
      type="register"
      title="Join as a Teacher"
      subtitle="Share your knowledge and inspire the next generation"
    />
  )
}
