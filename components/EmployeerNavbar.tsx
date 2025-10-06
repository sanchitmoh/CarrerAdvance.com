"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getApiUrl, getAssetUrl, getBackendUrl } from "@/lib/api-config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useEmployerLogout } from "@/components/AuthForm"

interface EmployerNavbarProps {
  onMobileMenuToggle: () => void
  isMobileMenuOpen: boolean
}

export default function EmployerNavbar({ onMobileMenuToggle, isMobileMenuOpen }: EmployerNavbarProps) {
  const [notifications] = useState(3)
  const router = useRouter()
  const { logout } = useEmployerLogout()
  const [user, setUser] = useState({
    name: 'Employer',
    email: '',
    avatar: ''
  })

  // Fetch user details for avatar/name
  useEffect(() => {
    const employerId = typeof window !== 'undefined' ? localStorage.getItem('employer_id') : null
  
    if (!employerId) return
    ;(async () => {
      try {
        // Use backend Employer_api to fetch ew_employers.profile_picture reliably
        
        const res = await fetch(getBackendUrl(`/index.php/api/Employer_api/get_profile?employer_id=${employerId}`), {
          credentials: 'include',
        })
       
        const data = await res.json()
        if (data?.success && data?.data?.employer) {
          const p = data.data.employer
          const firstName = p.firstname || ''
          const lastName = p.lastname || ''
          const name = `${firstName} ${lastName}`.trim() || 'Employer'
          const email = p.email || ''
          // Prefer ew_employers.profile_picture
          const avatarPath = p.profile_picture || p.profile_pic || p.avatar || ''
          const avatar = avatarPath ? getAssetUrl(avatarPath) : ''
          setUser({ name, email, avatar })
        }
      } catch (_e) {
        // ignore
        console.error('Navbar fetch error:', _e)
      }
    })()
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/employers/login')


  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onMobileMenuToggle}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo/Title */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Company Dashboard
            </h1>
          </div>
        </div>

        {/* Center - removed search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8" />

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
                         <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                 <Avatar className="h-8 w-8">
                   <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt="User" />
                   <AvatarFallback className="bg-emerald-500 text-white">
                     {user.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'EM'}
                   </AvatarFallback>
                 </Avatar>
               </Button>
             </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/employers/dashboard/profile')} className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search removed */}
    </header>
  )
}
