"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  Star,
  ExternalLink,
  MessageSquare,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { fetchInterviews, updateInterviewStatus, saveInterviewReview, type Interview } from "@/lib/interviews-api"
import BackButton from "@/components/back-button"

export default function InterviewTrackerPage() {
  const [activeTab, setActiveTab] = useState("scheduled")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<any>(null)

  // Interviews loaded from backend
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: 1,
      candidateName: "Sarah Johnson",
      position: "Senior Frontend Developer",
      date: "2024-01-20",
      time: "10:00 AM",
      type: "video",
      status: "scheduled",
      interviewer: "John Doe",
      notes: "Technical interview focusing on React and TypeScript",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      round: "technical",
      roundNumber: 2,
      duration: "60 minutes",
      candidateEmail: "sarah.johnson@email.com",
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      position: "Product Manager",
      date: "2024-01-21",
      time: "2:00 PM",
      type: "phone",
      status: "confirmed",
      interviewer: "Jane Smith",
      notes: "Initial screening call",
      phone: "+1 (555) 123-4567",
      round: "screening",
      roundNumber: 1,
      duration: "30 minutes",
      candidateEmail: "michael.chen@email.com",
    },
    {
      id: 3,
      candidateName: "Emily Davis",
      position: "UX Designer",
      date: "2024-01-19",
      time: "11:00 AM",
      type: "in-person",
      status: "completed",
      interviewer: "Bob Wilson",
      notes: "Portfolio review and design challenge",
      location: "Office Conference Room A",
      round: "portfolio",
      roundNumber: 2,
      duration: "90 minutes",
      candidateEmail: "emily.davis@email.com",
      review: {
        rating: 4,
        feedback:
          "Excellent portfolio presentation. Strong design thinking and problem-solving skills. Good cultural fit.",
        technicalSkills: 4,
        communication: 5,
        problemSolving: 4,
        overallImpression: "Very positive",
        recommendation: "proceed",
        nextSteps: "Schedule final round with team lead",
      },
    },
    {
      id: 4,
      candidateName: "Alex Rodriguez",
      position: "Backend Developer",
      date: "2024-01-18",
      time: "3:00 PM",
      type: "video",
      status: "completed",
      interviewer: "Sarah Lee",
      notes: "System design and coding interview",
      meetingLink: "https://zoom.us/j/123456789",
      round: "system-design",
      roundNumber: 3,
      duration: "120 minutes",
      candidateEmail: "alex.rodriguez@email.com",
      review: {
        rating: 3,
        feedback:
          "Good technical knowledge but struggled with system design concepts. Needs improvement in scalability thinking.",
        technicalSkills: 3,
        communication: 4,
        problemSolving: 3,
        overallImpression: "Average",
        recommendation: "hold",
        nextSteps: "Discuss with team before proceeding",
      },
    },
  ])

  const [newInterview, setNewInterview] = useState({
    candidateName: "",
    candidateEmail: "",
    position: "",
    date: "",
    time: "",
    duration: "60 minutes",
    type: "video",
    interviewer: "",
    notes: "",
    meetingLink: "",
    phone: "",
    location: "",
    round: "screening",
    roundNumber: 1,
  })

  const [reviewData, setReviewData] = useState({
    rating: 3,
    feedback: "",
    technicalSkills: 3,
    communication: 3,
    problemSolving: 3,
    overallImpression: "",
    recommendation: "proceed",
    nextSteps: "",
  })

  const handleInputChange = (field: string, value: string | number) => {
    setNewInterview((prev) => ({ ...prev, [field]: value }))
  }

  const handleReviewChange = (field: string, value: string | number) => {
    setReviewData((prev) => ({ ...prev, [field]: value }))
  }

  const handleScheduleInterview = () => {
    // Only include phone, meetingLink, or location if relevant to the type
    const { phone, meetingLink, location, ...rest } = newInterview
    let interview: any = {
      ...rest,
      id: Date.now(),
      status: "scheduled",
      review: undefined, // Ensure type compatibility
    }
    if (newInterview.type === "video" && meetingLink) {
      interview.meetingLink = meetingLink
    }
    if (newInterview.type === "phone" && phone) {
      interview.phone = phone
    }
    if (newInterview.type === "in-person" && location) {
      interview.location = location
    }
    setInterviews((prev) => [...prev, interview])
    setIsDialogOpen(false)
    // Reset form
    setNewInterview({
      candidateName: "",
      candidateEmail: "",
      position: "",
      date: "",
      time: "",
      duration: "60 minutes",
      type: "video",
      interviewer: "",
      notes: "",
      meetingLink: "",
      phone: "",
      location: "",
      round: "screening",
      roundNumber: 1,
    })
  }

  const handleSubmitReview = async () => {
    if (!selectedInterview) return
    try {
      await saveInterviewReview(selectedInterview.id, reviewData as any)
      setInterviews((prev) => prev.map((iv) => iv.id === selectedInterview.id ? { ...iv, review: reviewData } : iv))
      setIsReviewDialogOpen(false)
      setReviewData({
        rating: 3,
        feedback: "",
        technicalSkills: 3,
        communication: 3,
        problemSolving: 3,
        overallImpression: "",
        recommendation: "proceed",
        nextSteps: "",
      })
    } catch (e) {
      console.error('Failed to save review', e)
    }
  }

  // Load interviews on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchInterviews()
        setInterviews(data)
      } catch (e) {
        console.error('Failed to load interviews', e)
      }
    })()
  }, [])

  const setStatus = async (id: number, status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateInterviewStatus(id, status)
      setInterviews(prev => prev.map(iv => iv.id === id ? { ...iv, status } : iv))
    } catch (e) {
      console.error('Failed to update interview status', e)
    }
  }

  // Stable, locale-independent date formatting to avoid hydration mismatches
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const dt = new Date(dateString)
    const y = dt.getUTCFullYear()
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0')
    const d = String(dt.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoundColor = (round: string) => {
    switch (round) {
      case "screening":
        return "bg-purple-100 text-purple-800"
      case "technical":
        return "bg-blue-100 text-blue-800"
      case "behavioral":
        return "bg-green-100 text-green-800"
      case "system-design":
        return "bg-orange-100 text-orange-800"
      case "portfolio":
        return "bg-pink-100 text-pink-800"
      case "final":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "in-person":
        return <MapPin className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const filterInterviews = (status: string) => {
    return interviews.filter((interview) => interview.status === status)
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const InterviewCard = ({ interview }: { interview: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getTypeIcon(interview.type)}
              <h4 className="font-semibold text-gray-900">{interview.candidateName}</h4>
              <Badge variant="outline" className={getStatusColor(interview.status)}>
                {interview.status}
              </Badge>
              <Badge variant="outline" className={getRoundColor(interview.round)}>
                Round {interview.roundNumber}: {interview.round}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{interview.position}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {typeof interview.date === 'string' ? (interview.date.split(' ')[0] || interview.date) : ''}
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {interview.time} ({interview.duration})
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-1">Interviewer: {interview.interviewer}</p>
            <p className="text-xs text-gray-500 mb-1">Email: {interview.candidateEmail}</p>

            {/* Meeting Link for Video Calls - Only show if not cancelled */}
            {interview.type === "video" && interview.meetingLink && interview.status !== "cancelled" && (
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent h-7 px-2"
                  onClick={() => window.open(interview.meetingLink, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Join Meeting
                </Button>
              </div>
            )}

            {/* Phone Number for Phone Calls */}
            {interview.type === "phone" && interview.phone && (
              <p className="text-xs text-blue-600 mt-1">📞 {interview.phone}</p>
            )}

            {/* Location for In-Person */}
            {interview.type === "in-person" && interview.location && (
              <p className="text-xs text-green-600 mt-1">📍 {interview.location}</p>
            )}

            {interview.notes && <p className="text-xs text-gray-500 mt-2">{interview.notes}</p>}

            {/* Review Summary for Completed Interviews */}
            {interview.status === "completed" && interview.review && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-gray-700">Rating:</span>
                  <div className="flex">{getRatingStars(interview.review.rating)}</div>
                  <span className="text-xs text-gray-600">({interview.review.rating}/5)</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  <span className="font-medium">Recommendation:</span> {interview.review.recommendation}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">{interview.review.feedback}</p>
              </div>
            )}
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col space-y-2 w-full sm:w-auto">
            {/* For cancelled interviews, only show the cancelled button */}
            {interview.status === "cancelled" ? (
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                disabled
              >
                <XCircle className="h-3 w-3 mr-1" />
                Cancelled
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                {interview.status === "scheduled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                    onClick={async () => {
                      await setStatus(interview.id, 'confirmed')
                      setActiveTab('confirmed')
                    }}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirm
                  </Button>
                )}
                {interview.status === "completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                    onClick={() => {
                      setSelectedInterview(interview)
                      if (interview.review) {
                        setReviewData(interview.review)
                      }
                      setIsReviewDialogOpen(true)
                    }}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {interview.review ? "Edit Review" : "Add Review"}
                  </Button>
                )}
                {interview.status === "confirmed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                    onClick={async () => {
                      await setStatus(interview.id, 'completed')
                      setActiveTab('completed')
                    }}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark Completed
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                  onClick={async () => {
                    await setStatus(interview.id, 'cancelled')
                    setActiveTab('cancelled')
                  }}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <BackButton/>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview Tracker</h1>
          <p className="text-white">Schedule and manage candidate interviews with rounds and reviews</p>
        </div>
        
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filterInterviews("scheduled").length}</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filterInterviews("confirmed").length}</p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filterInterviews("completed").length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{filterInterviews("cancelled").length}</p>
                <p className="text-sm text-gray-600">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Review - {selectedInterview?.candidateName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating">Overall Rating *</Label>
                <Select
                  value={reviewData.rating.toString()}
                  onValueChange={(value) => handleReviewChange("rating", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor</SelectItem>
                    <SelectItem value="2">2 - Below Average</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="recommendation">Recommendation *</Label>
                <Select
                  value={reviewData.recommendation}
                  onValueChange={(value) => handleReviewChange("recommendation", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proceed">Proceed to Next Round</SelectItem>
                    <SelectItem value="hire">Hire</SelectItem>
                    <SelectItem value="hold">Hold</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="technicalSkills">Technical Skills</Label>
                <Select
                  value={reviewData.technicalSkills.toString()}
                  onValueChange={(value) => handleReviewChange("technicalSkills", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor</SelectItem>
                    <SelectItem value="2">2 - Below Average</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="communication">Communication</Label>
                <Select
                  value={reviewData.communication.toString()}
                  onValueChange={(value) => handleReviewChange("communication", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor</SelectItem>
                    <SelectItem value="2">2 - Below Average</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="problemSolving">Problem Solving</Label>
                <Select
                  value={reviewData.problemSolving.toString()}
                  onValueChange={(value) => handleReviewChange("problemSolving", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor</SelectItem>
                    <SelectItem value="2">2 - Below Average</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="overallImpression">Overall Impression</Label>
                <Input
                  id="overallImpression"
                  value={reviewData.overallImpression}
                  onChange={(e) => handleReviewChange("overallImpression", e.target.value)}
                  placeholder="e.g., Very positive, Average, Needs improvement"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="feedback">Detailed Feedback *</Label>
              <Textarea
                id="feedback"
                value={reviewData.feedback}
                onChange={(e) => handleReviewChange("feedback", e.target.value)}
                placeholder="Provide detailed feedback about the candidate's performance, strengths, areas for improvement, etc."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="nextSteps">Next Steps</Label>
              <Textarea
                id="nextSteps"
                value={reviewData.nextSteps}
                onChange={(e) => handleReviewChange("nextSteps", e.target.value)}
                placeholder="What are the recommended next steps? Schedule another round, make an offer, etc."
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              >
                Save Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interview Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="scheduled">Scheduled ({filterInterviews("scheduled").length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({filterInterviews("confirmed").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filterInterviews("completed").length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({filterInterviews("cancelled").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterInterviews("scheduled").map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
          {filterInterviews("scheduled").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No scheduled interviews</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterInterviews("confirmed").map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
          {filterInterviews("confirmed").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No confirmed interviews</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterInterviews("completed").map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
          {filterInterviews("completed").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No completed interviews</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterInterviews("cancelled").map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
          {filterInterviews("cancelled").length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No cancelled interviews</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}