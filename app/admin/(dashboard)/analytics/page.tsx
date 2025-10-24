"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import BackButton from "@/components/back-button"
import {
  DollarSign,
  Users,
  GraduationCap,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
} from "lucide-react"

const mainMetrics = [
  {
    title: "Total Revenue",
    value: "$124,567",
    change: "+12.5%",
    trend: "up",
    subtitle: "Monthly recurring revenue",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Active Users",
    value: "2,847",
    change: "+8.2%",
    trend: "up",
    subtitle: "Users active in last 30 days",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Course Completions",
    value: "1,234",
    change: "+15.3%",
    trend: "up",
    subtitle: "Courses completed this month",
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Avg. Session Time",
    value: "24m 32s",
    change: "-2.1%",
    trend: "down",
    subtitle: "Average user session duration",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

const userGrowthData = [
  { month: "May", students: 2100, teachers: 65 },
  { month: "Jun", students: 2400, teachers: 72 },
  { month: "Jul", students: 2650, teachers: 78 },
  { month: "Aug", students: 2847, teachers: 89 },
]

const platformActivity = [
  {
    title: "Daily Active Users",
    value: "1,247",
    total: "2,847",
    percentage: 44,
    color: "bg-blue-500",
  },
  {
    title: "Course Engagement",
    value: "78%",
    total: "100%",
    percentage: 78,
    color: "bg-purple-500",
  },
  {
    title: "Revenue Target",
    value: "$124K",
    total: "$150K",
    percentage: 83,
    color: "bg-green-500",
  },
]

export default function AdminAnalytics() {
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-2 sm:px-4 lg:px-6 pt-2 sm:pt-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <BackButton />
        <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Analytics Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Monitor platform performance and user engagement
              </p>
            </div>
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <select aria-label="Time period filter" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm w-full xs:w-auto">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap shrink-0 leading-normal text-sm w-full xs:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {mainMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{metric.title}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{metric.subtitle}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${metric.bgColor} flex-shrink-0`}>
                    <metric.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
              Users
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
              Courses
            </TabsTrigger>
            <TabsTrigger value="revenue" className="text-xs sm:text-sm py-2 px-2 sm:px-4">
              Revenue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* User Growth Trend */}
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    User Growth Trend
                  </CardTitle>
                  <CardDescription className="text-sm">Monthly user registration growth</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {userGrowthData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{data.month}</div>
                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-medium text-blue-600">
                            {data.students.toLocaleString()} students
                          </div>
                          <div className="text-xs text-gray-500">{data.teachers} teachers</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Activity */}
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Platform Activity
                  </CardTitle>
                  <CardDescription className="text-sm">Real-time platform metrics</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-4 sm:space-y-6">
                    {platformActivity.map((activity, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 truncate">{activity.title}</span>
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap ml-2">
                            {activity.value} / {activity.total}
                          </span>
                        </div>
                        <Progress value={activity.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-lg sm:text-xl">User Demographics</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Students</span>
                      <Badge variant="secondary" className="text-xs">
                        2,758 (96.9%)
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Teachers</span>
                      <Badge variant="secondary" className="text-xs">
                        89 (3.1%)
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-lg sm:text-xl">User Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Active</span>
                      <Badge variant="outline" className="text-xs">
                        1,247
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Weekly Active</span>
                      <Badge variant="outline" className="text-xs">
                        2,156
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Active</span>
                      <Badge variant="outline" className="text-xs">
                        2,847
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 xl:col-span-1">
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-lg sm:text-xl">Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg. Session Duration</span>
                      <Badge variant="outline" className="text-xs">
                        24m 32s
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pages per Session</span>
                      <Badge variant="outline" className="text-xs">
                        5.2
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Bounce Rate</span>
                      <Badge variant="outline" className="text-xs">
                        22%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-lg sm:text-xl">Course Completion Rates</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Web Development</span>
                        <span className="text-sm">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Data Science</span>
                        <span className="text-sm">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Digital Marketing</span>
                        <span className="text-sm">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-lg sm:text-xl">Popular Courses</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate mr-2">Full Stack Web Development</span>
                      <Badge className="text-xs whitespace-nowrap">456 enrolled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate mr-2">Python for Data Science</span>
                      <Badge className="text-xs whitespace-nowrap">342 enrolled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm truncate mr-2">Digital Marketing Mastery</span>
                      <Badge className="text-xs whitespace-nowrap">298 enrolled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Course Sales</span>
                      <span className="font-medium text-sm">$89,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Subscriptions</span>
                      <span className="font-medium text-sm">$28,456</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Job Postings</span>
                      <span className="font-medium text-sm">$6,877</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Monthly Target
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">$124,567</div>
                      <div className="text-xs sm:text-sm text-gray-500">of $150,000 target</div>
                    </div>
                    <Progress value={83} className="h-3" />
                    <div className="text-center text-xs sm:text-sm text-gray-600">83% achieved</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 xl:col-span-1">
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-lg sm:text-xl">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">MRR Growth</span>
                      <Badge variant="outline" className="text-green-600 text-xs">
                        +12.5%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Customer LTV</span>
                      <Badge variant="outline" className="text-xs">
                        $2,340
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Churn Rate</span>
                      <Badge variant="outline" className="text-red-600 text-xs">
                        2.1%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
