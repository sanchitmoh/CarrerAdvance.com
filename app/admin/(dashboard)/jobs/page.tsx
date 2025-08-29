"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Briefcase,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Building,
  MapPin,
  Clock,
} from "lucide-react"

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  status: "Active" | "Pending" | "Expired"
  applications: number
  datePosted: string
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Sample jobs data - empty initially as per requirements
  const [jobs] = useState<Job[]>([])

  const stats = [
    {
      title: "Total Jobs",
      value: "0",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Jobs",
      value: "0",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Applications",
      value: "0",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg. Salary",
      value: "$0",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const filterTabs = [
    { id: "all", label: "All Jobs", count: 0 },
    { id: "active", label: "Active", count: 0 },
    { id: "pending", label: "Pending", count: 0 },
    { id: "expired", label: "Expired", count: 0 },
  ]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || job.status.toLowerCase() === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
              <p className="text-gray-600">Manage job postings and applications</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Job
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

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label} ({tab.count})
                </Button>
              ))}
            </div>

            {/* Jobs Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Briefcase className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Jobs (0)</h3>
                            <p className="text-gray-500 mt-1">Manage job postings and monitor applications</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{job.title}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Posted {job.datePosted}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{job.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{job.salary}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{job.applications}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Job
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Job
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
