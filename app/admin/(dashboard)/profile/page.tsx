"use client"

import AdminProfileCard from "@/components/admin-profile-card"
import { useSearchParams } from "next/navigation"

export default function AdminProfilePage() {
  const searchParams = useSearchParams()
  const adminId = searchParams.get('admin_id') ?? undefined

  return (
    <div className="space-y-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white ">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-white">Admin Profile</h1>
        <p className="text-sm text-muted-foreground text-white">
          {adminId ? `Viewing profile for Admin ID: ${adminId}` : 'Manage your admin profile details here.'}
        </p>
      </div>

      <AdminProfileCard adminId={adminId} />
    </div>
  )
}