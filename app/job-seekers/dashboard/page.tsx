"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/back-button"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to profile page by default
    router.replace("/job-seekers/dashboard/profile")
  }, [router])

  return (
    <div className="flex flex-col min-h-[50vh]">
      <div className="p-4">
        <BackButton />
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    </div>
  )
}
