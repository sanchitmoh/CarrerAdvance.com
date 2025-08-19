import dynamic from 'next/dynamic'

const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function StudentsRegisterPage() {
  return (
    <AuthForm
      role="Students"
      type="register"
      title="Join as a Student"
      subtitle="Start your learning journey and advance your career"
    />
  )
}
