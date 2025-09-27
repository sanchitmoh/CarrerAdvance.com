"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Info, CheckCircle, XCircle, Download, Search } from "lucide-react"

const systemLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:32:15",
    level: "ERROR",
    category: "Authentication",
    message: "Failed login attempt for user: john.doe@example.com",
    details: "Invalid password provided. IP: 192.168.1.100",
    source: "auth-service",
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:30:42",
    level: "WARNING",
    category: "Database",
    message: "Slow query detected in courses table",
    details: "Query execution time: 2.3s. Query: SELECT * FROM courses WHERE status = 'active'",
    source: "db-monitor",
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:28:33",
    level: "INFO",
    category: "User Activity",
    message: "New user registration completed",
    details: "User: sarah.wilson@example.com successfully registered as STUDENT",
    source: "user-service",
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:25:18",
    level: "ERROR",
    category: "Payment",
    message: "Payment processing failed",
    details: "Stripe payment failed for order #12345. Error: Card declined",
    source: "payment-service",
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:22:07",
    level: "SUCCESS",
    category: "Course",
    message: "Course published successfully",
    details: "Course 'Advanced React Development' published by teacher@example.com",
    source: "course-service",
  },
  {
    id: 6,
    timestamp: "2024-01-15 14:20:15",
    level: "WARNING",
    category: "System",
    message: "High memory usage detected",
    details: "Memory usage: 85%. Threshold: 80%. Server: web-server-01",
    source: "system-monitor",
  },
  {
    id: 7,
    timestamp: "2024-01-15 14:18:44",
    level: "INFO",
    category: "Email",
    message: "Welcome email sent successfully",
    details: "Email sent to new user: mike.johnson@example.com",
    source: "email-service",
  },
  {
    id: 8,
    timestamp: "2024-01-15 14:15:22",
    level: "ERROR",
    category: "API",
    message: "Rate limit exceeded",
    details: "API rate limit exceeded for IP: 203.0.113.45. Endpoint: /api/courses",
    source: "api-gateway",
  },
]

const logLevelColors = {
  ERROR: "bg-red-100 text-red-800 border-red-200",
  WARNING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  INFO: "bg-blue-100 text-blue-800 border-blue-200",
  SUCCESS: "bg-green-100 text-green-800 border-green-200",
}

const logLevelIcons = {
  ERROR: XCircle,
  WARNING: AlertTriangle,
  INFO: Info,
  SUCCESS: CheckCircle,
}

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredLogs = systemLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter

    return matchesSearch && matchesLevel && matchesCategory
  })

  const categories = [...new Set(systemLogs.map((log) => log.category))]

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">Monitor system activities, errors, and performance metrics</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">156</div>
            <p className="text-xs text-muted-foreground">-5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <p className="text-xs text-muted-foreground">+0.3% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Logs</CardTitle>
          <CardDescription>Search and filter system logs by level, category, or content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Log Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs ({filteredLogs.length})</CardTitle>
          <CardDescription>Latest system activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const IconComponent = logLevelIcons[log.level as keyof typeof logLevelIcons]
              return (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5" />
                      <Badge className={logLevelColors[log.level as keyof typeof logLevelColors]}>{log.level}</Badge>
                      <Badge variant="outline">{log.category}</Badge>
                      <span className="text-sm text-muted-foreground">{log.source}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <div>
                    <p className="font-medium">{log.message}</p>
                    <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
