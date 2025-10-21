"use client"

import { useState, useEffect } from "react"
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
  // Adding more sample data to demonstrate pagination
  {
    id: 5,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Student",
    status: "Active",
    joinDate: "8/15/2025",
    lastActive: "8/22/2025",
    stats: "2 enrolled\n1 completed",
    avatar: "M",
  },
  {
    id: 6,
    name: "Emily Chen",
    email: "emily@company.com",
    role: "Employer",
    status: "Active",
    joinDate: "8/10/2025",
    lastActive: "8/21/2025",
    stats: "5 jobs posted\n20 applications",
    avatar: "E",
  },
  {
    id: 7,
    name: "David Wilson",
    email: "david@email.com",
    role: "Job-Seeker",
    status: "Active",
    joinDate: "8/12/2025",
    lastActive: "8/23/2025",
    stats: "8 applications\n3 interviews",
    avatar: "D",
  },
  {
    id: 8,
    name: "Lisa Brown",
    email: "lisa@example.com",
    role: "Student",
    status: "Active",
    joinDate: "8/08/2025",
    lastActive: "8/20/2025",
    stats: "1 enrolled\n0 completed",
    avatar: "L",
  },
  {
    id: 9,
    name: "Robert Taylor",
    email: "robert@company.com",
    role: "Employer",
    status: "Active",
    joinDate: "8/05/2025",
    lastActive: "8/19/2025",
    stats: "7 jobs posted\n15 applications",
    avatar: "R",
  },
  {
    id: 10,
    name: "Maria Garcia",
    email: "maria@email.com",
    role: "Job-Seeker",
    status: "Active",
    joinDate: "8/01/2025",
    lastActive: "8/18/2025",
    stats: "6 applications\n1 interview",
    avatar: "M",
  },
  {
    id: 11,
    name: "James Miller",
    email: "james@example.com",
    role: "Student",
    status: "Active",
    joinDate: "7/28/2025",
    lastActive: "8/17/2025",
    stats: "3 enrolled\n2 completed",
    avatar: "J",
  },
  {
    id: 12,
    name: "Sarah Davis",
    email: "sarah.d@company.com",
    role: "Employer",
    status: "Active",
    joinDate: "7/25/2025",
    lastActive: "8/16/2025",
    stats: "4 jobs posted\n18 applications",
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
  const [currentPage, setCurrentPage] = useState(1)
  const [isTablet, setIsTablet] = useState(false)
  const itemsPerPage = 10

  // Detect tablet screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

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
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

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
    // Reset to first page if current page becomes empty
    if (currentUsers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleUserLogin = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setIsLoginDialogOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-emerald-50/30 to-green-50/20">
      <div className="px-2 sm:px-4 lg:px-6 pt-2 sm:pt-4">
        <BackButton />
      </div>

      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 mx-2 sm:mx-4 lg:mx-6 mt-4 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">User Management</h1>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg">Manage and monitor all platform users</p>
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Stats Cards - Adjusted for tablet */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm md:text-base h-11 md:h-12"
                />
              </div>
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                        : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border-gray-200"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden xs:inline">{tab.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="p-3 sm:p-4 md:p-6 border-b border-gray-100">
            <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl text-gray-900">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-emerald-600" />
              Users ({filteredUsers.length})
            </CardTitle>
            <CardDescription className="text-sm md:text-base text-gray-600">
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile View - up to md */}
            <div className="block md:hidden">
              <div className="space-y-3 sm:space-y-4 p-2 sm:p-3 md:p-4">
                {currentUsers.map((user) => (
                  <Card key={user.id} className="p-3 sm:p-4 shadow-sm border border-gray-200">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-semibold text-base sm:text-lg">{user.avatar}</span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1">
                            <div className="font-semibold text-gray-900 text-base sm:text-lg mb-1 truncate">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-600 truncate">{user.email}</div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-[9999]">
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
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${getRoleColor(user.role)} px-2 py-1 text-xs font-medium`}>
                          {user.role}
                        </Badge>
                        <Badge className={`${getStatusColor(user.status)} px-2 py-1 text-xs font-medium`}>
                          {user.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Joined:</span>
                          <span className="text-sm text-gray-900 font-medium">{user.joinDate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Last Active:</span>
                          <span className="text-sm text-gray-900 font-medium">{user.lastActive}</span>
                        </div>
                      </div>

                      {user.stats && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="text-sm font-semibold text-gray-700 mb-2">Activity Stats</div>
                          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{user.stats}</div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tablet View - md to lg */}
            <div className="hidden md:block lg:hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-3 py-3">User</TableHead>
                      <TableHead className="px-3 py-3">Role</TableHead>
                      <TableHead className="px-3 py-3">Status</TableHead>
                      <TableHead className="px-3 py-3">Join Date</TableHead>
                      <TableHead className="px-3 py-3 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-3 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium">{user.avatar}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate max-w-[120px]">{user.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[140px]">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </TableCell>
                        <TableCell className="px-3 py-3">
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="px-3 py-3 text-sm text-gray-600">{user.joinDate}</TableCell>
                        <TableCell className="px-3 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[9999]">
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
            </div>

            {/* Desktop View - lg and above */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 py-3">User</TableHead>
                      <TableHead className="px-4 py-3">Role</TableHead>
                      <TableHead className="px-4 py-3">Status</TableHead>
                      <TableHead className="px-4 py-3 hidden xl:table-cell">Join Date</TableHead>
                      <TableHead className="px-4 py-3 hidden xl:table-cell">Last Active</TableHead>
                      <TableHead className="px-4 py-3 hidden 2xl:table-cell">Stats</TableHead>
                      <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium">{user.avatar}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{user.name}</div>
                              <div className="text-sm text-gray-500 break-words">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-600 hidden xl:table-cell">
                          {user.joinDate}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-600 hidden xl:table-cell">
                          {user.lastActive}
                        </TableCell>
                        <TableCell className="px-4 py-3 hidden 2xl:table-cell">
                          {user.stats && <div className="text-sm text-gray-600 whitespace-pre-line">{user.stats}</div>}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[9999]">
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
            </div>

            {/* Pagination - Enhanced for tablet */}
            {filteredUsers.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 border-t border-gray-100">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 h-9 px-3"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`h-9 w-9 p-0 hidden sm:inline-flex ${
                          currentPage === page
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                            : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border-gray-200"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  {/* Mobile page indicator */}
                  <div className="sm:hidden text-sm font-medium px-3">
                    Page {currentPage} of {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 h-9 px-3"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 sm:space-y-6">
              {/* User Avatar and Name */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-xl sm:text-2xl">{selectedUser.avatar}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{selectedUser.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base truncate">{selectedUser.email}</p>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-medium text-gray-600">Role:</span>
                  <Badge className={`${getRoleColor(selectedUser.role)} text-sm`}>{selectedUser.role}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-medium text-gray-600">Status:</span>
                  <Badge className={`${getStatusColor(selectedUser.status)} text-sm`}>{selectedUser.status}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-medium text-gray-600">Joined:</span>
                  <span className="text-sm sm:text-base text-gray-900">{selectedUser.joinDate}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-medium text-gray-600">Last Active:</span>
                  <span className="text-sm sm:text-base text-gray-900">{selectedUser.lastActive}</span>
                </div>

                {/* Student-specific fields */}
                {selectedUser.role.toLowerCase() === "student" && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-medium text-gray-600">Courses Enrolled:</span>
                      <span className="text-sm sm:text-base text-gray-900">0</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-medium text-gray-600">Courses Completed:</span>
                      <span className="text-sm sm:text-base text-gray-900">0</span>
                    </div>
                  </>
                )}
              </div>

              {/* Edit Profile button */}
              <div className="pt-4 sm:pt-6 border-t">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 sm:h-12 text-sm sm:text-base">
                  <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Login Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="max-w-md md:max-w-lg mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Admin Login</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 font-bold text-xl sm:text-2xl">{selectedUser.avatar}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Login to {selectedUser.name} Account</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  You are about to login as {selectedUser.name} ({selectedUser.role})
                </p>
              </div>

              <div className="pt-4 sm:pt-6">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 sm:h-12 text-sm sm:text-base">
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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