"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Zap } from "lucide-react"

export default function AdminTopbar() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/admin/logout")
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 md:h-16">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Left: Logo + Name */}
          <Link href="/admin" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 flex items-center justify-center shadow-md shrink-0">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="block max-w-[56vw] truncate sm:max-w-none font-semibold text-gray-900 leading-none">
              CareerAdvance
            </span>
          </Link>

          {/* Right: Avatar menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Open admin menu"
                className="rounded-full p-1.5 md:p-2 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 transition-colors"
              >
                <Avatar className="h-9 w-9 md:h-10 md:w-10 ring-2 ring-emerald-500/20">
                  <AvatarImage src="/admin-avatar.png" alt="Admin avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-xl"
            >
              {/* Profile -> admin profile page */}
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-emerald-50"
                >
                  <User className="h-4 w-4 text-emerald-600" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              {/* Settings -> direct to the settings page */}
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-emerald-50"
                >
                  <Settings className="h-4 w-4 text-emerald-600" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2" />

              {/* Logout -> take to admin login page (via /admin/logout route) */}
              <DropdownMenuItem
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-red-50 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
