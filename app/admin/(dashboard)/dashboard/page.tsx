"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BackButton from "@/components/back-button"
import { getBackendUrl } from "@/lib/api-config"
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

// Helper function to make API requests with CORS handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = getBackendUrl(`/index.php/api/dashboard${endpoint}`)
  
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
  }
  
  const mergedOptions = { ...defaultOptions, ...options }
  
  try {
    const response = await fetch(url, mergedOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

interface DashboardStats {
  totalUsers: number
  totalCourses: number
  activeJobs: number
  monthlyRevenue: number
}

interface SystemStatus {
  server_status: string
  database_status: string
  api_response_time: number
  active_subscriptions: number
  moderation_alerts: number
  system_load: number
  recorded_at: string
}

const quickActions = [
  {
    title: "Manage Users",
    description: "View and manage user accounts",
    icon: Users,
    color: "bg-blue-600 hover:bg-blue-700",
    href: "/admin/users",
  },
  {
    title: "Review Courses",
    description: "Review and approve courses",
    icon: GraduationCap,
    color: "bg-purple-600 hover:bg-purple-700",
    href: "/admin/courses",
  },
  {
    title: "Moderation Queue",
    description: "Review flagged content",
    icon: MessageSquare,
    color: "bg-orange-600 hover:bg-orange-700",
    href: "/admin/moderation",
  },
]

// Helper function to get status color based on system status
const getSystemStatusColor = (status: string, value: string | number) => {
  switch (status) {
    case "server_status":
      return value === "Online" ? "excellent" : "critical"
    case "database_status":
      return value === "Healthy" ? "good" : "critical"
    case "api_response_time":
      return (value as number) < 0.5 ? "excellent" : (value as number) < 1.0 ? "good" : "warning"
    case "active_subscriptions":
      return (value as number) > 0 ? "good" : "neutral"
    case "moderation_alerts":
      return (value as number) === 0 ? "excellent" : (value as number) < 5 ? "warning" : "critical"
    case "system_load":
      return (value as number) < 0.5 ? "excellent" : (value as number) < 0.8 ? "good" : "warning"
    default:
      return "neutral"
  }
}

// Platform metrics removed

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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch dashboard stats
        const statsData = await apiRequest('/stats')
        setDashboardStats(statsData.data)

        // Fetch system status
        const statusData = await apiRequest('/system-status')
        setSystemStatus(statusData.data)

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        
        // Set fallback data
        setDashboardStats({
          totalUsers: 0,
          totalCourses: 0,
          activeJobs: 0,
          monthlyRevenue: 0
        })
        setSystemStatus({
          server_status: "Online",
          database_status: "Healthy",
          api_response_time: 0.15,
          active_subscriptions: 0,
          moderation_alerts: 0,
          system_load: 0.25,
          recorded_at: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Create dynamic stats array
  const stats = dashboardStats ? [
    {
      title: "Total Users",
      value: dashboardStats.totalUsers.toString(),
      subtitle: "Active users",
      change: null,
      trend: "neutral" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Courses",
      value: dashboardStats.totalCourses.toString(),
      subtitle: "Available courses",
      change: null,
      trend: "up" as const,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Jobs",
      value: dashboardStats.activeJobs.toString(),
      subtitle: "Job postings",
      change: null,
      trend: "up" as const,
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Monthly Revenue",
      value: `$${dashboardStats.monthlyRevenue.toLocaleString()}`,
      subtitle: "This month",
      change: "+20.1%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ] : []

  // Create dynamic system health array
  const systemHealth = systemStatus ? [
    {
      name: "Server Status",
      value: systemStatus.server_status,
      status: getSystemStatusColor("server_status", systemStatus.server_status),
      icon: Server,
    },
    {
      name: "Database",
      value: systemStatus.database_status,
      status: getSystemStatusColor("database_status", systemStatus.database_status),
      icon: Database,
    },
    {
      name: "API Response",
      value: `${systemStatus.api_response_time}s`,
      status: getSystemStatusColor("api_response_time", systemStatus.api_response_time),
      icon: Zap,
    },
    {
      name: "Active Subscriptions",
      value: systemStatus.active_subscriptions.toString(),
      status: getSystemStatusColor("active_subscriptions", systemStatus.active_subscriptions),
      icon: CreditCard,
    },
    {
      name: "Moderation Alerts",
      value: systemStatus.moderation_alerts.toString(),
      status: getSystemStatusColor("moderation_alerts", systemStatus.moderation_alerts),
      icon: AlertTriangle,
    },
    {
      name: "System Load",
      value: `${(systemStatus.system_load * 100).toFixed(1)}%`,
      status: getSystemStatusColor("system_load", systemStatus.system_load),
      icon: Activity,
    },
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-4">
        
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-4 ">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white">Monitor and manage your CareerAdvance platform.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center">
              {/* Date selector removed */}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">Error: {error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-sm hover:border-2 border-emerald-400">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button
                    className={`${action.color} text-white h-auto p-4 flex flex-col items-center space-y-2 w-full`}
                  >
                    <action.icon className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs opacity-90">{action.description}</div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid grid-cols-1 gap-6">
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
        </div>
      </div>
    </div>
  )
}