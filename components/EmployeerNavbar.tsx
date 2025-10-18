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
import Image from "next/image"

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
        // Use backend employer profile API to fetch profile data
        
        const res = await fetch(getBackendUrl(`/index.php/api/employer/profile/get_profile?employer_id=${employerId}`), {
          credentials: 'include',
        })
       
        const data = await res.json()
        console.log('Navbar API Response:', data) // Debug log
        if (data?.success && data?.data?.employer) {
          const p = data.data.employer
          const firstName = p.firstname || ''
          const lastName = p.lastname || ''
          const name = `${firstName} ${lastName}`.trim() || 'Employer'
          const email = p.email || ''
          // Use profile_picture or company_logo with proper URL construction
          const avatarPath = p.profile_picture || p.company_logo || ''
          const avatar = avatarPath ? getBackendUrl(`/${avatarPath}`) : ''
          console.log('Avatar construction - Path:', avatarPath, 'Full URL:', avatar)
          setUser({ name, email, avatar })
          console.log('User state set:', { name, email, avatar })
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

  console.log('Navbar render - user state:', user) // Debug log
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 z-100 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onMobileMenuToggle}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo/Title */}
          <div className="flex items-center  ">
            <Image
            src={"/logo1.png"}
            height={200}
            width={200}
            
            alt="CareerAdvance"
            />
          </div>
        </div>

        {/* Center - removed search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8" />

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
        
          {/* User menu */}
          <DropdownMenu>
                         <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                 <Avatar className="h-12 w-12">
                   <AvatarImage 
                     src={user.avatar || "/placeholder.svg?height=32&width=32"} 
                     alt="User"
                     onError={(e) => {
                       console.log('Avatar image failed to load:', user.avatar)
                       e.currentTarget.style.display = 'none'
                     }}
                   />
                   <AvatarFallback className="bg-emerald-500 text-white">
                     {user.name && user.name !== 'Employer' 
                       ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                       : 'EM'
                     }
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