import type React from "react"
import { AdminSidebar } from "@/components/AdminSidebar"
import AdminMobileSidebar from "@/components/admin-mobile-sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sidebar-container flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="main-content flex-1 pt-0 transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <AdminMobileSidebar />
        </div>

        <div className="admin-content px-4 sm:px-6 lg:px-8 py-6 md:py-8 h-full overflow-x-hidden min-w-0 max-w-screen-xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
