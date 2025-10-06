"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, Shield } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"

const userRoles = [
  { name: "Admin", path: "/admin", icon: "⚡", color: "from-green-700 to-teal-700" },
  { name: "Companies", path: "/employers", icon: "💼", color: "from-lime-500 to-lime-600" },
  { name: "Job Seekers", path: "/job-seekers", icon: "🔍", color: "from-emerald-700 to-green-700" },
  { name: "Teachers", path: "/teachers", icon: "🎓", color: "from-emerald-500 to-emerald-600" },
  { name: "Students", path: "/students", icon: "📚", color: "from-green-500 to-green-600" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [homeOpen, setHomeOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  const links = ["Home", "Courses", "Blogs", "Jobs"]

  const showPopoverBehavior =
    pathname === "/" ||
    [
      "/jobs",
      "/blogs",
      "/courses",
      "/certifications",
      "/assessments",
      "/learning-paths",
      "/webinars",
      "/about",
      "/team",
      "/careers",
      "/press",
      "/contact",
      "/post-job",
      "/candidates",
      "/employer-dashboard",
      "/pricing",
      "/success-stories",
      "/register",
      "/resume-builder",
      "/career-advice",
      "/salary-guide",
      "/privacy",
      "/terms",
      "/cookies",
      "/accessibility",
      "/admin/register",
    ].some((prefix) => pathname?.startsWith(prefix))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => setMounted(true), [])

  const handleRoleNav = (e: React.MouseEvent, roleName: string, href: string) => {
    if (roleName === "Students" || roleName === "Teachers") {
      e.preventDefault()
      toast({
        title: "Coming soon",
        description: `${roleName} portal is launching shortly. Stay tuned! ✨`,
      })
    }
  }

  return (
    <nav
      className={`fixed w-full z-[9998] transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
          : "bg-white/80 backdrop-blur-sm"
      } animate-slide-down`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* ✅ LOGO SECTION */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/logo.png"
              alt="CareerAdvance Logo"
              className="h-16 w-48 sm:h-20 sm:w-72 object-contain transition-transform duration-300 hover:scale-105 active:scale-95"
            />
          </Link>

          {/* ✅ DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center space-x-8">
            {links.map((item, index) => (
              <div
                key={item}
                className="opacity-0 translate-y-[-20px] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
              >
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group text-lg"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              </div>
            ))}

            {/* ✅ LOGIN DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 font-medium hover:bg-emerald-50 hover:text-emerald-600 rounded-xl px-4 py-2 text-lg">
                  <span>Login</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-3 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl">
                <div className="grid grid-cols-1 gap-2">
                  {userRoles.map((role) => (
                    <DropdownMenuItem key={role.name} asChild>
                      <Link
                        href={
                          role.name === "Students" || role.name === "Teachers"
                            ? "#"
                            : `${role.path}/login`
                        }
                        onClick={(e) =>
                          handleRoleNav(e, role.name, `${role.path}/login`)
                        }
                        className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 group"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <span className="text-lg">{role.icon}</span>
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {role.name}
                          </span>
                          <div className="text-xs text-gray-500">Access your dashboard</div>
                        </div>
                        {role.name === "Admin" && <Shield className="h-4 w-4 text-orange-500" />}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ✅ CTA BUTTONS */}
            <div className="flex items-center space-x-3 opacity-0 scale-80 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <Link href="/employers/login">
                <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:scale-105 rounded-xl px-6 py-2.5 font-semibold">
                  Post Job
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" className="border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 font-semibold rounded-xl px-6 py-2.5">
                  Find Jobs
                </Button>
              </Link>
            </div>
          </div>

          {/* ✅ MOBILE MENU BUTTON */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((v) => !v)}
              className="relative z-[9999] rounded-xl p-2 sm:p-3"
            >
              {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}