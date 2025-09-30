"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import BackButton from "@/components/back-button"
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Sample stats and users data (same as your original)
const stats = [
  { title: "Total Users", value: "4", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
  { title: "Active Students", value: "1", icon: GraduationCap, color: "text-green-600", bgColor: "bg-green-50" },
  { title: "Active Teachers", value: "0", icon: UserCheck, color: "text-purple-600", bgColor: "bg-purple-50" },
  { title: "Suspended Users", value: "0", icon: UserX, color: "text-red-600", bgColor: "bg-red-50" },
]

const users = [
  { id: 1, name: "Karan Kamble", email: "karankamble@gmail.com", role: "Student", status: "Active", joinDate: "8/23/2025", lastActive: "8/23/2025", stats: "0 enrolled\n0 completed", avatar: "K" },
  { id: 2, name: "Admin User", email: "admin@careeradvance.com", role: "Admin", status: "Active", joinDate: "8/23/2025", lastActive: "8/23/2025", stats: "", avatar: "A" },
  { id: 3, name: "John Employer", email: "john@company.com", role: "Employer", status: "Active", joinDate: "8/20/2025", lastActive: "8/22/2025", stats: "3 jobs posted\n12 applications", avatar: "J" },
  { id: 4, name: "Sarah Seeker", email: "sarah@email.com", role: "Job-Seeker", status: "Active", joinDate: "8/18/2025", lastActive: "8/23/2025", stats: "5 applications\n2 interviews", avatar: "S" },
  // Adding more sample data to demonstrate pagination
  { id: 5, name: "Mike Johnson", email: "mike@email.com", role: "Student", status: "Active", joinDate: "8/17/2025", lastActive: "8/22/2025", stats: "2 enrolled\n1 completed", avatar: "M" },
  { id: 6, name: "Emily Davis", email: "emily@email.com", role: "Employer", status: "Active", joinDate: "8/16/2025", lastActive: "8/21/2025", stats: "5 jobs posted\n20 applications", avatar: "E" },
  { id: 7, name: "Chris Wilson", email: "chris@email.com", role: "Job-Seeker", status: "Active", joinDate: "8/15/2025", lastActive: "8/20/2025", stats: "3 applications\n1 interview", avatar: "C" },
  { id: 8, name: "Lisa Brown", email: "lisa@email.com", role: "Student", status: "Active", joinDate: "8/14/2025", lastActive: "8/19/2025", stats: "1 enrolled\n0 completed", avatar: "L" },
  { id: 9, name: "David Miller", email: "david@email.com", role: "Employer", status: "Active", joinDate: "8/13/2025", lastActive: "8/18/2025", stats: "2 jobs posted\n8 applications", avatar: "D" },
  { id: 10, name: "Anna Taylor", email: "anna@email.com", role: "Job-Seeker", status: "Active", joinDate: "8/12/2025", lastActive: "8/17/2025", stats: "4 applications\n0 interviews", avatar: "A" },
  { id: 11, name: "Robert Clark", email: "robert@email.com", role: "Student", status: "Active", joinDate: "8/11/2025", lastActive: "8/16/2025", stats: "0 enrolled\n0 completed", avatar: "R" },
  { id: 12, name: "Maria Garcia", email: "maria@email.com", role: "Employer", status: "Active", joinDate: "8/10/2025", lastActive: "8/15/2025", stats: "7 jobs posted\n25 applications", avatar: "M" },
]

// Badge colors
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active": return "bg-green-100 text-green-800"
    case "suspended": return "bg-red-100 text-red-800"
    case "pending": return "bg-yellow-100 text-yellow-800"
    default: return "bg-gray-100 text-gray-800"
  }
}
const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin": return "bg-purple-100 text-purple-800"
    case "teacher": return "bg-blue-100 text-blue-800"
    case "student": return "bg-green-100 text-green-800"
    case "employer": return "bg-orange-100 text-orange-800"
    case "job-seeker": return "bg-cyan-100 text-cyan-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [usersData, setUsersData] = useState(users)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  const tabs = [
    { id: "all", label: "All Users", icon: Users },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "employers", label: "Employers", icon: Briefcase },
    { id: "job-seekers", label: "Job-Seekers", icon: UserSearch },
  ]

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const handleViewProfile = (user: (typeof users)[0]) => { setSelectedUser(user); setIsProfileDialogOpen(true) }
  const handleSuspendUser = (userId: number) => { setUsersData((prev) => prev.filter((user) => user.id !== userId)) }
  const handleUserLogin = (user: (typeof users)[0]) => { setSelectedUser(user); setIsLoginDialogOpen(true) }

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Reset to first page when search or filter changes
  useState(() => {
    setCurrentPage(1)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 pt-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage and monitor all platform users</p>
          </div>
          <Link href="/admin/users/add">
            <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto text-sm sm:text-base">
              <Plus className="h-4 w-4 mr-2" /> Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex justify-between items-center p-4 sm:p-6">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs & Search */}
      <Card className="p-4 sm:p-6 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => {
                setActiveTab(tab.id)
                setCurrentPage(1) // Reset to first page when tab changes
              }}
              className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>

        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page when search changes
            }}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users List */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Results count */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </p>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {currentUsers.map((user) => (
            <Card key={user.id} className="p-4 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">{user.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-sm text-gray-500 break-words">{user.email}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                      <Eye className="h-4 w-4 mr-2" /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                      <Ban className="h-4 w-4 mr-2" /> Suspend User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUserLogin(user)}>
                      <LogIn className="h-4 w-4 mr-2" /> User Login
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={`${getRoleColor(user.role)} px-2 py-1 text-xs`}>{user.role}</Badge>
                <Badge className={`${getStatusColor(user.status)} px-2 py-1 text-xs`}>{user.status}</Badge>
              </div>
              {user.stats && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{user.stats}</p>}
            </Card>
          ))}
        </div>

        {/* Desktop/Table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                <TableHead className="hidden xl:table-cell">Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium">{user.avatar}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{user.name}</div>
                        <div className="text-sm text-gray-500 break-words">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className={getRoleColor(user.role)}>{user.role}</Badge></TableCell>
                  <TableCell><Badge className={getStatusColor(user.status)}>{user.status}</Badge></TableCell>
                  <TableCell className="hidden lg:table-cell">{user.joinDate}</TableCell>
                  <TableCell className="hidden lg:table-cell">{user.lastActive}</TableCell>
                  <TableCell className="hidden xl:table-cell">{user.stats && <div className="whitespace-pre-line">{user.stats}</div>}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(user)}>
                          <Eye className="h-4 w-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                          <Ban className="h-4 w-4 mr-2" /> Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUserLogin(user)}>
                          <LogIn className="h-4 w-4 mr-2" /> User Login
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(page)}
                    className={`h-8 w-8 p-0 ${
                      currentPage === page 
                        ? "bg-emerald-600 text-white" 
                        : "hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader><DialogTitle>User Profile</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-xl">{selectedUser.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                  <p className="text-gray-600 text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Role:</span> <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge></div>
                <div className="flex justify-between"><span>Status:</span> <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge></div>
                <div className="flex justify-between"><span>Joined:</span> {selectedUser.joinDate}</div>
                <div className="flex justify-between"><span>Last Active:</span> {selectedUser.lastActive}</div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4"><Edit className="h-4 w-4 mr-2"/> Edit Profile</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader><DialogTitle>Admin Login</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-emerald-600 font-bold text-xl">{selectedUser.avatar}</span>
              </div>
              <p className="font-semibold text-gray-900">Login to {selectedUser.name} Account</p>
              <p className="text-gray-600 text-sm">You are about to login as {selectedUser.name} ({selectedUser.role})</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700"><LogIn className="h-4 w-4 mr-2"/> Login</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}