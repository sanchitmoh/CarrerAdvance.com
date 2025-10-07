"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Users,
  Globe,
  Rocket,
  GraduationCap,
  Briefcase,
  Heart,
  TrendingUp,
  Award,
  Clock,
  Zap,
  ArrowRight,
  Star,
  Shield,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

export default function AboutUsPage() {
  const values = [
    {
      icon: Target,
      title: "Mission Driven",
      description: "Transforming career journeys through accessible opportunities and expert guidance.",
      color: "text-emerald-600"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a dynamic ecosystem where talent meets opportunity globally.",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging smart technology to personalize career advancement for everyone.",
      color: "text-teal-600"
    },
    {
      icon: Heart,
      title: "Empowerment",
      description: "Helping individuals and businesses achieve their full potential.",
      color: "text-lime-600"
    }
  ]

  const stats = [
    { number: "50K+", label: "Active Job Seekers", icon: Users },
    { number: "5K+", label: "Partner Companies", icon: Briefcase },
    { number: "10K+", label: "Learning Courses", icon: GraduationCap },
    { number: "95%", label: "Success Rate", icon: Award },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/api/placeholder/100/100",
      description: "Passionate about bridging the gap between education and employment.",
      expertise: ["Tech Innovation", "Leadership", "Strategy"]
    },
    {
      name: "Michael Chen",
      role: "Head of Learning",
      image: "/api/placeholder/100/100",
      description: "Dedicated to creating transformative learning experiences.",
      expertise: ["Education", "Curriculum Design", "Mentorship"]
    },
    {
      name: "Emily Davis",
      role: "Product Director",
      image: "/api/placeholder/100/100",
      description: "Focused on building intuitive platforms that connect talent with opportunity.",
      expertise: ["Product Management", "UX Design", "Technology"]
    }
  ]

  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting job seekers, employers, and learners worldwide with localized opportunities."
    },
    {
      icon: Rocket,
      title: "Smart Matching",
      description: "AI-powered technology that personalizes job and course recommendations for optimal fit."
    },
    {
      icon: GraduationCap,
      title: "Lifelong Learning",
      description: "Comprehensive skill development courses to keep you ahead in your career journey."
    },
    {
      icon: Briefcase,
      title: "Career Guidance",
      description: "Expert advice and resources to navigate your professional path with confidence."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto  space-y-16 px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-1.5 mt-20 text-sm bg-white border-emerald-200 text-emerald-700">
              <Rocket className="h-4 w-4 mr-1" />
              Founded in 2024
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              About <span className="text-emerald-600">Career Advance</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your ultimate employment and learning hub, dedicated to connecting job seekers, employers, and learners worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
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

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-emerald-600 to-green-600 text-white">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Our Mission</h3>
                  <p className="text-emerald-100">Transforming career journeys worldwide</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed">
                To transform career journeys by providing access to thousands of opportunities, expert career advice, 
                and comprehensive skill development courses that empower individuals and businesses to achieve their full potential.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-emerald-100">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                  <p className="text-gray-600">A world where talent meets opportunity</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We envision a dynamic global ecosystem where continuous learning drives professional growth, 
                and every individual has the tools and opportunities to build their dream career with confidence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">What We Do</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We leverage smart technology and personalized matching to create meaningful connections 
              between talent and opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-emerald-50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at Career Advance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white border-emerald-50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className={`h-6 w-6 ${value.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to advancing careers worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-white border-emerald-50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {member.role}
                    </Badge>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 text-white overflow-hidden">
          <CardContent className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Why Choose Career Advance?</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Trusted Platform</h4>
                      <p className="text-emerald-100 text-sm">
                        Secure, reliable, and built with your career success in mind.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Proven Results</h4>
                      <p className="text-emerald-100 text-sm">
                        95% success rate in helping professionals achieve their career goals.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Expert Guidance</h4>
                      <p className="text-emerald-100 text-sm">
                        Access to industry experts and career coaches for personalized advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                      <Award className="h-16 w-16 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-white border-emerald-100 text-center">
          <CardContent className="p-12 space-y-6">
            <GraduationCap className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">Join Our Community</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Ready to advance your career with confidence? Join thousands of professionals who have transformed their careers with Career Advance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href={"/job-seekers/login"}>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8">
                Start the Journey
                <Rocket className="h-4 w-4 ml-2" />
              </Button>
              </Link>
              <Link href={"/courses"}>
              <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold px-8">
                View Programs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}