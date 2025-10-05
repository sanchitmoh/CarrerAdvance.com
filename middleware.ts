import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = new Set([
      "/",
      "/employers/login",
      "/employers/register",
      "/employers/forgot-password",
      "/employers/reset-password",
      "/job-seekers/login",
      "/job-seekers/register",
      "/job-seekers/forgot-password",
      "/job-seekers/reset-password",
      "/companies/login",
      "/companies/register",
      "/students/login",
      "/students/register",
      "/students/forgot-password",
      "/students/reset-password",
      "/teachers/login",
      "/teachers/register",
      "/teachers/forgot-password",
      "/teachers/reset-password",
      "/admin/login",
      "/admin/register",
      "/admin/forgot-password",
      "/admin/reset-password",
    ])

    // allow exact "/" or exact public entries, plus any nested paths under specific auth-less groups if needed
    const isPublic = publicRoutes.has(pathname)
    if (isPublic) {
      return NextResponse.next()
    }

    // Get tokens from cookies
    const employerToken = request.cookies.get("employer_jwt")?.value
    const jobseekerToken = request.cookies.get("jobseeker_jwt")?.value
    const studentToken = request.cookies.get("student_jwt")?.value
    const adminToken = request.cookies.get("admin_jwt")?.value

    // Employer routes protection
    if (
      pathname.startsWith("/employers") &&
      !pathname.startsWith("/employers/login") &&
      !pathname.startsWith("/employers/register") &&
      !pathname.startsWith("/employers/forgot-password")
    ) {
      if (!employerToken) {
        return NextResponse.redirect(new URL("/employers/login", request.url))
      }
      return NextResponse.next()
    }

    // Job seeker routes protection
    if (
      pathname.startsWith("/job-seekers") &&
      !pathname.startsWith("/job-seekers/login") &&
      !pathname.startsWith("/job-seekers/register") &&
      !pathname.startsWith("/job-seekers/forgot-password") &&
      !pathname.startsWith("/job-seekers/reset-password")
    ) {
      if (!jobseekerToken) {
        return NextResponse.redirect(new URL("/job-seekers/login", request.url))
      }
      return NextResponse.next()
    }

    // Student routes protection
    if (
      pathname.startsWith("/students") &&
      !pathname.startsWith("/students/login") &&
      !pathname.startsWith("/students/register") &&
      !pathname.startsWith("/students/forgot-password")
    ) {
      if (!studentToken) {
        return NextResponse.redirect(new URL("/students/login", request.url))
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
  } catch (error) {
    console.error("Middleware error", error)
    // Fail open to avoid 500s from middleware at edge
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
}
