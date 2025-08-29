"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Course {
  id: string
  title: string
  instructor: string
  category: string
  status: "Published" | "Under Review" | "Rejected"
  students: number
  rating: number
  revenue: number
  thumbnail: string
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All Courses")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      category: "Web Development",
      status: "Published",
      students: 1247,
      rating: 4.8,
      revenue: 24940,
      thumbnail: "/web-development-course.png",
    },
    {
      id: "2",
      title: "Digital Marketing Mastery",
      instructor: "Sarah Johnson",
      category: "Marketing",
      status: "Published",
      students: 892,
      rating: 4.6,
      revenue: 17840,
      thumbnail: "/digital-marketing-course.png",
    },
    {
      id: "3",
      title: "Data Science with Python",
      instructor: "Dr. Michael Chen",
      category: "Data Science",
      status: "Under Review",
      students: 0,
      rating: 0,
      revenue: 0,
      thumbnail: "/data-science-course.png",
    },
    {
      id: "4",
      title: "UI/UX Design Fundamentals",
      instructor: "Emily Rodriguez",
      category: "Design",
      status: "Published",
      students: 634,
      rating: 4.9,
      revenue: 12680,
      thumbnail: "/ui-ux-design-course.png",
    },
    {
      id: "5",
      title: "Project Management Professional",
      instructor: "David Wilson",
      category: "Business",
      status: "Under Review",
      students: 0,
      rating: 0,
      revenue: 0,
      thumbnail: "/project-management-course.png",
    },
    {
      id: "6",
      title: "Cybersecurity Essentials",
      instructor: "Lisa Thompson",
      category: "Technology",
      status: "Rejected",
      students: 0,
      rating: 0,
      revenue: 0,
      thumbnail: "/cybersecurity-course.png",
    },
  ])

  const stats = [
    {
      title: "Total Courses",
      value: courses.length.toString(),
      icon: "📚",
    },
    {
      title: "Published",
      value: courses.filter((course) => course.status === "Published").length.toString(),
      icon: "✅",
    },
    {
      title: "Under Review",
      value: courses.filter((course) => course.status === "Under Review").length.toString(),
      icon: "⏳",
    },
    {
      title: "Total Revenue",
      value: `$${courses.reduce((total, course) => total + course.revenue, 0).toLocaleString()}`,
      icon: "💰",
    },
  ]

  const filterTabs = ["All Courses", "Published", "Under Review", "Rejected"]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === "All Courses" || course.status === selectedFilter

    return matchesSearch && matchesFilter
  })

  const handleAction = (action: string, courseId: string) => {
    if (action === "view") {
      const course = courses.find((c) => c.id === courseId)
      if (course) {
        setSelectedCourse(course)
        setIsViewDialogOpen(true)
      }
      return
    }
    console.log(`${action} course:`, courseId)
    // Implement action logic here
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
      case "Under Review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Review</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Review and manage all platform courses</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="revenue">Highest Revenue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedFilter === tab ? "bg-white text-emerald-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Courses ({filteredCourses.length})</CardTitle>
          <CardDescription>Manage course approvals and content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Instructor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Students</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">📚</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                      <p className="text-gray-600 mb-4">
                        {courses.length === 0
                          ? "Get started by adding your first course to the platform."
                          : "Try adjusting your search or filter criteria."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{course.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{course.instructor}</td>
                      <td className="py-4 px-4 text-gray-600">{course.category}</td>
                      <td className="py-4 px-4">{getStatusBadge(course.status)}</td>
                      <td className="py-4 px-4 text-gray-600">{course.students.toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-600">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          {course.rating.toFixed(1)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">${course.revenue.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction("view", course.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Course
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("edit", course.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            {course.status === "Under Review" && (
                              <>
                                <DropdownMenuItem onClick={() => handleAction("approve", course.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction("reject", course.id)}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleAction("delete", course.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Course Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Course Details
              <Button variant="ghost" size="sm" onClick={() => setIsViewDialogOpen(false)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-6">
              {/* Course Header */}
              <div className="flex items-start space-x-4">
                <img
                  src={selectedCourse.thumbnail || "/placeholder.svg"}
                  alt={selectedCourse.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedCourse.title}</h3>
                  <p className="text-gray-600 mt-1">by {selectedCourse.instructor}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    {getStatusBadge(selectedCourse.status)}
                    <Badge variant="outline">{selectedCourse.category}</Badge>
                  </div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedCourse.students.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    {selectedCourse.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">${selectedCourse.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedCourse.category}</div>
                  <div className="text-sm text-gray-600">Category</div>
                </div>
              </div>

              {/* Course Information */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Course Title</label>
                  <p className="text-gray-900 mt-1">{selectedCourse.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Instructor</label>
                  <p className="text-gray-900 mt-1">{selectedCourse.instructor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedCourse.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Course ID</label>
                  <p className="text-gray-900 mt-1">{selectedCourse.id}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    console.log("Edit course:", selectedCourse.id)
                    // Implement edit functionality
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Course
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
