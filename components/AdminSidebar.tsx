"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  BarChart3,
  CreditCard,
  Flag,
  FileText,
  Shield,
  Settings,
  X,
} from "lucide-react"

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: GraduationCap,
  },
  {
    title: "Jobs",
    href: "/admin/jobs",
    icon: Briefcase,
  },
  
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Feature Flags",
    href: "/admin/feature-flags",
    icon: Flag,
  },
  
  {
    title: "Moderation",
    href: "/admin/moderation",
    icon: Shield,
  },
  
]

interface AdminSidebarProps {
  isMobileMenuOpen?: boolean
  onClose?: () => void
}

function AdminSidebar({ isMobileMenuOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex-col items-center py-4 z-20">
        {/* Logo */}
       

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col space-y-5 mt-24">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
                  isActive ? "bg-green-100 text-green-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
                title={item.title}
              >
                <Icon className="w-5 h-5" />

                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.title}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      <div
        className={cn(
          "lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CA</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">CareerAdvance Admin</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors",
                  isActive ? "bg-green-100 text-green-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export { AdminSidebar }