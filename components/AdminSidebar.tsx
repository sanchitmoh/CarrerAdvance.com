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
  User,
} from "lucide-react"

const sidebarItems = [
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
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
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
    title: "System Logs",
    href: "/admin/system-logs",
    icon: FileText,
  },
  {
    title: "Moderation",
    href: "/admin/moderation",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="sidebar-group group fixed left-0 top-0 z-40 h-full w-16 hover:w-64 bg-gradient-to-b from-green-600 to-green-800 transition-all duration-300 ease-in-out shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-green-500/30">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <h2 className="text-lg font-bold text-white whitespace-nowrap">CareerAdvance</h2>
              <p className="text-xs text-green-100 whitespace-nowrap">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2 px-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative",
                    isActive ? "bg-white/20 text-white shadow-md" : "text-green-100 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-green-200")} />
                  <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                    {item.title}
                  </span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-green-500/30">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <p className="text-sm font-medium text-white truncate whitespace-nowrap">Administrator</p>
              <p className="text-xs text-green-100 truncate whitespace-nowrap">admin@careeradvance.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AdminSidebar }
