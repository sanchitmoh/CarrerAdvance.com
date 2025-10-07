"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  TrendingUp,
  Award,
  Clock,
  Building,
  MapPin,
  GraduationCap,
  Rocket,
  Target,
  Users,
  Calendar,
  ArrowRight,
  Quote,
  ThumbsUp,
  Share2,
} from "lucide-react"

export default function SuccessStoriesPage() {
  const [activeTab, setActiveTab] = useState("all")

  const successStories = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Product Manager",
      company: "TechInnovate",
      image: "/api/placeholder/80/80",
      previousRole: "Product Manager",
      previousCompany: "StartUpXYZ",
      duration: "8 months",
      salaryIncrease: "45%",
      story: "The career coaching program helped me develop strategic thinking and leadership skills that were crucial for my promotion to Senior PM. The mock interviews and negotiation guidance were invaluable.",
      achievements: ["Led 3 successful product launches", "Promoted within 8 months", "40% team growth under leadership"],
      rating: 5,
      category: "technology",
      tags: ["Product Management", "Leadership", "Tech"],
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Lead Software Engineer",
      company: "DataSystems Inc",
      image: "/api/placeholder/80/80",
      previousRole: "Senior Developer",
      previousCompany: "WebSolutions",
      duration: "6 months",
      salaryIncrease: "52%",
      story: "Transitioning from senior developer to lead engineer was challenging, but the technical leadership training and mentorship gave me the confidence to take on larger responsibilities.",
      achievements: ["Improved team velocity by 35%", "Mentored 4 junior developers", "Reduced system latency by 60%"],
      rating: 5,
      category: "technology",
      tags: ["Engineering", "Leadership", "Software"],
    },
    {
      id: 3,
      name: "Jessica Williams",
      role: "Marketing Director",
      company: "GlobalBrands Co",
      image: "/api/placeholder/80/80",
      previousRole: "Marketing Manager",
      previousCompany: "LocalMarket Inc",
      duration: "11 months",
      salaryIncrease: "65%",
      story: "The executive presence training and strategic marketing workshops completely transformed my career trajectory. I learned how to communicate value effectively to C-level executives.",
      achievements: ["Increased ROI by 150%", "Built 10-person team", "Won 3 industry awards"],
      rating: 5,
      category: "marketing",
      tags: ["Marketing", "Leadership", "Strategy"],
    },
    {
      id: 4,
      name: "David Kim",
      role: "UX Design Lead",
      company: "CreativeDigital",
      image: "/api/placeholder/80/80",
      previousRole: "UI/UX Designer",
      previousCompany: "DesignStudio",
      duration: "9 months",
      salaryIncrease: "48%",
      story: "The portfolio review and design leadership coaching helped me transition from individual contributor to leading a design team. The career advice was spot-on!",
      achievements: ["Shipped 5 major features", "Improved user satisfaction by 40%", "Built design system from scratch"],
      rating: 5,
      category: "design",
      tags: ["Design", "UX", "Leadership"],
    },
    {
      id: 5,
      name: "Amanda Thompson",
      role: "Data Science Manager",
      company: "AI Solutions Ltd",
      image: "/api/placeholder/80/80",
      previousRole: "Data Scientist",
      previousCompany: "AnalyticsPro",
      duration: "7 months",
      salaryIncrease: "55%",
      story: "The technical leadership program and business communication training were exactly what I needed to move into management while maintaining my technical edge.",
      achievements: ["Delivered $2M in cost savings", "Built 8-person data team", "Implemented ML pipeline"],
      rating: 5,
      category: "technology",
      tags: ["Data Science", "AI", "Management"],
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Sales Director",
      company: "EnterpriseSolutions",
      image: "/api/placeholder/80/80",
      previousRole: "Account Executive",
      previousCompany: "SalesTech",
      duration: "10 months",
      salaryIncrease: "70%",
      story: "The advanced sales training and leadership development program helped me triple my team's performance and secure a director position.",
      achievements: ["Exceeded targets by 200%", "Built top-performing team", "Closed $5M+ deals"],
      rating: 5,
      category: "sales",
      tags: ["Sales", "Leadership", "Enterprise"],
    },
  ]

  const featuredStory = successStories[0]

  const stats = [
    { number: "500+", label: "Career Advancements", icon: TrendingUp },
    { number: "95%", label: "Success Rate", icon: Award },
    { number: "45%", label: "Average Salary Increase", icon: Rocket },
    { number: "8.2", label: "Average Months to Promotion", icon: Clock },
  ]

  const categories = [
    { id: "all", label: "All Stories", count: successStories.length },
    { id: "technology", label: "Technology", count: successStories.filter(s => s.category === "technology").length },
    { id: "marketing", label: "Marketing", count: successStories.filter(s => s.category === "marketing").length },
    { id: "design", label: "Design", count: successStories.filter(s => s.category === "design").length },
    { id: "sales", label: "Sales", count: successStories.filter(s => s.category === "sales").length },
  ]

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technology":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "marketing":
        return "bg-green-100 text-green-800 border-green-200"
      case "design":
        return "bg-teal-100 text-teal-800 border-teal-200"
      case "sales":
        return "bg-lime-100 text-lime-800 border-lime-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredStories = activeTab === "all" 
    ? successStories 
    : successStories.filter(story => story.category === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto space-y-12 px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" className="px-4 py-1.5 text-sm bg-white border-emerald-200 text-emerald-700">
              <TrendingUp className="h-4 w-4 mr-1" />
              Real Career Transformations
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Success <span className="text-emerald-600">Stories</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how professionals like you achieved remarkable career growth and landed their dream roles
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-white/80 backdrop-blur-sm border-emerald-100">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-emerald-600" />
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Story */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 space-y-6">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    Featured Story
                  </Badge>
                  <div className="flex">{getRatingStars(featuredStory.rating)}</div>
                </div>
                
                <div className="space-y-4">
                  <Quote className="h-8 w-8 text-white/60" />
                  <blockquote className="text-xl lg:text-2xl font-semibold leading-relaxed">
                    "{featuredStory.story}"
                  </blockquote>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{featuredStory.name}</div>
                    <div className="text-white/80">{featuredStory.role} at {featuredStory.company}</div>
                    <div className="flex items-center space-x-4 text-sm text-white/60 mt-1">
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {featuredStory.salaryIncrease} salary increase
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {featuredStory.duration}
                      </span>
                    </div>
                  </div>
                </div>

               
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center p-8 lg:p-12">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <Award className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">Career Transformation</div>
                    <div className="text-white/80 text-lg">
                      {featuredStory.previousRole} → {featuredStory.role}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    {featuredStory.achievements.slice(0, 2).map((achievement, index) => (
                      <div key={index} className="text-center">
                        <Target className="h-6 w-6 mx-auto mb-2 text-white/80" />
                        <div className="text-sm">{achievement}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Inspiring Career Journeys</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse success stories from professionals across different industries and roles
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white p-1 border border-emerald-100">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all duration-200"
                >
                  {category.label} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <Card key={story.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-emerald-50">
                    <CardContent className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                            {story.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{story.name}</div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="h-3 w-3 mr-1" />
                              {story.company}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className={getCategoryColor(story.category)}>
                          {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                        </Badge>
                      </div>

                      {/* Career Progress */}
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 space-y-2 border border-emerald-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Before</span>
                          <span className="text-gray-600">After</span>
                        </div>
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-emerald-600">{story.previousRole}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="text-green-600">{story.role}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{story.previousCompany}</span>
                          <span>{story.duration}</span>
                        </div>
                      </div>

                      {/* Story Excerpt */}
                      <div className="space-y-3">
                        <Quote className="h-4 w-4 text-emerald-400" />
                        <p className="text-gray-600 text-sm line-clamp-3">
                          "{story.story}"
                        </p>
                      </div>

                      {/* Achievements */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                          <Target className="h-3 w-3 text-emerald-500" />
                          <span>Key Achievements</span>
                        </div>
                        <ul className="space-y-1">
                          {story.achievements.slice(0, 2).map((achievement, index) => (
                            <li key={index} className="flex items-start text-xs text-gray-600">
                              <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-emerald-50">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center text-emerald-600 font-semibold">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {story.salaryIncrease}
                          </span>
                          <div className="flex items-center">
                            {getRatingStars(story.rating)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-center overflow-hidden">
          <CardContent className="p-12 space-y-6 relative">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10">
              <GraduationCap className="h-12 w-12 mx-auto text-emerald-300 mb-4" />
              <div className="space-y-3">
                <h2 className="text-3xl font-bold">Ready to Write Your Success Story?</h2>
                <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                  Join thousands of professionals who have transformed their careers with our proven coaching programs
                </p>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}