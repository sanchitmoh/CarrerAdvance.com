"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Map,
  Target,
  Clock,
  CheckCircle,
  Sparkles,
  Wand2,
  Edit,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface Roadmap {
  id: string
  title: string
  description: string
  targetRole: string
  estimatedTime: string
  createdAt: string
  progress: number
  status: "active" | "completed" | "paused"
}

interface Goal {
  title: string
  status: string
  description: string
  milestones: string[]
}

export default function CareerRoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null)
  const [deleteRoadmapId, setDeleteRoadmapId] = useState<string | null>(null)
  const [expandedGoals, setExpandedGoals] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetRole: "",
    estimatedTime: "",
  })

  const generateGoalsForRole = (targetRole: string): Goal[] => {
    const roleKeywords = targetRole.toLowerCase()

    if (roleKeywords.includes("full stack") || roleKeywords.includes("fullstack")) {
      return [
        {
          title: "Learn Front-End Development",
          status: "Learning",
          description:
            "Acquire the skills needed for front-end development, including HTML, CSS, and JavaScript frameworks.",
          milestones: [
            "Complete Front-End Web Development Course",
            "Build a Personal Portfolio Website",
            "Master a JavaScript Framework",
          ],
        },
        {
          title: "Learn Back-End Development",
          status: "Learning",
          description:
            "Focus on the skills required for back-end development, including server, database, and API integration.",
          milestones: ["Complete Back-End Development Course", "Develop a RESTful API", "Learn Database Management"],
        },
        {
          title: "Hands-On Projects",
          status: "Projects",
          description:
            "Apply acquired skills through projects that demonstrate your abilities as a Full Stack Developer.",
          milestones: ["Create a Full Stack Application", "Contribute to Open Source", "Build E-commerce Platform"],
        },
        {
          title: "Networking and Community Engagement",
          status: "Networking",
          description:
            "Build connections with industry professionals and peers to aid in job search and professional growth.",
          milestones: [
            "Attend Meetups and Conferences",
            "Join Online Developer Communities",
            "Build Professional Network",
          ],
        },
        {
          title: "Prepare for Job Applications",
          status: "Interview Prep",
          description:
            "Get ready for the job market by polishing your resume, practicing interviews, and optimizing your online presence.",
          milestones: ["Create a Professional Resume", "Conduct Mock Interviews", "Optimize LinkedIn Profile"],
        },
      ]
    } else if (roleKeywords.includes("frontend") || roleKeywords.includes("front-end")) {
      return [
        {
          title: "Master HTML, CSS & JavaScript",
          status: "Learning",
          description: "Build a solid foundation in core web technologies and modern JavaScript.",
          milestones: [
            "Complete HTML5 & CSS3 Course",
            "Master ES6+ JavaScript Features",
            "Learn CSS Preprocessors (Sass/Less)",
          ],
        },
        {
          title: "Learn Modern Frameworks",
          status: "Learning",
          description: "Master popular frontend frameworks and libraries for building dynamic applications.",
          milestones: [
            "Complete React.js Course",
            "Learn State Management (Redux/Context)",
            "Explore Vue.js or Angular",
          ],
        },
        {
          title: "Build Portfolio Projects",
          status: "Projects",
          description: "Create impressive projects that showcase your frontend development skills.",
          milestones: [
            "Build Responsive Portfolio Website",
            "Create Interactive Web Applications",
            "Develop Mobile-First Projects",
          ],
        },
        {
          title: "Professional Development",
          status: "Career Prep",
          description: "Prepare for frontend developer roles and build professional presence.",
          milestones: ["Create Technical Resume", "Practice Coding Interviews", "Build GitHub Portfolio"],
        },
      ]
    } else if (roleKeywords.includes("backend") || roleKeywords.includes("back-end")) {
      return [
        {
          title: "Learn Server-Side Programming",
          status: "Learning",
          description: "Master backend programming languages and server-side development concepts.",
          milestones: [
            "Complete Node.js/Python/Java Course",
            "Learn API Development",
            "Understand Server Architecture",
          ],
        },
        {
          title: "Database Management",
          status: "Learning",
          description: "Learn to design, implement, and manage databases effectively.",
          milestones: ["Master SQL and Database Design", "Learn NoSQL Databases", "Implement Database Optimization"],
        },
        {
          title: "Build Backend Projects",
          status: "Projects",
          description: "Create robust backend systems and APIs to demonstrate your skills.",
          milestones: ["Build RESTful APIs", "Create Microservices Architecture", "Implement Authentication Systems"],
        },
        {
          title: "DevOps and Deployment",
          status: "Operations",
          description: "Learn deployment, monitoring, and maintenance of backend systems.",
          milestones: ["Learn Cloud Platforms (AWS/Azure)", "Master CI/CD Pipelines", "Implement Monitoring Solutions"],
        },
      ]
    } else {
      // Generic goals for any other role
      return [
        {
          title: "Skill Development",
          status: "Learning",
          description: `Acquire the core skills needed for ${targetRole} role.`,
          milestones: ["Complete Relevant Courses", "Practice Core Skills", "Stay Updated with Industry Trends"],
        },
        {
          title: "Practical Experience",
          status: "Projects",
          description: "Gain hands-on experience through projects and real-world applications.",
          milestones: ["Build Portfolio Projects", "Contribute to Open Source", "Complete Internships/Freelance Work"],
        },
        {
          title: "Professional Networking",
          status: "Networking",
          description: "Build connections and establish presence in your target industry.",
          milestones: ["Join Professional Communities", "Attend Industry Events", "Build Online Presence"],
        },
        {
          title: "Job Preparation",
          status: "Career Prep",
          description: "Prepare for job applications and interviews in your target field.",
          milestones: ["Create Professional Resume", "Practice Interview Skills", "Research Target Companies"],
        },
      ]
    }
  }

  const toggleGoalsExpansion = (roadmapId: string) => {
    setExpandedGoals(expandedGoals === roadmapId ? null : roadmapId)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "learning":
        return "bg-blue-100 text-blue-800"
      case "projects":
        return "bg-purple-100 text-purple-800"
      case "networking":
        return "bg-green-100 text-green-800"
      case "interview prep":
      case "career prep":
        return "bg-orange-100 text-orange-800"
      case "operations":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateRoadmap = () => {
    const newRoadmap: Roadmap = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetRole: formData.targetRole,
      estimatedTime: formData.estimatedTime,
      createdAt: new Date().toISOString(),
      progress: 0,
      status: "active",
    }

    if (editingRoadmap) {
      // Update existing roadmap
      setRoadmaps((prev) =>
        prev.map((roadmap) => (roadmap.id === editingRoadmap.id ? { ...roadmap, ...formData } : roadmap)),
      )
      setEditingRoadmap(null)
    } else {
      // Create new roadmap
      setRoadmaps((prev) => [...prev, newRoadmap])
    }

    setIsDialogOpen(false)
    setFormData({ title: "", description: "", targetRole: "", estimatedTime: "" })
  }

  const handleEditRoadmap = (roadmap: Roadmap) => {
    setEditingRoadmap(roadmap)
    setFormData({
      title: roadmap.title,
      description: roadmap.description,
      targetRole: roadmap.targetRole,
      estimatedTime: roadmap.estimatedTime,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteRoadmap = (id: string) => {
    setRoadmaps((prev) => prev.filter((roadmap) => roadmap.id !== id))
    setDeleteRoadmapId(null)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingRoadmap(null)
    setFormData({ title: "", description: "", targetRole: "", estimatedTime: "" })
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setIsDialogOpen(true)
    } else {
      handleDialogClose()
    }
  }

  const handleGenerateWithAI = () => {
    // TODO: Implement AI generation logic
    console.log("Generating roadmap with AI")
  }

  const completedCount = roadmaps.filter((r) => r.status === "completed").length
  const inProgressCount = roadmaps.filter((r) => r.status === "active").length
  const totalProgress =
    roadmaps.length > 0 ? Math.round(roadmaps.reduce((sum, r) => sum + r.progress, 0) / roadmaps.length) : 0

  return (
    <div className="min-h-screen bg-gray-50 ml-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Roadmap</h1>
            <p className="text-gray-600">Follow your personalized path to career success</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Roadmap
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {editingRoadmap ? "Edit Career Roadmap" : "Create New Career Roadmap"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editingRoadmap
                    ? "Update your roadmap details."
                    : "Create a new roadmap to guide your career journey."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Generate with AI Section - only show when creating new */}
                {!editingRoadmap && (
                  <Card className="border-2 border-dashed border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Generate with AI</h3>
                            <p className="text-sm text-gray-600">Let AI create a personalized roadmap for you</p>
                          </div>
                        </div>
                        <Button onClick={handleGenerateWithAI} className="bg-green-600 hover:bg-green-700">
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Roadmap
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Manual Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Frontend Developer Career Path"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your career roadmap goals and objectives..."
                      className="mt-1 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetRole" className="text-sm font-medium text-gray-700">
                      Target Role
                    </Label>
                    <Input
                      id="targetRole"
                      value={formData.targetRole}
                      onChange={(e) => handleInputChange("targetRole", e.target.value)}
                      placeholder="e.g., Senior Frontend Developer"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedTime" className="text-sm font-medium text-gray-700">
                      Est. Time (Months)
                    </Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      value={formData.estimatedTime}
                      onChange={(e) => handleInputChange("estimatedTime", e.target.value)}
                      placeholder="12"
                      className="mt-1"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateRoadmap}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!formData.title || !formData.targetRole}
                  >
                    {editingRoadmap ? "Update Roadmap" : "Create Roadmap"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overall Progress Section */}
        <Card className="mb-8 border-0 shadow-lg bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Overall Progress
            </CardTitle>
            <CardDescription>Your journey to career readiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Career Readiness Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Career Readiness</span>
                  <span className="text-sm font-bold text-green-600">{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="h-3 bg-gray-200" />
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{completedCount}</span>
                  </div>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{inProgressCount}</span>
                  </div>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-blue-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{roadmaps.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Roadmaps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {roadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <Card key={roadmap.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{roadmap.title}</CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          variant={
                            roadmap.status === "completed"
                              ? "default"
                              : roadmap.status === "active"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            roadmap.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : roadmap.status === "active"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {roadmap.status}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {roadmap.estimatedTime} months
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRoadmap(roadmap)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteRoadmapId(roadmap.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 overflow-hidden">{roadmap.description}</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Target Role</span>
                        <span className="font-medium text-gray-900">{roadmap.targetRole}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{roadmap.progress}%</span>
                      </div>
                      <Progress value={roadmap.progress} className="h-2" />
                    </div>

                    <div className="border-t pt-3 mt-4">
                      <Button
                        variant="ghost"
                        onClick={() => toggleGoalsExpansion(roadmap.id)}
                        className="w-full justify-between p-0 h-auto text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-transparent"
                      >
                        <span>Goals and Milestones</span>
                        {expandedGoals === roadmap.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>

                      {expandedGoals === roadmap.id && (
                        <div className="mt-3 space-y-3 max-h-64 overflow-y-auto">
                          {generateGoalsForRole(roadmap.targetRole).map((goal, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 text-sm">{goal.title}</h4>
                                <Badge className={`text-xs ${getStatusBadgeColor(goal.status)}`}>{goal.status}</Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{goal.description}</p>
                              <ul className="space-y-1">
                                {goal.milestones.map((milestone, mIndex) => (
                                  <li key={mIndex} className="text-xs text-gray-700 flex items-start">
                                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    {milestone}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-2 border-dashed border-gray-300 bg-white">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Map className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Roadmaps Found</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                It looks like you don't have any career roadmaps yet. Click "Add Roadmap" to get started!
              </p>
              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Roadmap
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}

        <AlertDialog open={!!deleteRoadmapId} onOpenChange={() => setDeleteRoadmapId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Roadmap</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this roadmap? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteRoadmapId && handleDeleteRoadmap(deleteRoadmapId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
