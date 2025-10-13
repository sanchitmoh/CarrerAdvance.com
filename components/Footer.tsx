"use client"
import { useCallback } from "react"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Heart, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Footer() {
  const router = useRouter()

  const handlePostJobClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      e.preventDefault()
      const hasCookie = typeof document !== 'undefined' && document.cookie.includes('employer_id=')
      const hasLocal = typeof window !== 'undefined' && !!window.localStorage?.getItem('employer_id')
      const isLoggedIn = hasCookie || hasLocal
      if (isLoggedIn) {
        router.push('/employers/dashboard/jobs?tab=post')
      } else {
        router.push('/employers/login')
      }
    } catch {
      router.push('/employers/login')
    }
  }, [router])
  const footerSections = [
    {
      title: "For Job Seekers",
      links: [
        { name: "Browse Jobs", href: "/jobs" },
        { name: "Create Profile", href: "/register" },
        { name: "Resume Builder", href: "/resume-builder" },
        { name: "Career Advice", href: "/career-advice" },
        { name: "Salary Guide", href: "/salary-guide" },
      ],
    },
    {
      title: "For Employers",
      links: [
        { name: "Post a Job", href: "/post-job" },
        { name: "Browse Candidates", href: "/candidates" },
        { name: "Employer Dashboard", href: "/employer-dashboard" },
        { name: "Pricing Plans", href: "/pricing" },
        { name: "Success Stories", href: "/success-stories" },
      ],
    },
    {
      title: "Learning",
      links: [
        { name: "Online Courses", href: "/courses" },
        { name: "Certifications", href: "/certifications" },
        { name: "Skill Assessments", href: "/assessments" },
        { name: "Learning Paths", href: "/learning-paths" },
        { name: "Webinars", href: "/webinars" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Contact", href: "/contact" },
      ],
    },
  ]

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/30 to-black"></div>

        {/* Animated orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/20 to-lime-500/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_2s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite_4s]"></div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(16,185,129,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 border-b border-white/10">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center group">
              <div className="relative">
                <img
                  src="/logo3.png"
                  alt="CareerAdvance Logo"
                  className="h-30 w-100 object-contain transition-transform duration-300 hover:scale-105 active:scale-95"
                />
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Empowering careers through cutting-edge technology, intelligent job matching, and transformative learning
              experiences.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, color: "hover:bg-emerald-500/20 hover:text-emerald-400" },
                { Icon: Twitter, color: "hover:bg-green-500/20 hover:text-green-400" },
                { Icon: Linkedin, color: "hover:bg-teal-500/20 hover:text-teal-400" },
                { Icon: Instagram, color: "hover:bg-lime-500/20 hover:text-lime-400" },
              ].map(({ Icon, color }, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`group relative w-11 h-11 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 ${color} hover:border-white/20 hover:-translate-y-1`}
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider relative inline-block">
                  {section.title}
                  <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"></span>
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a
                        href={link.href}
                        onClick={link.name === 'Post a Job' ? handlePostJobClick : undefined}
                        className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Bar */}
        <div className="py-8 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Mail, text: "info@careeradvance.com", label: "Email Us", gradient: "from-emerald-500 to-green-500" },
              { icon: Phone, text: "+1 365 990 2111", label: "Call Us", gradient: "from-green-500 to-teal-500" },
              { icon: MapPin, text: "Toronto, ON, Canada", label: "Visit Us", gradient: "from-teal-500 to-lime-500" },
            ].map((contact, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:bg-white/10"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${contact.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <contact.icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{contact.label}</div>
                  <div className="text-sm text-white font-medium truncate">{contact.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start text-sm text-gray-500 gap-1">
              <span className="text-white">Designed & Developed with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse mx-1" />
              <span className="text-white">
                by
                <Link className="ml-2 text-emerald-200" href="https://seoulix.com">
                  Seoulix Technologies
                </Link>
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: "Privacy", href: "/privacy" },
                { name: "Terms", href: "/terms" },
                { name: "Cookies", href: "/cookies" },
                { name: "Accessibility", href: "/accessibility" },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-emerald-400 transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}