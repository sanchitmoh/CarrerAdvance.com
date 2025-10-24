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
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  LogIn,
  Briefcase,
  UserSearch,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"

// Stats will be calculated dynamically from API data

// Users data is now fetched from API

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-700 text-white"
    case "suspended":
      return "bg-red-100 text-white"
    case "pending":
      return "bg-yellow-100 text-white"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "bg-purple-600 text-white"
    case "teacher":
      return "bg-blue-600 text-white"
    case "student":
      return "bg-green-600 text-white"
    case "employer":
      return "bg-orange-600 text-white"
    case "job-seeker":
      return "bg-red-600 text-white"
    default:
      return "bg-gray-600 text-white"
  }
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [usersData, setUsersData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [suspendingUsers, setSuspendingUsers] = useState<Set<string>>(new Set())
  const [loggingInUsers, setLoggingInUsers] = useState<Set<string>>(new Set())
  const [redirectingUser, setRedirectingUser] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isTablet, setIsTablet] = useState(false)
  const itemsPerPage = 10

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/admin/users/list')
        const result = await response.json()
        
        if (result.success) {
          setUsersData(result.data)
        } else {
          console.error('Failed to fetch users:', result)
          setUsersData([])
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsersData([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

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
    if (activeTab === "students") return matchesSearch && user.type === "student"
    if (activeTab === "employers") return matchesSearch && user.type === "employer"
    if (activeTab === "job-seekers") return matchesSearch && user.type === "jobseeker"

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

  const handleViewProfile = (user: any) => {
    setSelectedUser(user)
    setIsProfileDialogOpen(true)
  }

  const handleSuspendUser = async (user: any) => {
    const userKey = `${user.type}-${user.id}`
    
    // Check if already suspending this user
    if (suspendingUsers.has(userKey)) {
      return
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to suspend ${user.name}? This will deactivate their account.`
    )

    if (!confirmed) {
      return
    }

    // Add to suspending set
    setSuspendingUsers(prev => new Set(prev).add(userKey))

    try {
      console.log('Suspending user:', user)
      console.log('User type:', user.type)
      console.log('User id:', user.id)
      
      // Check if user has required fields
      if (!user.id) {
        alert('Error: User ID is missing. Cannot suspend user.')
        return
      }
      
      const requestBody = {
        type: user.type,
        id: user.id,
      }
      
      console.log('Request body:', requestBody)
      
      const response = await fetch('/api/admin/users/suspend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      if (result.success) {
        // Update the user status in the local state
        setUsersData(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id && u.type === user.type 
              ? { ...u, status: 'Deactive' }
              : u
          )
        )
        console.log('User suspended successfully:', result)
        alert(`${user.name} has been suspended successfully.`)
      } else {
        console.error('Failed to suspend user:', result.message)
        alert(`Failed to suspend user: ${result.message}`)
      }
    } catch (error) {
      console.error('Error suspending user:', error)
      alert('An error occurred while suspending the user.')
    } finally {
      // Remove from suspending set
      setSuspendingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userKey)
        return newSet
      })
    }
  }

  const handleUserLogin = async (user: any) => {
    const userKey = `${user.type}-${user.id}`
    if (loggingInUsers.has(userKey)) {
      return
    }

    setSelectedUser(user)
    setIsLoginDialogOpen(true)
  }

  const handleConfirmLogin = async () => {
    if (!selectedUser) return

    const userKey = `${selectedUser.type}-${selectedUser.id}`
    if (loggingInUsers.has(userKey)) {
      return
    }

    setLoggingInUsers(prev => new Set(prev).add(userKey))

    try {
      console.log('Initiating login for user:', selectedUser)
      
      const requestBody = {
        type: selectedUser.type,
        id: selectedUser.id,
        redirect: '/dashboard' // Default redirect after login
      }

      console.log('Login request body:', requestBody)

      const response = await fetch('/api/admin/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log('Login response:', result)

      if (result.success) {
        // Close the dialog
        setIsLoginDialogOpen(false)

        // Show success message
        alert(`Login link generated successfully for ${selectedUser.name}. You will be redirected to their account.`)

        // Show loading state and redirect automatically
        if (result.data && result.data.link) {
          const userKey = `${selectedUser.type}-${selectedUser.id}`
          setRedirectingUser(userKey)
          
          // Show a brief loading state then redirect
          setTimeout(() => {
            window.open(result.data.link, '_blank')
            setRedirectingUser(null)
          }, 2000) // 2 second delay to show the alert and loading
        }
      } else {
        console.error('Failed to generate login link:', result.message)
        alert(`Failed to generate login link: ${result.message}`)
      }
    } catch (error) {
      console.error('Error generating login link:', error)
      alert('An error occurred while generating the login link.')
    } finally {
      setLoggingInUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userKey)
        return newSet
      })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  // Calculate dynamic stats from API data
  const stats = [
    {
      title: "Total Users",
      value: usersData.length.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Students",
      value: usersData.filter(user => user.type === "student" && user.status === "Active").length.toString(),
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Employers",
      value: usersData.filter(user => user.type === "employer" && user.status === "Active").length.toString(),
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Suspended Users",
      value: usersData.filter(user => user.status === "Deactive").length.toString(),
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-emerald-50/30 to-green-50/20">
        <div className="px-2 sm:px-4 lg:px-6 pt-2 sm:pt-4">
          <BackButton />
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-emerald-50/30 to-green-50/20">
      {/* Redirecting Indicator */}
      {redirectingUser && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redirecting to user account...</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 mx-2 sm:mx-4 lg:mx-6 mt-4 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex-1">
            <BackButton />
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
                {currentUsers.map((user, index) => (
                  <Card key={`${user.type}-${user.email}-${index}`} className="p-3 sm:p-4 shadow-sm border border-gray-200">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 font-semibold text-base sm:text-lg">{user.name.charAt(0).toUpperCase()}</span>
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
                            <DropdownMenuItem 
                              onClick={() => handleSuspendUser(user)}
                              disabled={suspendingUsers.has(`${user.type}-${user.id}`)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              {suspendingUsers.has(`${user.type}-${user.id}`) ? 'Suspending...' : 'Suspend User'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUserLogin(user)}
                              disabled={loggingInUsers.has(`${user.type}-${user.id}`)}
                            >
                              <LogIn className="h-4 w-4 mr-2" />
                              {loggingInUsers.has(`${user.type}-${user.id}`) ? 'Generating Login...' : 'User Login'}
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
                          <span className="text-sm font-medium text-gray-600">Type:</span>
                          <span className="text-sm text-gray-900 font-medium capitalize">{user.type}</span>
                        </div>
                      </div>
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
                      <TableHead className="px-3 py-3">Type</TableHead>
                      <TableHead className="px-3 py-3 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user, index) => (
                      <TableRow key={`${user.type}-${user.email}-${index}`}>
                        <TableCell className="px-3 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium">{user.name.charAt(0).toUpperCase()}</span>
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
                        <TableCell className="px-3 py-3 text-sm text-gray-600 capitalize">{user.type}</TableCell>
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
                              <DropdownMenuItem 
                                onClick={() => handleSuspendUser(user)}
                                disabled={suspendingUsers.has(`${user.type}-${user.id}`)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                {suspendingUsers.has(`${user.type}-${user.id}`) ? 'Suspending...' : 'Suspend User'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUserLogin(user)}
                                disabled={loggingInUsers.has(`${user.type}-${user.id}`)}
                              >
                                <LogIn className="h-4 w-4 mr-2" />
                                {loggingInUsers.has(`${user.type}-${user.id}`) ? 'Generating Login...' : 'User Login'}
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
                      <TableHead className="px-4 py-3 hidden xl:table-cell">Type</TableHead>
                      <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user, index) => (
                      <TableRow key={`${user.type}-${user.email}-${index}`}>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-medium">{user.name.charAt(0).toUpperCase()}</span>
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
                        <TableCell className="px-4 py-3 text-sm text-gray-600 hidden xl:table-cell capitalize">
                          {user.type}
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
                              <DropdownMenuItem 
                                onClick={() => handleSuspendUser(user)}
                                disabled={suspendingUsers.has(`${user.type}-${user.id}`)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                {suspendingUsers.has(`${user.type}-${user.id}`) ? 'Suspending...' : 'Suspend User'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUserLogin(user)}
                                disabled={loggingInUsers.has(`${user.type}-${user.id}`)}
                              >
                                <LogIn className="h-4 w-4 mr-2" />
                                {loggingInUsers.has(`${user.type}-${user.id}`) ? 'Generating Login...' : 'User Login'}
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
                  <span className="text-sm sm:text-base text-gray-900">
                    {selectedUser.type === 'employer' 
                      ? (selectedUser.updated_date || 'N/A')
                      : (selectedUser.created_date || 'N/A')
                    }
                  </span>
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
                <Button 
                  onClick={handleConfirmLogin}
                  disabled={selectedUser && loggingInUsers.has(`${selectedUser.type}-${selectedUser.id}`)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 sm:h-12 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {selectedUser && loggingInUsers.has(`${selectedUser.type}-${selectedUser.id}`) ? 'Generating Login...' : 'Login'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}