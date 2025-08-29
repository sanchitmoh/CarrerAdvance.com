"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import StudentSidebar from "@/components/StudentSidebar"

const authPages = ["/students/login", "/students/register", "/students/forgot-password"]

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="sidebar-container flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StudentSidebar />
      <div className="main-content flex-1 transition-all duration-300">{children}</div>
    </div>
  )
}
