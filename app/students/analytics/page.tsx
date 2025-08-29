"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Award, BookOpen, Briefcase, Target } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your learning progress and career development metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Total XP</p>
                  <p className="text-2xl font-bold text-emerald-900">0</p>
                  <p className="text-xs text-emerald-500">Level 1</p>
                </div>
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Courses Progress</p>
                  <p className="text-2xl font-bold text-blue-900">0%</p>
                  <p className="text-xs text-blue-500">0 of 0 completed</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Job Applications</p>
                  <p className="text-2xl font-bold text-purple-900">0</p>
                  <p className="text-xs text-purple-500">0% response rate</p>
                </div>
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Certificates</p>
                  <p className="text-2xl font-bold text-orange-900">0</p>
                  <p className="text-xs text-orange-500">Professional credentials</p>
                </div>
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Learning Progress
              </CardTitle>
              <CardDescription>Your course completion and study metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-900">0/0</p>
                  <p className="text-sm text-emerald-600">Completed Courses</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-900">0%</p>
                  <p className="text-sm text-blue-600">Average Progress</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-900">0</p>
                  <p className="text-sm text-yellow-600">In Progress</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Not Started</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                Job Search Performance
              </CardTitle>
              <CardDescription>Your application and interview metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-900">0</p>
                  <p className="text-sm text-purple-600">Applications Sent</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-900">0</p>
                  <p className="text-sm text-green-600">Interviews</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-900">0%</p>
                  <p className="text-sm text-blue-600">Response Rate</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-900">N/A</p>
                  <p className="text-sm text-orange-600">Average Response Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Skills Development
            </CardTitle>
            <CardDescription>Track your skill levels and improvement trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-600">No skills data available.</p>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Journey</h3>
                <p className="text-gray-600 mb-6">
                  Begin using CareerAdvance to see detailed analytics about your career progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Badge variant="outline" className="px-4 py-2">
                    Complete your profile
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    Apply to jobs
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    Take courses
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
