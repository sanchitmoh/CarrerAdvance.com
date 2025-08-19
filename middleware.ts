import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don'\''t require authentication
  const publicRoutes = [
    "/", 
    "/employers/login", 
    "/employers/register", 
    "/job-seekers/login", 
    "/job-seekers/register",
    "/companies/login",
    "/companies/register",
    "/students/login",
    "/students/register",
    "/teachers/login",
    "/teachers/register",
    "/admin/login"
  ]

  // Check if the current path is a public route
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get tokens from cookies
  const employerToken = request.cookies.get("employer_jwt")?.value
  const jobseekerToken = request.cookies.get("jobseeker_jwt")?.value
  const adminToken = request.cookies.get("admin_jwt")?.value

  // Employer routes protection
  if (pathname.startsWith("/employers")) {
    if (!employerToken) {
      return NextResponse.redirect(new URL("/employers/login", request.url))
    }
    return NextResponse.next()
  }

  // Job seeker routes protection
  if (pathname.startsWith("/job-seekers")) {
    if (!jobseekerToken) {
      return NextResponse.redirect(new URL("/job-seekers/login", request.url))
    }
    return NextResponse.next()
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
}
