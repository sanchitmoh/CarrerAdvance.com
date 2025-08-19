import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Heart, Zap } from 'lucide-react'

export default function Footer() {
  const footerSections = [
    {
      title: "For Job Seekers",
      links: [
        { name: "Browse Jobs", href: "/jobs" },
        { name: "Create Profile", href: "/register" },
        { name: "Resume Builder", href: "/resume-builder" },
        { name: "Career Advice", href: "/career-advice" },
        { name: "Salary Guide", href: "/salary-guide" }
      ]
    },
    {
      title: "For Employers",
      links: [
        { name: "Post a Job", href: "/post-job" },
        { name: "Browse Candidates", href: "/candidates" },
        { name: "Employer Dashboard", href: "/employer-dashboard" },
        { name: "Pricing Plans", href: "/pricing" },
        { name: "Success Stories", href: "/success-stories" }
      ]
    },
    {
      title: "Learning",
      links: [
        { name: "Online Courses", href: "/courses" },
        { name: "Certifications", href: "/certifications" },
        { name: "Skill Assessments", href: "/assessments" },
        { name: "Learning Paths", href: "/learning-paths" },
        { name: "Webinars", href: "/webinars" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Contact", href: "/contact" }
      ]
    }
  ]
  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 text-white overflow-hidden"> {/* Changed to emerald */}
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Base gradient with better colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
                {/* Subtle overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-green-900/20"></div> {/* Changed to emerald/green */}
                {/* Animated background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-3xl animate-[pulse_10s_infinite_alternate]"></div> {/* Changed to emerald/teal */}
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-green-600/5 to-lime-600/5 rounded-full blur-3xl animate-[pulse_12s_infinite_alternate_2s]"></div> {/* Changed to green/lime */}
                {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-8 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 mr-4"> {/* Changed to emerald/green/teal */}
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  CAREER ADVANCE
                </div>
                <div className="text-sm text-gray-400 font-medium tracking-wider">
                  ONLINE LEARNING
                </div>
              </div>
            </Link>
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Empowering careers through smart technology, personalized job matching, and comprehensive learning solutions for the modern workforce.
            </p>
                        <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", color: "hover:text-emerald-400" }, // Changed to emerald
                { icon: Twitter, href: "#", color: "hover:text-green-400" }, // Changed to green
                { icon: Linkedin, href: "#", color: "hover:text-teal-500" }, // Changed to teal
                { icon: Instagram, href: "#", color: "hover:text-lime-400" } // Changed to lime
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/20 border border-white/10 hover:border-white/20`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          {/* Footer Links */}
          <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold mb-6 text-white">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href} 
                        className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Contact Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/10 shadow-xl">
          <h3 className="text-2xl font-bold mb-8 text-center">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"> {/* Changed to emerald/green */}
                <Mail className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-300 font-medium">info@careeradvance.ca</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"> {/* Changed to green/teal */}
                <Phone className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-300 font-medium">+1 (555) 123-4567</span>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-lime-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"> {/* Changed to teal/lime */}
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-300 font-medium">Toronto, ON, Canada</span>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
              <span>© 2024 Career Advance. Made with</span>
              <Heart className="w-4 h-4 mx-2 text-red-500 fill-current animate-pulse" />
              <span>in Canada</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookie Policy", href: "/cookies" },
                { name: "Accessibility", href: "/accessibility" }
              ].map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
