"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CheckCircle, Sparkles, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function LearnMore() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-screen py-32 bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 flex flex-col items-center justify-center text-center px-6"
    >
      {/* 🌈 Background Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-green-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-3xl animate-[pulse_10s_infinite_alternate]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-green-600/5 to-lime-600/5 rounded-full blur-3xl animate-[pulse_12s_infinite_alternate_2s]"></div>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* 🌟 Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Badge */}
        <div
          className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Discover CareerAdvance
          <Star className="w-4 h-4 ml-2" />
        </div>

        {/* Title */}
        <h1
          className={`text-5xl md:text-7xl font-extrabold text-white tracking-tight transition-all duration-700 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          About{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
            Career Advance
          </span>
        </h1>

        {/* Description */}
        <p
          className={`text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto font-medium transition-all duration-700 delay-400 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          CareerAdvance is your all-in-one job and hiring ecosystem designed for both
          job seekers and employers. We simplify the entire process — from applying,
          managing profiles, and tracking progress, to finding top-tier talent.
          Your career growth starts here.
        </p>

        {/* 🚀 Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row justify-center gap-8 transition-all duration-700 delay-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-4 text-xl font-bold shadow-2xl hover:shadow-emerald-400/25 transition-all duration-300 rounded-2xl"
            onClick={() => router.push("/job-seekers/login")}
          >
            Job Seekers Login
          </Button>

          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white px-12 py-4 text-xl font-bold shadow-2xl hover:shadow-emerald-400/25 transition-all duration-300 rounded-2xl"
            onClick={() => router.push("/employers/login")}
          >
            Employers Login
          </Button>
        </div>

        {/* ✅ Info Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto text-emerald-200 pt-12 transition-all duration-700 delay-800 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">Smart Career Tools</span>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">Seamless Hiring Process</span>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-medium">Empowering Job Seekers</span>
          </div>
        </div>
      </div>
    </section>
  )
}