"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export default function EmployerDashboardPage() {
  // Sample data
  const [stats] = useState({
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 156,
    interviewsScheduled: 7,
    candidatesHired: 3,
    profileViews: 1240,
  })

  const [recentApplications] = useState([
    {
      id: 1,
      candidateName: "Sarah Johnson",
      position: "Senior Frontend Developer",
      appliedDate: "2024-01-20",
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      position: "Product Manager",
      appliedDate: "2024-01-20",
      status: "reviewed",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Seattle, WA",
    },
    {
      id: 3,
      candidateName: "Emily Davis",
      position: "UX Designer",
      appliedDate: "2024-01-19",
      status: "shortlisted",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Austin, TX",
    },
    {
      id: 4,
      candidateName: "David Wilson",
      position: "Backend Developer",
      appliedDate: "2024-01-19",
      status: "rejected",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "New York, NY",
    },
  ])

  const [upcomingInterviews] = useState([
    {
      id: 1,
      candidateName: "Sarah Johnson",
      position: "Senior Frontend Developer",
      date: "2024-01-22",
      time: "10:00 AM",
      type: "video",
      interviewer: "John Doe",
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      position: "Product Manager",
      date: "2024-01-22",
      time: "2:00 PM",
      type: "phone",
      interviewer: "Jane Smith",
    },
    {
      id: 3,
      candidateName: "Emily Davis",
      position: "UX Designer",
      date: "2024-01-23",
      time: "11:00 AM",
      type: "in-person",
      interviewer: "Bob Wilson",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "reviewed":
        return <Eye className="h-4 w-4" />
      case "shortlisted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-emerald-100">Here's what's happening with your recruitment today</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link href="/employers/dashboard/jobs">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                <p className="text-sm text-gray-600">Total Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewsScheduled}</p>
                <p className="text-sm text-gray-600">Interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.candidatesHired}</p>
                <p className="text-sm text-gray-600">Hired</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span>Recent Applications</span>
            </CardTitle>
            <Link href="/employers/dashboard/jobs">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={application.avatar || "/placeholder.svg"} alt={application.candidateName} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-600">
                    {application.candidateName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{application.candidateName}</p>
                  <p className="text-sm text-gray-600 truncate">{application.position}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{application.location}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(application.status)} flex items-center space-x-1`}
                >
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{application.status}</span>
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <span>Upcoming Interviews</span>
            </CardTitle>
            <Link href="/employers/dashboard/interviews">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{interview.candidateName}</p>
                  <p className="text-sm text-gray-600 truncate">{interview.position}</p>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                    <span>{new Date(interview.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{interview.time}</span>
                    <span>•</span>
                    <span className="capitalize">{interview.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Interviewer</p>
                  <p className="text-sm font-medium text-gray-900">{interview.interviewer}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/employers/dashboard/jobs">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-emerald-50 hover:border-emerald-300 bg-transparent"
              >
                <Plus className="h-6 w-6 text-emerald-600" />
                <span>Post New Job</span>
              </Button>
            </Link>
            <Link href="/employers/dashboard/interviews">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
              >
                <Calendar className="h-6 w-6 text-blue-600" />
                <span>Schedule Interview</span>
              </Button>
            </Link>
            <Link href="/employers/dashboard/jobs">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
              >
                <Users className="h-6 w-6 text-purple-600" />
                <span>View Candidates</span>
              </Button>
            </Link>
            <Link href="/employers/dashboard/profile">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
              >
                <TrendingUp className="h-6 w-6 text-orange-600" />
                <span>Company Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
