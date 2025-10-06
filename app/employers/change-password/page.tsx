'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EmployersChangePasswordRoute() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/employers/dashboard/change-password')
  }, [router])
  return null
}


