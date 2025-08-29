import type React from "react"
import { AdminSidebar } from "@/components/AdminSidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-16 transition-all duration-300 ease-in-out">
        <div className="p-6 pt-8 h-full overflow-auto">{children}</div>
      </main>
    </div>
  )
}
