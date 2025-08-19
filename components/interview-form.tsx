"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, Users, Mail, Video, Loader2 } from "lucide-react"
import { getMeetUrl } from "@/lib/api-config"
import { useSearchParams } from "next/navigation"

export default function InterviewScheduler() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ meetLink?: string; eventLink?: string; error?: string } | null>(null)
  const searchParams = useSearchParams()
  const jobId = searchParams.get("job_id") || ""
  const jobTitle = searchParams.get("job_title") || "Interview"
  const candidateEmail = searchParams.get("candidate_email") || ""
  const candidateName = searchParams.get("candidate_name") || ""
  const employerEmailParam = searchParams.get("employer_email") || ""
  const authKey = searchParams.get("auth_key") || ""
  const [formData, setFormData] = useState({
    title: "Interview with Candidate",
    description: "Interview scheduled via CareerAdvance",
    start: "",
    end: "",
    attendees: "",
    employerEmail: "",
  })

  // Prefill form from query params
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      title: jobTitle ? `Interview: ${jobTitle}` : prev.title,
      attendees: [candidateEmail, employerEmailParam].filter(Boolean).join(", "),
      employerEmail: employerEmailParam,
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("start", formData.start)
      data.append("end", formData.end)
      data.append("attendees", formData.attendees)
      data.append("job_id", jobId)
      data.append("employer_email", formData.employerEmail)
      if (authKey) data.append("auth_key", authKey)
      // Optional fields for richer emails
      if (candidateName) data.append("candidate_name", candidateName)
      const dt = formData.start ? new Date(formData.start) : null
      if (dt) {
        data.append("proposed_date", dt.toLocaleDateString())
        data.append("proposed_time", dt.toLocaleTimeString())
      }
      data.append("mode", "Google Meet")

      const meetUrl = getMeetUrl("/create_event");
      console.log('Sending request to:', meetUrl);
      console.log('Form data:', Object.fromEntries(data.entries()));

      const res = await fetch(meetUrl, {
        method: "POST",
        body: data,
        // Avoid custom headers to prevent preflight during localhost dev
        credentials: 'include',
      })
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      const json = await res.json().catch(async () => {
        const text = await res.text()
        console.log('Response text:', text);
        throw new Error(text || "Server error")
      })
      if (!json.success) throw new Error(json.message || "Failed to create event")
      setIsLoading(false)
      setResult({ meetLink: json.meet_link, eventLink: json.event_link })
    } catch (err: any) {
      setIsLoading(false)
      setResult({ error: err?.message || String(err) })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <Button
            variant="outline"
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-200 hover:border-emerald-300"
            onClick={() => { window.close() }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="p-2 bg-emerald-600 rounded-xl">
            <Video className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interview Scheduler</h1>
            <p className="text-sm text-gray-600">Schedule your Google Meet interviews</p>
          </div>
        </div>

        <a
          className="inline-flex items-center border border-emerald-200 bg-transparent hover:bg-emerald-50 hover:text-emerald-600 text-gray-700 px-4 py-2 rounded-lg transition"
          href={getMeetUrl("/logout")}
          target="_blank"
        >
          <ArrowLeft className="h-4 w-4 mr-2 text-emerald-600 rotate-180" />
          Logout Google
        </a>
      </div>

      {/* Main Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-xl text-gray-900 font-bold">Create New Interview</CardTitle>
            <p className="text-gray-600">Set up a Google Meet session for your interview</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Interview Title
                </Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="e.g., Frontend Developer Interview"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[100px] border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                  placeholder="Add interview details, agenda, or special instructions..."
                />
              </div>

              {/* Time Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    Start Time
                  </Label>
                  <Input
                    type="datetime-local"
                    name="start"
                    id="start"
                    value={formData.start}
                    onChange={handleInputChange}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    step={"1"}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    End Time
                  </Label>
                  <Input
                    type="datetime-local"
                    name="end"
                    id="end"
                    value={formData.end}
                    onChange={handleInputChange}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                    step={"1"}
                    required
                  />
                </div>
              </div>

              {/* Attendees Field */}
              <div className="space-y-2">
                <Label htmlFor="attendees" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Attendees
                </Label>
                <Input
                  type="text"
                  name="attendees"
                  id="attendees"
                  value={formData.attendees}
                  onChange={handleInputChange}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="candidate@email.com, hr@company.com"
                  required
                />
                <p className="text-xs text-gray-500">Separate multiple email addresses with commas</p>
              </div>

              {/* Employer Email Field */}
              <div className="space-y-2">
                <Label htmlFor="employerEmail" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  Employer Email
                </Label>
                <Input
                  type="email"
                  name="employerEmail"
                  id="employerEmail"
                  value={formData.employerEmail}
                  onChange={handleInputChange}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="employer@email.com"
                  required
                />
                <p className="text-xs text-gray-500">This email will receive a notification about the interview</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Interview...
                  </>
                ) : (
                  <>
                    <Video className="h-5 w-5 mr-2" />
                    Create Google Meet Interview
                  </>
                )}
              </Button>

              {/* Result Area */}
              {result && (
                <div className="mt-4 text-center">
                  {result.error ? (
                    <div className="text-red-600">Error: {result.error}</div>
                  ) : (
                    <div className="text-green-700">
                      <div className="font-medium">Event created!</div>
                      {result.meetLink && (
                        <div>
                          <a className="text-emerald-700 underline" href={result.meetLink} target="_blank" rel="noreferrer">Join Google Meet</a>
                        </div>
                      )}
                      {result.eventLink && (
                        <div>
                          <a className="text-emerald-700 underline" href={result.eventLink} target="_blank" rel="noreferrer">View in Google Calendar</a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </form>
            {/* Login with Google (if needed) */}
            <div className="mt-4 text-center">
              <a
                href={`${getMeetUrl("/login")}?job_id=${encodeURIComponent(jobId)}`}
                target="_blank"
                className="inline-block px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
              >
                Connect Google Calendar
              </a>
            </div>

            {/* Loading Spinner */}
            {isLoading && (
              <div className="flex justify-center items-center mt-4">
                <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">Powered by Google Meet • Secure and reliable video conferencing</p>
        </div>
      </div>
    </div>
  )
}
