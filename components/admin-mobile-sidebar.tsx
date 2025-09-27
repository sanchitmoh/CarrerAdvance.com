"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { sidebarItems } from "./AdminSidebar"

export default function AdminMobileSidebar() {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((v) => !v), [])
  const close = useCallback(() => setOpen(false), [])
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <div className="flex items-center py-1">
        <button
          type="button"
          aria-label="Open admin menu"
          onClick={toggle}
          className="inline-flex items-center justify-center rounded-md border bg-background px-2 py-2 text-sm shadow-sm hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={close}
            aria-label="Close admin menu overlay"
            aria-hidden="true"
          />
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-green-600 to-green-800 text-white shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-3 py-3 border-b border-green-500/30">
              <span className="text-sm font-medium">Admin Menu</span>
              <button
                type="button"
                aria-label="Close admin menu"
                onClick={close}
                className="inline-flex items-center rounded-md p-2 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="h-[calc(100%-49px)] overflow-y-auto py-3">
              <div className="space-y-2 px-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={cn(
                        "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative",
                        isActive
                          ? "bg-white/20 text-white shadow-md"
                          : "text-green-100 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-green-200")} />
                      <span className="ml-3 whitespace-nowrap overflow-hidden">{item.title}</span>
                      {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
