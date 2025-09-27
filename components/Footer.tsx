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
        <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-full blur-3xl animate-[pulse_10s_infinite_alternate]"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-green-600/5 to-lime-600/5 rounded-full blur-3xl animate-[pulse_12s_infinite_alternate_2s]"></div>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Top Section */}
        <div className="flex flex-col xl:flex-row gap-12 xl:gap-16">
          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <Link href="/" className="flex items-center mb-6 md:mb-8 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 mr-3 sm:mr-4">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  CAREER ADVANCE
                </div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wider">ONLINE LEARNING</div>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 md:mb-8 text-base sm:text-lg leading-relaxed">
              Empowering careers through smart technology, personalized job matching, and comprehensive learning
              solutions for the modern workforce.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 border border-white/10 hover:border-white/20 ${
                    Icon === Facebook
                      ? "hover:text-emerald-400"
                      : Icon === Twitter
                      ? "hover:text-green-400"
                      : Icon === Linkedin
                      ? "hover:text-teal-500"
                      : "hover:text-lime-400"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-white">{section.title}</h3>
                <ul className="space-y-2 sm:space-y-4">
                  {section.links.map((link, lidx) => (
                    <li key={lidx}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block text-xs sm:text-sm"
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
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">Get in Touch</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            {[
              { icon: Mail, text: "info@careeradvance.ca", gradient: "from-emerald-500 to-green-600" },
              { icon: Phone, text: "+1 (555) 123-4567", gradient: "from-green-500 to-teal-600" },
              { icon: MapPin, text: "Toronto, ON, Canada", gradient: "from-teal-500 to-lime-600" },
            ].map((contact, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${contact.gradient} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <contact.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-gray-300 font-medium text-sm sm:text-base break-all sm:break-normal">{contact.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="flex flex-col sm:flex-row items-center text-gray-400 text-xs sm:text-sm mb-0 order-2 md:order-1 text-center sm:text-left">
              <span>© 2024 Career Advance. Made with </span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-red-500 fill-current animate-pulse" />
              <span> in Canada. Designed and Developed with </span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-red-500 fill-current animate-pulse" />
              <span> by Seoulix Technologies</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 order-1 md:order-2">
              {[{ name: "Privacy Policy", href: "/privacy" }, { name: "Terms of Service", href: "/terms" }, { name: "Cookie Policy", href: "/cookies" }, { name: "Accessibility", href: "/accessibility" }].map((link, idx) => (
                <Link key={idx} href={link.href} className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200">
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
