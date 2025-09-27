"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function AdminNavbar() {
  const router = useRouter()

  const onLogout = () => {
    // e.g., await supabase.auth.signOut(); then:
    router.push("/admin/logout")
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14 md:h-16">
        {/* Left: Logo + Brand name */}
        <Link href="/admin" className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded bg-foreground/10 shrink-0" aria-hidden="true" />
          <span className="truncate max-w-[56vw] sm:max-w-none text-base font-semibold leading-none">
            CareerAdvance
          </span>
        </Link>

        {/* Right: Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open user menu"
            className="rounded-full p-1.5 md:p-2 hover:bg-accent transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar className="h-9 w-9 md:h-10 md:w-10">
              <AvatarImage src="/admin-avatar.png" alt="Admin profile" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="rounded-2xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default AdminNavbar
