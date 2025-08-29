"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Ban,
  LogIn,
  Briefcase,
  UserSearch,
} from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "4",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Active Students",
    value: "1",
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Active Teachers",
    value: "0",
    icon: UserCheck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Suspended Users",
    value: "0",
    icon: UserX,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
]

const users = [
  {
    id: 1,
    name: "Karan Kamble",
    email: "karankamble@gmail.com",
    role: "Student",
    status: "Active",
    joinDate: "8/23/2025",
    lastActive: "8/23/2025",
    stats: "0 enrolled\n0 completed",
    avatar: "K",
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@careeradvance.com",
    role: "Admin",
    status: "Active",
    joinDate: "8/23/2025",
    lastActive: "8/23/2025",
    stats: "",
    avatar: "A",
  },
  {
    id: 3,
    name: "John Employer",
    email: "john@company.com",
    role: "Employer",
    status: "Active",
    joinDate: "8/20/2025",
    lastActive: "8/22/2025",
    stats: "3 jobs posted\n12 applications",
    avatar: "J",
  },
  {
    id: 4,
    name: "Sarah Seeker",
    email: "sarah@email.com",
    role: "Job-Seeker",
    status: "Active",
    joinDate: "8/18/2025",
    lastActive: "8/23/2025",
    stats: "5 applications\n2 interviews",
    avatar: "S",
  },
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800"
    case "suspended":
      return "bg-red-100 text-red-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-purple-100 text-purple-800"
    case "teacher":
      return "bg-blue-100 text-blue-800"
    case "student":
      return "bg-green-100 text-green-800"
    case "employer":
      return "bg-orange-100 text-orange-800"
    case "job-seeker":
      return "bg-cyan-100 text-cyan-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [usersData, setUsersData] = useState(users)

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "students") return matchesSearch && user.role.toLowerCase() === "student"
    if (activeTab === "employers") return matchesSearch && user.role.toLowerCase() === "employer"
    if (activeTab === "job-seekers") return matchesSearch && user.role.toLowerCase() === "job-seeker"

    return matchesSearch
  })

  const tabs = [
    { id: "all", label: "All Users", icon: Users },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "employers", label: "Employers", icon: Briefcase },
    { id: "job-seekers", label: "Job-Seekers", icon: UserSearch },
  ]

  const handleViewProfile = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setIsProfileDialogOpen(true)
  }

  const handleSuspendUser = (userId: number) => {
    setUsersData((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleUserLogin = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setIsLoginDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage and monitor all platform users</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Users ({filteredUsers.length})
            </CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-600 font-medium">{user.avatar}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{user.joinDate}</TableCell>
                      <TableCell className="text-sm text-gray-600">{user.lastActive}</TableCell>
                      <TableCell>
                        {user.stats && <div className="text-sm text-gray-600 whitespace-pre-line">{user.stats}</div>}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserLogin(user)}>
                              <LogIn className="h-4 w-4 mr-2" />
                              User Login
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {/* User Avatar and Name */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-xl">{selectedUser.avatar}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Role:</span>
                  <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Joined:</span>
                  <span className="text-sm text-gray-900">{selectedUser.joinDate}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Last Active:</span>
                  <span className="text-sm text-gray-900">{selectedUser.lastActive}</span>
                </div>

                {/* Student-specific fields */}
                {selectedUser.role.toLowerCase() === "student" && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Courses Enrolled:</span>
                      <span className="text-sm text-gray-900">0</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Courses Completed:</span>
                      <span className="text-sm text-gray-900">0</span>
                    </div>
                  </>
                )}
              </div>

              {/* Edit Profile button */}
              <div className="pt-4 border-t">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 font-bold text-xl">{selectedUser.avatar}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Login to {selectedUser.name} Account</h3>
                <p className="text-gray-600 text-sm">
                  You are about to login as {selectedUser.name} ({selectedUser.role})
                </p>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
