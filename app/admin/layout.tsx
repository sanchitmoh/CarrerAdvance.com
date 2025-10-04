'use client'

import type React from 'react'
import { usePathname } from 'next/navigation'
import AdminTopbar from '@/components/admin-topbar'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showTopbar = pathname !== '/admin/login' && pathname !== '/admin/register'
  const isAdminAuthPage = pathname?.includes('/login') || pathname?.includes('/register') || pathname?.includes('/forgot-password')

  // For admin auth pages, don't use flex layout to avoid interfering with footer
  if (isAdminAuthPage) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <div className="min-h-screen">
      {showTopbar && <AdminTopbar />}
      <div className="min-w-0">
        {children}
      </div>
    </div>
  )
}