'use client'

import type React from 'react'
import { usePathname } from 'next/navigation'
import AdminTopbar from '@/components/admin-topbar'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showTopbar = pathname !== '/admin/login'

  return (
    <div className="min-h-screen flex flex-col">
      {showTopbar && <AdminTopbar />}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}


