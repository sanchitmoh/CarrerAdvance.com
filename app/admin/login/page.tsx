'use client'
import AdminAuthForm from '@/components/AdminAuthForm'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    try {
      // Minimal signal: server sets an admin session; detect via a cookie flag if present
      const hasAdminCookie = typeof document !== 'undefined' && document.cookie.split('; ').some(c => c.startsWith('ci_session='))
      if (hasAdminCookie) {
        router.replace('/admin/dashboard')
      }
    } catch (_) {}
  }, [router])

  return (
    <AdminAuthForm
      type="login"
      title="Admin Portal"
      subtitle="Secure access to system administration"
    />
  ) 
}
