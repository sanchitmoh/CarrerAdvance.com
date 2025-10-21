import Image from "next/image"
import Link from "next/link"
import BackButton from "@/components/BackButton"

export const metadata = {
  title: "Our Team | CareerAdvance",
  description:
    "Meet the CareerAdvance leadership and product teams empowering careers with technology.",
}

type TeamMember = {
  name: string
  role: string
  bio: string
  imageSrc: string
  linkedin?: string
  twitter?: string
}

const leadership: TeamMember[] = [
  {
    name: "Avery Kim",
    role: "Chief Executive Officer",
    bio: "Drives vision, partnerships, and company growth across global markets.",
    imageSrc: "/team/avery.jpg",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Jordan Patel",
    role: "Chief Technology Officer",
    bio: "Leads platform architecture, AI initiatives, and engineering excellence.",
    imageSrc: "/team/jordan.jpg",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://x.com/",
  },
  {
    name: "Samira Chen",
    role: "Chief Product Officer",
    bio: "Owns product strategy, DX/UX, and outcomes for job seekers and employers.",
    imageSrc: "/team/samira.jpg",
    linkedin: "https://www.linkedin.com/",
  },
]

const productTeam: TeamMember[] = [
  {
    name: "Diego Martinez",
    role: "Head of Engineering",
    bio: "Scales delivery and reliability across our web platform and APIs.",
    imageSrc: "/team/diego.jpg",
  },
  {
    name: "Priya Nair",
    role: "Design Lead",
    bio: "Crafts accessible experiences and a cohesive system of patterns.",
    imageSrc: "/team/priya.jpg",
  },
  {
    name: "Noah Williams",
    role: "Data Scientist",
    bio: "Improves matching quality with applied ML and evaluative analytics.",
    imageSrc: "/team/noah.jpg",
  },
  {
    name: "Hana Suzuki",
    role: "Full‑Stack Engineer",
    bio: "Builds feature-rich experiences across the app and employer dashboard.",
    imageSrc: "/team/hana.jpg",
  },
]

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-colors duration-300">
      <div className="aspect-[4/3] relative">
        <Image
          src={member.imageSrc}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold tracking-tight">{member.name}</div>
            <div className="text-emerald-300 text-sm">{member.role}</div>
          </div>
          <div className="flex gap-2">
            {member.linkedin && (
              <Link
                aria-label={`${member.name} on LinkedIn`}
                href={member.linkedin}
                className="px-2 py-1 rounded-md bg-white/10 text-white text-xs hover:bg-emerald-500/30 transition-colors"
              >
                in
              </Link>
            )}
            {member.twitter && (
              <Link
                aria-label={`${member.name} on Twitter`}
                href={member.twitter}
                className="px-2 py-1 rounded-md bg-white/10 text-white text-xs hover:bg-emerald-500/30 transition-colors"
              >
                X
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 text-gray-300 text-sm leading-relaxed">
        {member.bio}
      </div>
    </div>
  )
}

export default function TeamPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950/30 to-black" />
        <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] bg-teal-500/20 blur-3xl rounded-full" />
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-emerald-300 text-xs font-semibold tracking-widest uppercase mb-3">
            Our Team
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            People behind CareerAdvance
          </h1>
          <p className="mt-4 text-gray-400">
            We are builders, researchers, and operators committed to empowering careers with
            thoughtful technology and human-centered design.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-xl md:text-2xl font-semibold">Product & Engineering</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productTeam.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div>
              <h3 className="text-xl font-semibold">Want to connect with our team?</h3>
              <p className="text-gray-400 mt-1">
                We love partnering with employers, educators, and innovators.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white hover:border-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Careers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}