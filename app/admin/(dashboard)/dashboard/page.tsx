"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BackButton from "@/components/back-button"
import {
  Users,
  GraduationCap,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Settings,
  Database,
  Activity,
  DollarSign,
  Server,
  Zap,
  CreditCard,
  MessageSquare,
} from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "2",
    subtitle: "1 students, 0 teachers",
    change: null,
    trend: "neutral",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Total Courses",
    value: "0",
    subtitle: "+5 this week",
    change: null,
    trend: "up",
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Active Jobs",
    value: "0",
    subtitle: "12 new this week",
    change: null,
    trend: "up",
    icon: Briefcase,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Monthly Revenue",
    value: "$45,000",
    subtitle: "+20.1% from last month",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
]

const quickActions = [
  {
    title: "Manage Users",
    description: "View and manage user accounts",
    icon: Users,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Review Courses",
    description: "Review and approve courses",
    icon: GraduationCap,
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    title: "Moderation Queue",
    description: "Review flagged content",
    icon: MessageSquare,
    color: "bg-orange-600 hover:bg-orange-700",
  },
  {
    title: "View Analytics",
    description: "Platform performance metrics",
    icon: BarChart3,
    color: "bg-green-600 hover:bg-green-700",
  },
]

const systemHealth = [
  {
    name: "Server Status",
    value: "Online",
    status: "excellent",
    icon: Server,
  },
  {
    name: "Database",
    value: "Healthy",
    status: "good",
    icon: Database,
  },
  {
    name: "API Response",
    value: "Fast",
    status: "good",
    icon: Zap,
  },
  {
    name: "Active Subscriptions",
    value: "0",
    status: "neutral",
    icon: CreditCard,
  },
  {
    name: "Moderation Alerts",
    value: "3",
    status: "warning",
    icon: AlertTriangle,
  },
  {
    name: "System Load",
    value: "Low",
    status: "good",
    icon: Activity,
  },
]

const platformMetrics = [
  {
    title: "Payment Success Rate",
    value: "98.5%",
    icon: CreditCard,
    color: "text-green-600",
  },
  {
    title: "Uptime",
    value: "99.9%",
    icon: Server,
    color: "text-blue-600",
  },
  {
    title: "User Satisfaction",
    value: "85%",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Growth Rate",
    value: "+15%",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "text-green-600 bg-green-50"
    case "good":
      return "text-blue-600 bg-blue-50"
    case "warning":
      return "text-orange-600 bg-orange-50"
    case "critical":
      return "text-red-600 bg-red-50"
    case "neutral":
      return "text-gray-600 bg-gray-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export default function AdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Monitor and manage your CareerAdvance platform.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap shrink-0 leading-normal">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
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
                    <div className="flex items-center mt-1">
                      {stat.change ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">{stat.subtitle}</span>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  className={`${action.color} text-white h-auto p-4 flex flex-col items-center space-y-2`}
                >
                  <action.icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status and Platform Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                System Status
              </CardTitle>
              <CardDescription>Current platform health and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <metric.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>{metric.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Platform Metrics
              </CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {platformMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-gray-100">
                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{metric.title}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
