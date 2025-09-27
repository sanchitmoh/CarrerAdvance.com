
import AdminProfileCard from "@/components/admin-profile-card"

export default function AdminProfilePage() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Admin Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your admin profile details here.</p>
      </div>

      <AdminProfileCard />
    </div>
  )
}
