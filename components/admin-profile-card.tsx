"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface AdminData {
  id: number
  username: string
  firstname: string
  lastname: string
  email: string
  mobile_no: string
  address: string
  resume: string
  role: number
  is_active: number
  is_verify: number
  is_admin: number
  last_ip: string
  created_at: string
  updated_at: string
}

interface AdminProfileCardProps {
  adminId?: string | number
}

export default function AdminProfileCard({ adminId }: AdminProfileCardProps) {
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        // Build URL with admin_id parameter if provided
        const url = adminId 
          ? `/api/admin/profile/get_profile?admin_id=${encodeURIComponent(adminId)}`
          : '/api/admin/profile/get_profile'
        
        console.log('Fetching admin profile with URL:', url)
        const response = await fetch(url)
        const data = await response.json()
        
        console.log('API Response:', data)
        console.log('Response success:', data.success)
        console.log('Response data:', data.data)
        
        if (data.success && data.data) {
          console.log('Setting admin data:', data.data)
          setAdmin(data.data)
          setError(null) // Clear any previous errors
        } else {
          console.log('API returned error:', data.message)
          setError(data.message || 'Failed to fetch admin profile')
          setAdmin(null) // Clear admin data on error
        }
      } catch (err) {
        setError('Failed to fetch admin profile')
        console.error('Error fetching admin profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminProfile()
  }, [adminId])

  // Debug effect to track admin state changes
  useEffect(() => {
    console.log('Admin state changed:', admin)
  }, [admin])

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!admin) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <p>No admin data found</p>
            <p className="text-xs mt-2">Loading: {loading ? 'Yes' : 'No'}</p>
            <p className="text-xs">Error: {error || 'None'}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log('Rendering component with admin data:', admin)
  console.log('Loading state:', loading)
  console.log('Error state:', error)

  const fullName = `${admin.firstname} ${admin.lastname}`.trim() || admin.username
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase()
  const joinedDate = new Date(admin.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
  const lastUpdated = new Date(admin.updated_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  const roleText = admin.is_admin ? 'Administrator' : 'Staff'
  const statusText = admin.is_active ? 'Active' : 'Inactive'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt={`${fullName} avatar`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-lg leading-tight truncate">{fullName}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Username</dt>
            <dd className="mt-1 text-sm font-medium">{admin.username}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Role</dt>
            <dd className="mt-1 text-sm font-medium">{roleText}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Mobile</dt>
            <dd className="mt-1 text-sm font-medium">{admin.mobile_no || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Account Status</dt>
            <dd className="mt-1 text-sm font-medium">{statusText}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Joined</dt>
            <dd className="mt-1 text-sm font-medium">{joinedDate}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Last Updated</dt>
            <dd className="mt-1 text-sm font-medium">{lastUpdated}</dd>
          </div>
          {admin.address && (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Address</dt>
              <dd className="mt-1 text-sm font-medium">{admin.address}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}