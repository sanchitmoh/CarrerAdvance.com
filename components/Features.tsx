"use client"

import { Brain, Rocket, Target, Users, BarChart3, Zap, Lightbulb } from "lucide-react"
import { useRef, useEffect, useState } from "react"

const employerFeatures = [
  {
    icon: Users,
    title: "Smart Talent Acquisition",
    description:
      "Find and hire top talent with our AI-powered candidate matching system. Access a pool of pre-vetted professionals aligned with your company's needs and culture.",
    color: "from-emerald-500 to-green-500",
    delay: 0,
  },
  {
    icon: BarChart3,
    title: "Streamlined Hiring Workflow",
    description:
      "Manage the entire recruitment process from job posting to hiring. Track applications, conduct interviews, and collaborate with your team all in one platform.",
    color: "from-green-500 to-teal-500",
    delay: 0.2,
  },
  {
    icon: Zap,
    title: "Employee Management Suite",
    description:
      "Manage attendance, payroll, performance, and documents seamlessly. Keep all employee information organized and accessible with our comprehensive management tools.",
    color: "from-teal-500 to-lime-500",
    delay: 0.4,
  },
]

const jobSeekerFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Job Matching",
    description:
      "Our advanced AI analyzes your skills, experience, and preferences to match you with perfect opportunities, saving you time and effort.",
    color: "from-emerald-500 to-green-500",
    delay: 0,
  },
  {
    icon: Rocket,
    title: "Career Acceleration Paths",
    description:
      "Fast-track your career with personalized learning paths, skill development recommendations, and expert-led courses tailored to your goals.",
    color: "from-green-500 to-teal-500",
    delay: 0.2,
  },
  {
    icon: Target,
    title: "Precision Job Targeting",
    description:
      "Connect with the right employers and opportunities that align precisely with your career goals, values, and aspirations, not just keywords.",
    color: "from-teal-500 to-lime-500",
    delay: 0.4,
  },
]

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [userType, setUserType] = useState<"employer" | "jobseeker">("jobseeker")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const features = userType === "employer" ? employerFeatures : jobSeekerFeatures

  return (
    <section className="py-32 bg-gradient-to-br from-white via-emerald-50/30 to-green-50/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 md:mb-20 transition-all duration-600 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm font-semibold mb-6 transition-transform duration-300 hover:scale-105">
            <Lightbulb className="w-4 h-4 mr-2" />
            Innovative Solutions
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 md:mb-8 tracking-tight text-balance">
            {userType === "employer" ? (
              <>
                Build Your Dream{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Team
                </span>
              </>
            ) : (
              <>
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Dominate Your Career
                </span>
              </>
            )}
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            {userType === "employer"
              ? "Experience the future of talent acquisition and employee management with our cutting-edge platform."
              : "Experience the future of career development with our cutting-edge platform designed for ambitious professionals."}
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setUserType("jobseeker")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                userType === "jobseeker"
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setUserType("employer")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                userType === "employer"
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              For Employers
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative modern-card p-8 hover:shadow-2xl transition-all duration-500 border-2 border-gray-200/50 hover:border-emerald-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: isInView ? `${feature.delay}s` : "0s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-lg font-medium">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}