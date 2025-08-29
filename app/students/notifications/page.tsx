"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, Briefcase, BookOpen, Award, AlertCircle, Clock, Eye, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [activeFilter, setActiveFilter] = useState("All")

  const notifications = [
    {
      id: 1,
      title: "New Job Match Found",
      description: "A Frontend Developer position at TechCorp matches your profile",
      priority: "high",
      category: "Jobs",
      date: "1/20/2024",
      unread: true,
      icon: Briefcase,
    },
    {
      id: 2,
      title: "Course Deadline Reminder",
      description: "React.js Masterclass assignment is due in 2 days",
      priority: "medium",
      category: "Courses",
      date: "1/20/2024",
      unread: true,
      icon: BookOpen,
    },
    {
      id: 3,
      title: "Congratulations! Goal Completed",
      description: "You've successfully completed your 'Learn Python' goal",
      priority: "low",
      category: "Achievements",
      date: "1/19/2024",
      unread: false,
      icon: Award,
    },
    {
      id: 4,
      title: "Application Status Update",
      description: "Your application to StartupXYZ has been reviewed",
      priority: "high",
      category: "Jobs",
      date: "1/19/2024",
      unread: false,
      icon: Briefcase,
    },
    {
      id: 5,
      title: "New Course Available",
      description: "Advanced JavaScript Concepts course is now available",
      priority: "low",
      category: "Courses",
      date: "1/18/2024",
      unread: false,
      icon: BookOpen,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "All") return true
    if (activeFilter === `Unread (${notifications.filter((n) => n.unread).length})`) return notification.unread
    return notification.category === activeFilter
  })

  const unreadCount = notifications.filter((n) => n.unread).length
  const highPriorityCount = notifications.filter((n) => n.priority === "high").length
  const achievementsCount = notifications.filter((n) => n.category === "Achievements").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ml-16 pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Stay updated with your career progress and opportunities</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Unread</p>
                  <p className="text-2xl font-bold text-blue-900">{unreadCount}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total</p>
                  <p className="text-2xl font-bold text-green-900">{notifications.length}</p>
                </div>
                <Bell className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-900">{highPriorityCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Achievements</p>
                  <p className="text-2xl font-bold text-purple-900">{achievementsCount}</p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Customize how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive browser push notifications</p>
              </div>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Notification Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Job Opportunities</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Course Updates</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Achievements</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Network Updates</span>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest notification activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {["All", `Unread (${unreadCount})`, "Jobs", "Courses", "Achievements"].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const IconComponent = notification.icon
            return (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${notification.unread ? "border-l-4 border-l-emerald-500 bg-emerald-50/30" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`p-2 rounded-lg ${notification.priority === "high" ? "bg-red-100" : notification.priority === "medium" ? "bg-yellow-100" : "bg-green-100"}`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${notification.priority === "high" ? "text-red-600" : notification.priority === "medium" ? "text-yellow-600" : "text-green-600"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {notification.unread && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.description}</p>
                        <p className="text-xs text-gray-500">{notification.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {notification.unread && (
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                          Mark as Read
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-600 mb-6">
                  Start using CareerAdvance to receive personalized notifications about your career journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Badge variant="outline" className="px-4 py-2">
                    <Briefcase className="w-3 h-3 mr-1" />
                    Browse Jobs
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Explore Courses
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Users className="w-3 h-3 mr-1" />
                    Build Network
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
