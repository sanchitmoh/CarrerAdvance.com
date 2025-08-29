"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, TrendingUp, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState("browse-all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = ["All Categories", "Web Development", "Data Science", "Design", "Mobile Development", "Marketing"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ml-16 pt-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-lg text-gray-600">Expand your skills with our comprehensive course library</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="browse-all">Browse All</TabsTrigger>
            <TabsTrigger value="my-courses">My Courses (0)</TabsTrigger>
            <TabsTrigger value="completed">Completed (0)</TabsTrigger>
          </TabsList>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tab Content */}
          <TabsContent value="browse-all" className="space-y-6">
            <EmptyState />
          </TabsContent>

          <TabsContent value="my-courses" className="space-y-6">
            <EmptyState />
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <EmptyState />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mb-6">
        <BookOpen className="h-12 w-12 text-emerald-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">Try adjusting your search or filter criteria</p>
      <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
        Browse All Courses
      </Button>
    </div>
  )
}
