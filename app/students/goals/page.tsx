"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Target, Trophy, Calendar, TrendingUp, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface Milestone {
  id: string
  title: string
  completed: boolean
}

interface Goal {
  id: string
  title: string
  description: string
  status: "Not started" | "In Progress" | "Completed" | "On Hold"
  category: "Learning" | "Projects" | "Networking" | "Interview Prep"
  dueDate?: string
  progress: number
  milestones: Milestone[]
  roadmapId: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set())

  useEffect(() => {
    const savedRoadmaps = localStorage.getItem("career-roadmaps")
    if (savedRoadmaps) {
      const roadmaps = JSON.parse(savedRoadmaps)
      const allGoals: Goal[] = []

      roadmaps.forEach((roadmap: any) => {
        if (roadmap.goals) {
          allGoals.push(...roadmap.goals)
        }
      })

      setGoals(allGoals)
    }
  }, [])

  const stats = {
    active: goals.filter((g) => g.status === "In Progress").length,
    completed: goals.filter((g) => g.status === "Completed").length,
    totalMilestones: goals.reduce((acc, goal) => acc + goal.milestones.length, 0),
    avgProgress: goals.length > 0 ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) : 0,
  }

  const toggleGoalExpansion = (goalId: string) => {
    const newExpanded = new Set(expandedGoals)
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId)
    } else {
      newExpanded.add(goalId)
    }
    setExpandedGoals(newExpanded)
  }

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map((milestone) =>
          milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone,
        )
        const completedCount = updatedMilestones.filter((m) => m.completed).length
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100)

        return {
          ...goal,
          milestones: updatedMilestones,
          progress: newProgress,
          status:
            newProgress === 100
              ? ("Completed" as const)
              : newProgress > 0
                ? ("In Progress" as const)
                : ("Not started" as const),
        }
      }
      return goal
    })

    setGoals(updatedGoals)

    // Update localStorage
    const savedRoadmaps = localStorage.getItem("career-roadmaps")
    if (savedRoadmaps) {
      const roadmaps = JSON.parse(savedRoadmaps)
      const updatedRoadmaps = roadmaps.map((roadmap: any) => ({
        ...roadmap,
        goals: roadmap.goals?.map((goal: Goal) => updatedGoals.find((g) => g.id === goal.id) || goal),
      }))
      localStorage.setItem("career-roadmaps", JSON.stringify(updatedRoadmaps))
    }
  }

  const deleteGoal = (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      const updatedGoals = goals.filter((g) => g.id !== goalId)
      setGoals(updatedGoals)

      // Update localStorage
      const savedRoadmaps = localStorage.getItem("career-roadmaps")
      if (savedRoadmaps) {
        const roadmaps = JSON.parse(savedRoadmaps)
        const updatedRoadmaps = roadmaps.map((roadmap: any) => ({
          ...roadmap,
          goals: roadmap.goals?.filter((goal: Goal) => goal.id !== goalId),
        }))
        localStorage.setItem("career-roadmaps", JSON.stringify(updatedRoadmaps))
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "On Hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Learning":
        return "bg-purple-100 text-purple-800"
      case "Projects":
        return "bg-orange-100 text-orange-800"
      case "Networking":
        return "bg-pink-100 text-pink-800"
      case "Interview Prep":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goals & Milestones</h1>
            <p className="text-gray-600 mt-2">Track your career progress and achievements</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.active}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Milestones</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.totalMilestones}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Avg. Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.avgProgress}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                <Target className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">No goals yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Create a career roadmap to generate your goals and milestones!
                </p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                onClick={() => (window.location.href = "/students/career-roadmap")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Roadmap
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{goal.title}</CardTitle>
                        <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Badge variant="outline" className={getCategoryColor(goal.category)}>
                          {goal.category}
                        </Badge>
                        {goal.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {goal.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-gray-600">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  <div className="border-t pt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => toggleGoalExpansion(goal.id)}
                    >
                      <span className="font-medium">Milestones</span>
                      {expandedGoals.has(goal.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>

                    {expandedGoals.has(goal.id) && (
                      <div className="mt-4 space-y-3">
                        {goal.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-center gap-3">
                            <Checkbox
                              checked={milestone.completed}
                              onCheckedChange={() => toggleMilestone(goal.id, milestone.id)}
                            />
                            <span className={`flex-1 ${milestone.completed ? "line-through text-gray-500" : ""}`}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
