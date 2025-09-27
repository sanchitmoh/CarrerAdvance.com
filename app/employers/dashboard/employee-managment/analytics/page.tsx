"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Clock,
  FileText,
  TrendingUp,
  BarChart3,
  LineChart,
  Award,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"
import BackButton from "@/components/back-button"
import { useState } from "react"

interface EmployeePerformance {
  emp_id: string
  emp_name: string
  email: string
  designation: string
  department: string
  performance_score: number
  attendance_rate: number
  tasks_completed: number
  projects_handled: number
  efficiency_rating: number
  last_review_date: string
  image: string
  work_status: "active" | "left"
  joining_date: string
  salary: string
}

const employeeData: EmployeePerformance[] = [
  {
    emp_id: "EMP001",
    emp_name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    designation: "Senior Software Engineer",
    department: "Engineering",
    performance_score: 4.8,
    attendance_rate: 96.5,
    tasks_completed: 45,
    projects_handled: 3,
    efficiency_rating: 4.7,
    last_review_date: "2024-01-15",
    image: "/placeholder.svg?height=40&width=40",
    work_status: "active",
    joining_date: "2022-03-15",
    salary: "$85,000",
  },
  {
    emp_id: "EMP002",
    emp_name: "Michael Chen",
    email: "michael.chen@company.com",
    designation: "Marketing Manager",
    department: "Marketing",
    performance_score: 4.2,
    attendance_rate: 92.3,
    tasks_completed: 38,
    projects_handled: 5,
    efficiency_rating: 4.1,
    last_review_date: "2024-01-10",
    image: "/placeholder.svg?height=40&width=40",
    work_status: "active",
    joining_date: "2021-08-20",
    salary: "$72,000",
  },
  {
    emp_id: "EMP003",
    emp_name: "Emily Davis",
    email: "emily.davis@company.com",
    designation: "UX Designer",
    department: "Design",
    performance_score: 4.6,
    attendance_rate: 94.8,
    tasks_completed: 42,
    projects_handled: 4,
    efficiency_rating: 4.5,
    last_review_date: "2024-01-12",
    image: "/placeholder.svg?height=40&width=40",
    work_status: "active",
    joining_date: "2023-01-10",
    salary: "$68,000",
  },
  {
    emp_id: "EMP004",
    emp_name: "David Wilson",
    email: "david.wilson@company.com",
    designation: "DevOps Engineer",
    department: "Engineering",
    performance_score: 4.4,
    attendance_rate: 89.2,
    tasks_completed: 35,
    projects_handled: 2,
    efficiency_rating: 4.2,
    last_review_date: "2024-01-08",
    image: "/placeholder.svg?height=40&width=40",
    work_status: "active",
    joining_date: "2020-11-05",
    salary: "$78,000",
  },
]

const departmentAnalytics = [
  { department: "Engineering", employees: 8, avg_performance: 4.5, avg_attendance: 93.2, total_projects: 12 },
  { department: "Marketing", employees: 6, avg_performance: 4.1, avg_attendance: 91.8, total_projects: 15 },
  { department: "Design", employees: 4, avg_performance: 4.3, avg_attendance: 94.5, total_projects: 8 },
  { department: "Sales", employees: 6, avg_performance: 4.0, avg_attendance: 88.9, total_projects: 10 },
]

const monthlyTrends = [
  { month: "Jan", attendance: 92.5, performance: 4.2, productivity: 85 },
  { month: "Feb", attendance: 94.1, performance: 4.3, productivity: 88 },
  { month: "Mar", attendance: 93.8, performance: 4.4, productivity: 87 },
  { month: "Apr", attendance: 95.2, performance: 4.5, productivity: 91 },
  { month: "May", attendance: 94.7, performance: 4.4, productivity: 89 },
  { month: "Jun", attendance: 96.1, performance: 4.6, productivity: 93 },
]

export default function AnalyticsDashboardPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [timeRange, setTimeRange] = useState("6months")

  const overallStats = [
    {
      title: "Average Performance",
      value: "4.4/5.0",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Overall Attendance",
      value: "94.2%",
      change: "+1.8%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Productivity Index",
      value: "89.5%",
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Employee Satisfaction",
      value: "4.1/5.0",
      change: "-0.1",
      trend: "down",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUp className="h-3 w-3 text-green-600" />
    if (trend === "down") return <ArrowDown className="h-3 w-3 text-red-600" />
    return <Minus className="h-3 w-3 text-gray-600" />
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 4.5) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 4.0) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (score >= 3.5) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <BackButton />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-4 md:p-6 text-white">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-sm md:text-base text-blue-100">
              Comprehensive workforce analytics and performance insights
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
        <Button
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-sm"
        >
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(stat.trend)}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Department Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentAnalytics.map((dept, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">{dept.department}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Employees:</span>
                    <span className="font-medium text-xs md:text-sm">{dept.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Avg Performance:</span>
                    <span className="font-medium text-xs md:text-sm">{dept.avg_performance}/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Avg Attendance:</span>
                    <span className="font-medium text-xs md:text-sm">{dept.avg_attendance}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs md:text-sm text-gray-600">Projects:</span>
                    <span className="font-medium text-xs md:text-sm">{dept.total_projects}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Users className="h-5 w-5 text-green-600" />
            Individual Employee Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-900 text-xs md:text-sm">
                      Employee
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-900 text-xs md:text-sm">
                      Department
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-900 text-xs md:text-sm">
                      Performance
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-900 text-xs md:text-sm">
                      Attendance
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-900 text-xs md:text-sm">
                      Tasks
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-900 text-xs md:text-sm">
                      Projects
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-900 text-xs md:text-sm">
                      Efficiency
                    </th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-900 text-xs md:text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.map((employee, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 md:px-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <img
                            src={employee.image || "/placeholder.svg"}
                            alt={employee.emp_name}
                            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-xs md:text-sm truncate">{employee.emp_name}</p>
                            <p className="text-xs text-gray-600 truncate">{employee.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 md:px-4 text-gray-700 text-xs md:text-sm">{employee.department}</td>
                      <td className="py-3 px-2 md:px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-xs md:text-sm">{employee.performance_score}/5.0</span>
                          {getPerformanceBadge(employee.performance_score)}
                        </div>
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <div className="flex flex-col gap-1">
                          <div className="w-12 md:w-16 bg-gray-200 rounded-full h-1.5 md:h-2">
                            <div
                              className="bg-green-600 h-1.5 md:h-2 rounded-full"
                              style={{ width: `${employee.attendance_rate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{employee.attendance_rate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 md:px-4 font-medium text-gray-900 text-xs md:text-sm">
                        {employee.tasks_completed}
                      </td>
                      <td className="py-3 px-2 md:px-4 font-medium text-gray-900 text-xs md:text-sm">
                        {employee.projects_handled}
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
                          <span className="font-medium text-xs md:text-sm">{employee.efficiency_rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <Badge
                          variant={employee.work_status === "active" ? "default" : "secondary"}
                          className={`text-xs ${
                            employee.work_status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {employee.work_status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <LineChart className="h-5 w-5 text-purple-600" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((trend, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2"
                >
                  <span className="font-medium text-gray-900 text-sm md:text-base">{trend.month}</span>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="truncate">Attendance: {trend.attendance}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="truncate">Performance: {trend.performance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="truncate">Productivity: {trend.productivity}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Performance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-red-800 text-sm md:text-base">Low Performance Alert</p>
                  <p className="text-xs md:text-sm text-red-600">2 employees below 3.5 performance rating</p>
                  <p className="text-xs text-red-500 mt-1">Requires immediate attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-yellow-800 text-sm md:text-base">Attendance Warning</p>
                  <p className="text-xs md:text-sm text-yellow-600">3 employees with attendance below 90%</p>
                  <p className="text-xs text-yellow-500 mt-1">Monitor closely</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-blue-800 text-sm md:text-base">Review Due</p>
                  <p className="text-xs md:text-sm text-blue-600">5 performance reviews due this week</p>
                  <p className="text-xs text-blue-500 mt-1">Schedule reviews</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
