import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-16 px-4 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        We'd love to hear from you! Whether you have a question about our services, need support, or want to provide feedback, our team is ready to assist.
      </p>
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <Mail className="w-12 h-12 text-emerald-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h2>
          <p className="text-gray-600">info@careeradvance.ca</p>
          <p className="text-sm text-gray-500 mt-2">We typically respond within 24 hours.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <Phone className="w-12 h-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h2>
          <p className="text-gray-600">+1 (555) 123-4567</p>
          <p className="text-sm text-gray-500 mt-2">Mon-Fri, 9 AM - 5 PM EST</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <MapPin className="w-12 h-12 text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Office</h2>
          <p className="text-gray-600">123 Career Way, Toronto, ON, Canada</p>
          <p className="text-sm text-gray-500 mt-2">Visits by appointment only.</p>
        </div>
      </div>
    </div>
  )
}
