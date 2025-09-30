import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Heart, Zap } from "lucide-react"

export default function Footer() {
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
    <footer className="relative bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-green-900/20"></div>
        <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-72 sm:h-72 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 sm:w-72 sm:h-72 bg-gradient-to-r from-green-600/5 to-lime-600/5 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center mb-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-500 rounded-lg flex items-center justify-center shadow group-hover:shadow-md transition-all duration-300 group-hover:scale-105 mr-2">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  CAREER ADVANCE
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wider">ONLINE LEARNING</div>
              </div>
            </Link>
            <p className="text-gray-300 mb-3 text-xs sm:text-sm leading-relaxed">
              Empowering careers through smart technology.
            </p>
            <div className="flex justify-center lg:justify-start gap-1 sm:gap-2">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`w-6 h-6 sm:w-8 sm:h-8 bg-white/10 backdrop-blur-sm rounded flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 border border-white/10 hover:border-white/20 ${
                    Icon === Facebook
                      ? "hover:text-emerald-400"
                      : Icon === Twitter
                      ? "hover:text-green-400"
                      : Icon === Linkedin
                      ? "hover:text-teal-500"
                      : "hover:text-lime-400"
                  }`}
                >
                  <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links - More compact grid */}
          <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xs sm:text-sm font-bold mb-2 text-white">{section.title}</h3>
                <ul className="space-y-1">
                  {section.links.map((link, lidx) => (
                    <li key={lidx}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-[10px] sm:text-xs"
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

        {/* Ultra Compact Contact Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
          <h3 className="text-sm font-bold mb-3 text-center">Get in Touch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
            {[
              { icon: Mail, text: "info@careeradvance.ca", gradient: "from-emerald-500 to-green-600" },
              { icon: Phone, text: "+1 (555) 123-4567", gradient: "from-green-500 to-teal-600" },
              { icon: MapPin, text: "Toronto, ON", gradient: "from-teal-500 to-lime-600" },
            ].map((contact, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${contact.gradient} rounded flex items-center justify-center mb-1 shadow-sm`}
                >
                  <contact.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
                <span className="text-gray-300 text-[10px] sm:text-xs break-all">{contact.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Ultra Compact */}
        <div className="border-t border-white/10 pt-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-gray-400 text-[10px] sm:text-xs text-center w-full sm:w-auto">
              © 2024 Career Advance. Made with ❤️ in Seoulix
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[
                { name: "Privacy", href: "/privacy" }, 
                { name: "Terms", href: "/terms" }, 
                { name: "Cookies", href: "/cookies" }
              ].map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.href} 
                  className="text-gray-400 hover:text-white text-[10px] sm:text-xs transition-colors duration-200"
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