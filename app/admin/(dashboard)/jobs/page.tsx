"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import BackButton from "@/components/back-button"
import Link from "next/link"
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
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("adminJobs") || "[]")
    setJobs(savedJobs)
  }, [])

  const activeJobs = jobs.filter((job) => job.status === "Active")
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0)
  const avgSalary =
    jobs.length > 0
      ? Math.round(
          jobs.reduce((sum, job) => {
            const salaryMatch = job.salary.match(/\$(\d+(?:,\d+)?)/g)
            if (salaryMatch) {
              const salaries = salaryMatch.map((s) => Number.parseInt(s.replace(/[$,]/g, "")))
              return sum + (salaries.length > 1 ? (salaries[0] + salaries[1]) / 2 : salaries[0])
            }
            return sum
          }, 0) / jobs.length,
        )
      : 0

  const stats = [
    { title: "Total Jobs", value: jobs.length.toString(), icon: Briefcase, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Jobs", value: activeJobs.length.toString(), icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Total Applications", value: totalApplications.toString(), icon: Users, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Avg. Salary", value: avgSalary > 0 ? `$${avgSalary.toLocaleString()}` : "$0", icon: DollarSign, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

  const filterTabs = [
    { id: "all", label: "All Jobs", count: jobs.length },
    { id: "active", label: "Active", count: activeJobs.length },
    { id: "pending", label: "Pending", count: jobs.filter((job) => job.status === "Pending").length },
    { id: "expired", label: "Expired", count: jobs.filter((job) => job.status === "Expired").length },
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
      <div className="px-4 sm:px-6 md:px-8 pt-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600">Manage job postings and applications</p>
          </div>
          <Link href="/admin/jobs/add" className="self-stretch sm:self-auto">
            <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto flex items-center justify-center">
              <Plus className="h-4 w-4 mr-2" /> Add Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter} className="w-full sm:w-[180px]">
                <SelectTrigger>
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
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
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

            {/* Jobs Table - visible on md+ */}
            <div className="hidden md:block border rounded-lg overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Job Title</th>
                    <th className="px-4 py-2 text-left">Company</th>
                    <th className="px-4 py-2 text-left">Location</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Salary</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Applications</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        No jobs found
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{job.title}</td>
                        <td className="px-4 py-2">{job.company}</td>
                        <td className="px-4 py-2">{job.location}</td>
                        <td className="px-4 py-2">{job.type}</td>
                        <td className="px-4 py-2">{job.salary}</td>
                        <td className="px-4 py-2">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </td>
                        <td className="px-4 py-2">{job.applications}</td>
                        <td className="px-4 py-2 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="md:hidden space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No jobs found</div>
              ) : (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="shadow-sm hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Building className="h-3 w-3" /> {job.company}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Posted {job.datePosted}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline">{job.type}</Badge>
                        <span className="font-medium">{job.salary}</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {job.applications}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
