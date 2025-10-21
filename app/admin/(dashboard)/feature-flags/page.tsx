"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BackButton from "@/components/back-button"
import {
  Flag,
  Users,
  TrendingUp,
  Settings,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
} from "lucide-react"

export default function FeatureFlagsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const featureFlags = [
    {
      id: 1,
      name: "Advanced Course Analytics",
      description: "Detailed analytics dashboard for course performance and student engagement",
      status: "active",
      rolloutPercentage: 100,
      usersAffected: 2847,
      environment: "production",
      createdAt: "2024-01-15",
      lastModified: "2024-01-20",
      dependencies: ["Analytics", "Course Creation"],
      metrics: {
        conversionRate: 23.5,
        errorRate: 0.2,
        performanceImpact: "low",
      },
    },
    {
      id: 2,
      name: "AI Job Matching v2",
      description: "Enhanced AI-powered job matching with machine learning improvements",
      status: "beta",
      rolloutPercentage: 25,
      usersAffected: 712,
      environment: "production",
      createdAt: "2024-01-10",
      lastModified: "2024-01-25",
      dependencies: ["Job Matching"],
      metrics: {
        conversionRate: 34.2,
        errorRate: 1.1,
        performanceImpact: "medium",
      },
    },
    {
      id: 3,
      name: "Live Webinar Platform",
      description: "Real-time webinar hosting with interactive features",
      status: "disabled",
      rolloutPercentage: 0,
      usersAffected: 0,
      environment: "staging",
      createdAt: "2024-01-05",
      lastModified: "2024-01-18",
      dependencies: ["Webinars"],
      metrics: {
        conversionRate: 0,
        errorRate: 0,
        performanceImpact: "high",
      },
    },
    {
      id: 4,
      name: "Mobile App Push Notifications",
      description: "Push notification system for mobile applications",
      status: "active",
      rolloutPercentage: 80,
      usersAffected: 2278,
      environment: "production",
      createdAt: "2024-01-12",
      lastModified: "2024-01-22",
      dependencies: [],
      metrics: {
        conversionRate: 18.7,
        errorRate: 0.5,
        performanceImpact: "low",
      },
    },
    {
      id: 5,
      name: "Advanced Certification System",
      description: "Blockchain-verified certificates with digital badges",
      status: "testing",
      rolloutPercentage: 10,
      usersAffected: 285,
      environment: "staging",
      createdAt: "2024-01-08",
      lastModified: "2024-01-24",
      dependencies: ["Certifications"],
      metrics: {
        conversionRate: 41.3,
        errorRate: 2.1,
        performanceImpact: "medium",
      },
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "beta":
        return "bg-blue-100 text-blue-800"
      case "testing":
        return "bg-yellow-100 text-yellow-800"
      case "disabled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      case "beta":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
      case "testing":
        return <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
      case "disabled":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
    }
  }

  const filteredFlags = featureFlags.filter(
    (flag) =>
      flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="px-0 pt-0">
          <BackButton />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="space-y-1 ">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <Flag className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              Feature Flags
            </h1>
            <p className="text-sm sm:text-base text-white">Manage feature rollouts and A/B testing</p>
          </div>
          <Button className="bg-green-700 hover:bg-green-800 whitespace-nowrap shrink-0 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Feature Flag
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="p-3 sm:p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Flags</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">5</p>
                </div>
                <Flag className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Flags</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">2</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Users Affected</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">6,122</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="p-3 sm:p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Conversion</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">23.5%</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search feature flags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-11 text-sm"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48 h-10 sm:h-11 text-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredFlags.map((flag) => (
            <Card key={flag.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{flag.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`text-xs ${getStatusColor(flag.status)}`}>
                          {getStatusIcon(flag.status)}
                          <span className="ml-1 capitalize">{flag.status}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">{flag.environment}</Badge>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{flag.description}</p>

                    {flag.dependencies.length > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-500">Dependencies:</span>
                        <div className="flex flex-wrap gap-1">
                          {flag.dependencies.map((dep, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-600">Rollout Percentage</Label>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm sm:text-base text-gray-900">{flag.rolloutPercentage}%</span>
                        <span className="text-xs sm:text-sm text-gray-500">{flag.usersAffected.toLocaleString()} users</span>
                      </div>
                      <Progress value={flag.rolloutPercentage} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-600">Conversion Rate</Label>
                    <div>
                      <span className="text-base sm:text-lg font-semibold text-green-600">{flag.metrics.conversionRate}%</span>
                      <p className="text-xs text-gray-500">vs baseline</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-600">Error Rate</Label>
                    <div>
                      <span
                        className={`text-base sm:text-lg font-semibold ${flag.metrics.errorRate > 1 ? "text-red-600" : "text-green-600"}`}
                      >
                        {flag.metrics.errorRate}%
                      </span>
                      <p className="text-xs text-gray-500">last 24h</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-gray-600">Performance Impact</Label>
                    <div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          flag.metrics.performanceImpact === "low"
                            ? "text-green-600 border-green-200"
                            : flag.metrics.performanceImpact === "medium"
                              ? "text-yellow-600 border-yellow-200"
                              : "text-red-600 border-red-200"
                        }`}
                      >
                        {flag.metrics.performanceImpact}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">system load</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t">
                  <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                    Created: {flag.createdAt} • Last modified: {flag.lastModified}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Switch checked={flag.status === "active"} disabled={flag.status === "testing"} />
                    <span className="text-xs sm:text-sm text-gray-600">{flag.status === "active" ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFlags.length === 0 && (
          <Card>
            <CardContent className="p-6 sm:p-12 text-center">
              <Flag className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No feature flags found</h3>
              <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or create a new feature flag.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}