"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  FileText,
  Mail,
  Briefcase,
  Send,
  Map,
  Target,
  BookOpen,
  Award,
  BarChart3,
  Bell,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/students/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/students/profile",
    icon: User,
  },
  {
    title: "Resume Builder",
    href: "/students/resume-builder",
    icon: FileText,
  },
  {
    title: "Cover Letters",
    href: "/students/cover-letters",
    icon: Mail,
  },
  {
    title: "Job Board",
    href: "/students/job-board",
    icon: Briefcase,
  },
  {
    title: "Applications",
    href: "/students/applications",
    icon: Send,
  },
  {
    title: "Career Roadmap",
    href: "/students/career-roadmap",
    icon: Map,
  },
  {
    title: "Goals & Milestones",
    href: "/students/goals",
    icon: Target,
  },
  {
    title: "Courses",
    href: "/students/courses",
    icon: BookOpen,
  },
  {
    title: "Certificates",
    href: "/students/certificates",
    icon: Award,
  },
  {
    title: "Analytics",
    href: "/students/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/students/notifications",
    icon: Bell,
  },
]

export default function StudentSidebar() {
  const pathname = usePathname()

  return (
    <div className="sidebar-group group fixed left-0 top-0 z-40 h-full w-16 hover:w-64 bg-gradient-to-b from-green-600 to-green-800 transition-all duration-300 ease-in-out shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-4 border-b border-green-500/30">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <h2 className="text-lg font-bold text-white whitespace-nowrap">CareerAdvance</h2>
              <p className="text-xs text-green-100 whitespace-nowrap">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
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

        {/* Footer */}
        <div className="p-4 border-t border-green-500/30">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <p className="text-sm font-medium text-white truncate whitespace-nowrap">Student User</p>
              <p className="text-xs text-green-100 truncate whitespace-nowrap">student@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
