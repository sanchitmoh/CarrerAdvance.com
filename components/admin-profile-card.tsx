import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminProfileCard() {
  // In a future step, wire these to real data (e.g., Supabase/Auth.js)
  const admin = {
    name: "Alex Johnson",
    email: "admin@careeradvance.com",
    role: "Administrator",
    joined: "Jan 12, 2024",
    lastLogin: "Sep 3, 2025, 10:15 AM",
    avatar: "/admin-avatar.png",
    initials: "AJ",
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={`${admin.name} avatar`} />
            <AvatarFallback>{admin.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-lg leading-tight truncate">{admin.name}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Role</dt>
            <dd className="mt-1 text-sm font-medium">{admin.role}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Joined</dt>
            <dd className="mt-1 text-sm font-medium">{admin.joined}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Last Login</dt>
            <dd className="mt-1 text-sm font-medium">{admin.lastLogin}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Account Status</dt>
            <dd className="mt-1 text-sm font-medium">Active</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
