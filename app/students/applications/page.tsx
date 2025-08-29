"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Search, Filter, Briefcase } from "lucide-react"
import Link from "next/link"

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Empty applications array for now
  const applications: any[] = []

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchTerm === "" ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="ml-16 pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <Send className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">My Applications</h1>
              <p className="text-emerald-100">Track your job applications and their progress</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-emerald-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by job title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-emerald-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Applications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="reviewing">Under Review</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="offer">Offer Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>

        {/* Empty State */}
        <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
          <CardContent className="p-12 text-center">
            <Send className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-6">You haven't applied to any jobs yet.</p>
            <Link href="/students/job-board">
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
