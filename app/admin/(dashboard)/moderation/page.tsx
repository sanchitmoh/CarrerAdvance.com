"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle, Eye, CheckCircle, XCircle, Clock, Flag, MessageSquare, User, BookOpen } from "lucide-react"

const moderationQueue = [
  {
    id: 1,
    type: "course",
    title: "Complete Cryptocurrency Trading Course",
    author: "crypto.expert@example.com",
    authorName: "Alex Thompson",
    reportedBy: "student@example.com",
    reason: "Inappropriate content",
    description: "Course contains misleading information about guaranteed profits",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15 10:30:00",
    category: "Content Violation",
  },
  {
    id: 2,
    type: "comment",
    title: "Comment on 'React Fundamentals'",
    author: "angry.user@example.com",
    authorName: "John Smith",
    reportedBy: "teacher@example.com",
    reason: "Harassment",
    description: "User posted offensive language and personal attacks in course comments",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15 09:15:00",
    category: "Harassment",
  },
  {
    id: 3,
    type: "profile",
    title: "User Profile: suspicious.account",
    author: "suspicious.account@example.com",
    authorName: "Fake Account",
    reportedBy: "admin@example.com",
    reason: "Spam account",
    description: "Account created multiple fake courses and spamming users",
    status: "under_review",
    priority: "medium",
    createdAt: "2024-01-15 08:45:00",
    category: "Spam",
  },
  {
    id: 4,
    type: "course",
    title: "Advanced Python Programming",
    author: "python.dev@example.com",
    authorName: "Sarah Wilson",
    reportedBy: "student2@example.com",
    reason: "Copyright violation",
    description: "Course content appears to be copied from another platform",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-14 16:20:00",
    category: "Copyright",
  },
  {
    id: 5,
    type: "message",
    title: "Direct Message Thread",
    author: "spammer@example.com",
    authorName: "Spam Bot",
    reportedBy: "victim@example.com",
    reason: "Spam messages",
    description: "Sending unsolicited promotional messages to multiple users",
    status: "resolved",
    priority: "low",
    createdAt: "2024-01-14 14:10:00",
    category: "Spam",
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  under_review: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

const typeIcons = {
  course: BookOpen,
  comment: MessageSquare,
  profile: User,
  message: MessageSquare,
}

export default function ModerationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredQueue = moderationQueue.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const pendingCount = moderationQueue.filter((item) => item.status === "pending").length
  const underReviewCount = moderationQueue.filter((item) => item.status === "under_review").length
  const highPriorityCount = moderationQueue.filter((item) => item.priority === "high").length

  return (
    <div className="space-y-6">
      <div className="mb-4">
       
      </div>

      <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div>
          <BackButton />
          <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
          <p className="text-muted-foreground text-white">Review and manage reported content, users, and activities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-blue-500 to-sky-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-medium text-white">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingCount}</div>
            <p className="text-xs text-muted-foreground text-white">Awaiting action</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-rose-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Under Review</CardTitle>
            <Eye className="h-5 w-5 text-blue-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground text-white">Being investigated</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{highPriorityCount}</div>
            <p className="text-xs text-muted-foreground text-white">Urgent attention needed</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-400 to-pink-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">94.2%</div>
            <p className="text-xs text-muted-foreground text-white">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Moderation Queue</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="actions">Recent Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Queue</CardTitle>
              <CardDescription>Search and filter moderation items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="w-full sm:flex-1 sm:min-w-[200px]">
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                      <SelectItem value="message">Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queue Items */}
          <div className="space-y-4">
            {filteredQueue.map((item) => {
              const IconComponent = typeIcons[item.type as keyof typeof typeIcons]
              return (
                <Card key={item.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <IconComponent className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <Badge className={priorityColors[item.priority as keyof typeof priorityColors]}>
                            {item.priority.toUpperCase()}
                          </Badge>
                          <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                            {item.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-base break-words">{item.title}</h3>

                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {item.authorName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="break-words">By {item.authorName}</span>
                          </div>
                          <div className="break-words">Reported by {item.reportedBy}</div>
                          <div>{item.createdAt}</div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm break-words">
                            <strong>Reason:</strong> {item.reason}
                          </p>
                          <p className="text-sm text-muted-foreground break-words">{item.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        {item.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto text-green-600 hover:text-green-700 bg-transparent"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Categories</CardTitle>
              <CardDescription>Overview of report types and frequencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">12</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Harassment</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">8</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Spam</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">5</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Copyright</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">3</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Content Violation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Moderation Actions</CardTitle>
              <CardDescription>Latest actions taken by moderators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">Course "Fake Trading Signals" removed</p>
                    <p className="text-sm text-muted-foreground break-words">
                      Moderator: admin@example.com • 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">User "spammer@example.com" suspended for 7 days</p>
                    <p className="text-sm text-muted-foreground break-words">
                      Moderator: admin@example.com • 4 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Flag className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium break-words">Comment flagged for review</p>
                    <p className="text-sm text-muted-foreground break-words">
                      Moderator: admin@example.com • 6 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}