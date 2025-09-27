"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear any local session state here if you add real auth later.
    const timeout = setTimeout(() => {
      router.replace("/admin/login")
    }, 700)
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
      <div className="rounded-xl border bg-white p-6 text-center">
        <p className="text-gray-700">Logging out...</p>
      </div>
    </main>
  )
}
