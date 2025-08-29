import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  BookOpen,
  Trophy,
  Target,
  Calendar,
  Search,
  Plus,
  Zap,
  Activity,
  TrendingUp,
  Award,
  FileText,
  Star,
} from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-8 pt-20">
      {/* Welcome Box */}
      <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Alex!</h1>
          <p className="text-gray-700 text-lg">
            Here's what's happening with your career journey today. You're making great progress!
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total XP</p>
                <p className="text-2xl font-bold text-gray-900">2,450</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Applications</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Card */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Take action to advance your career</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/students/resume-builder">
              <Button className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white w-full">
                <FileText className="w-6 h-6 mb-2" />
                Update Resume
              </Button>
            </Link>
            <Link href="/students/job-board">
              <Button className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-full">
                <Search className="w-6 h-6 mb-2" />
                Browse Jobs
              </Button>
            </Link>
            <Link href="/students/goals">
              <Button className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white w-full">
                <Plus className="w-6 h-6 mb-2" />
                Set New Goal
              </Button>
            </Link>
            <Link href="/students/courses">
              <Button className="h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700 text-white w-full">
                <BookOpen className="w-6 h-6 mb-2" />
                Explore Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Trophy className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Completed "JavaScript Fundamentals" course</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Applied to Frontend Developer position at TechCorp</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Set new goal: "Learn React in 30 days"</p>
                  <p className="text-xs text-gray-600">3 days ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Earned "HTML Expert" certificate</p>
                  <p className="text-xs text-gray-600">1 week ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Progress Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Career Progress Overview
              </CardTitle>
              <CardDescription>Track your journey towards your career goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Frontend Development Path</span>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
                <Progress value={75} className="h-3" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Professional Skills</span>
                  <span className="text-sm text-gray-600">60%</span>
                </div>
                <Progress value={60} className="h-3" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Job Readiness</span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Next Milestone</h4>
                <p className="text-sm text-green-700">
                  Complete React course to unlock Advanced Frontend Developer badge
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-l-4 border-green-500 pl-3">
                <p className="font-medium text-sm">Web Dev Workshop</p>
                <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-medium text-sm">Career Fair</p>
                <p className="text-xs text-gray-600">Friday, 10:00 AM</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-3">
                <p className="font-medium text-sm">Study Group</p>
                <p className="text-xs text-gray-600">Next Monday, 6:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
