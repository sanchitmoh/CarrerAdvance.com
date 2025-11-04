"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Clock, DollarSign, Briefcase, Share2, Bookmark } from "lucide-react"

// Sample jobs data - same as parent page
const jobsData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description:
      "We are looking for an experienced frontend developer to join our innovative team and build cutting-edge web applications using React, Next.js, and TypeScript.",
    fullDescription:
      "We are looking for an experienced frontend developer to join our innovative team and build cutting-edge web applications using React, Next.js, and TypeScript. In this role, you will:\n\n• Design and implement scalable frontend architecture\n• Collaborate with designers and backend engineers\n• Optimize application performance and user experience\n• Mentor junior developers and contribute to code quality\n• Participate in code reviews and architectural discussions",
    requirements: ["React", "TypeScript", "Next.js", "5+ years experience"],
    postedDate: "2024-01-15",
    logo: "/placeholder.svg?height=60&width=60&text=TC",
    featured: true,
    benefits: ["Health Insurance", "Remote Options", "401k", "Stock Options"],
    company_description:
      "TechCorp Inc. is a leading provider of enterprise software solutions serving Fortune 500 companies.",
  },
  {
    id: 2,
    title: "Digital Marketing Manager",
    company: "Growth Solutions",
    location: "New York, NY",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    description:
      "Lead our digital marketing initiatives and drive customer acquisition through innovative marketing strategies including SEO, SEM, and social media.",
    fullDescription:
      "Lead our digital marketing initiatives and drive customer acquisition through innovative marketing strategies including SEO, SEM, and social media. This is an exciting opportunity to:\n\n• Develop and execute comprehensive digital marketing strategies\n• Manage marketing team and budget allocation\n• Analyze performance metrics and optimize campaigns\n• Lead cross-functional collaboration with sales and product teams",
    requirements: ["SEO/SEM", "Google Analytics", "Social Media", "3+ years experience"],
    postedDate: "2024-01-14",
    logo: "/placeholder.svg?height=60&width=60&text=GS",
    featured: false,
    benefits: ["Health Insurance", "Training Budget", "Flexible Hours", "Remote Options"],
    company_description: "Growth Solutions is a digital marketing agency specializing in B2B SaaS companies.",
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    description:
      "Analyze complex datasets and build predictive models to drive business insights and decision-making using Python and machine learning techniques.",
    fullDescription:
      "Analyze complex datasets and build predictive models to drive business insights and decision-making using Python and machine learning techniques. You will:\n\n• Design and implement machine learning models\n• Conduct exploratory data analysis and statistical testing\n• Collaborate with product and engineering teams\n• Present insights to stakeholders",
    requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
    postedDate: "2024-01-13",
    logo: "/placeholder.svg?height=60&width=60&text=AP",
    featured: true,
    benefits: ["Competitive Salary", "Remote Work", "Professional Development", "Stock Options"],
    company_description: "Analytics Pro is a leading data analytics consulting firm.",
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Design Studio",
    location: "Los Angeles, CA",
    type: "Contract",
    salary: "$70 - $90/hour",
    description:
      "Create intuitive user experiences for our mobile applications and help shape the future of digital design with a focus on user-centered principles.",
    fullDescription:
      "Create intuitive user experiences for our mobile applications and help shape the future of digital design with a focus on user-centered principles. In this role, you will:\n\n• Lead UX research and user testing initiatives\n• Design wireframes, prototypes, and high-fidelity mockups\n• Develop and maintain design systems\n• Collaborate with developers and product managers",
    requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
    postedDate: "2024-01-12",
    logo: "/placeholder.svg?height=60&width=60&text=DS",
    featured: false,
    benefits: ["Flexible Schedule", "Equipment Provided", "Collaboration with Experts"],
    company_description: "Design Studio is a creative design agency working with innovative startups.",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$95,000 - $125,000",
    description:
      "Build and maintain scalable infrastructure and deployment pipelines for our cloud-native applications, ensuring high availability and performance.",
    fullDescription:
      "Build and maintain scalable infrastructure and deployment pipelines for our cloud-native applications, ensuring high availability and performance. This position involves:\n\n• Design and implement CI/CD pipelines\n• Manage cloud infrastructure on AWS/GCP\n• Monitor system performance and troubleshoot issues\n• Implement security best practices",
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    postedDate: "2024-01-11",
    logo: "/placeholder.svg?height=60&width=60&text=CT",
    featured: false,
    benefits: ["Competitive Salary", "Health Insurance", "Tech Budget", "Remote Options"],
    company_description: "CloudTech Solutions provides enterprise cloud solutions to global companies.",
  },
  {
    id: 6,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    description:
      "Drive product strategy and roadmap for our next-generation SaaS platform serving millions of users, from ideation to market launch.",
    fullDescription:
      "Drive product strategy and roadmap for our next-generation SaaS platform serving millions of users, from ideation to market launch. Your responsibilities will include:\n\n• Define product vision and strategy\n• Conduct market research and competitive analysis\n• Manage product development lifecycle\n• Communicate with stakeholders and customers",
    requirements: ["Product Strategy", "Agile", "Analytics", "4+ years experience"],
    postedDate: "2024-01-10",
    logo: "/placeholder.svg?height=60&width=60&text=IL",
    featured: true,
    benefits: ["Exceptional Salary", "Equity", "Health Insurance", "Unlimited PTO"],
    company_description: "Innovation Labs is a leading SaaS platform company with millions of users.",
  },
]

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const jobId = Number.parseInt(params.id)
  const currentJob = jobsData.find((job) => job.id === jobId)
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
          <Link href="/jobs">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/jobs">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Other Jobs Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Other Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {jobsData.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        job.id === jobId
                          ? "bg-emerald-100 border-2 border-emerald-500"
                          : "border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      <p
                        className={`font-semibold text-sm line-clamp-2 ${
                          job.id === jobId ? "text-emerald-700" : "text-gray-900"
                        }`}
                      >
                        {job.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{job.company}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(job.postedDate)}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
            {/* Job Header */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={currentJob.logo || "/placeholder.svg"}
                      alt={currentJob.company}
                      className="w-16 h-16 rounded-xl border border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {currentJob.featured && (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Featured</Badge>
                        )}
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentJob.title}</h1>
                      <p className="text-xl text-emerald-600 font-semibold mb-3">{currentJob.company}</p>
                      <p className="text-gray-600 mb-4">{currentJob.company_description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setSavedJobs((prev) =>
                          prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId],
                        )
                      }
                      className={savedJobs.includes(jobId) ? "text-emerald-600 border-emerald-600 bg-emerald-50" : ""}
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobs.includes(jobId) ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Job ID */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Job ID:</span> #{currentJob.id.toString().padStart(6, "0")}
                  </p>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{currentJob.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{currentJob.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-semibold text-gray-900">{currentJob.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="font-semibold text-gray-900">{formatDate(currentJob.postedDate)}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 h-auto">
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-3 h-auto bg-transparent"
                  >
                    Save Job
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>About This Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentJob.fullDescription}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {currentJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentJob.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Company */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>About {currentJob.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{currentJob.company_description}</p>
              </CardContent>
            </Card>

            {/* Apply Section */}
            <Card className="border-0 shadow-lg bg-emerald-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Apply?</h3>
                <p className="text-gray-600 mb-6">
                  Submit your application now and let's start a great journey together!
                </p>
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 h-auto">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
