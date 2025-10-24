"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

function ImpersonateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const redirect = searchParams.get('redirect') || '/dashboard'

    console.log('Impersonate page loaded with:', { token, redirect })

    if (!token) {
      console.log('No token found, setting error state')
      setStatus('error')
      setMessage('Invalid or missing token')
      return
    }

    // Call backend to verify token and get user info
    verifyToken(token, redirect)
  }, [searchParams])

  const verifyToken = async (token: string, redirect: string) => {
    console.log('Starting token verification:', { token, redirect })
    try {
      const response = await fetch('/api/admin/users/verify-impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      console.log('Verification response status:', response.status)
      const result = await response.json()
      console.log('Verification result:', result)

      if (result.success) {
        console.log('Token verification successful, setting success state')
        setStatus('success')
        setMessage(`Successfully logged in as ${result.data.name} (${result.data.role})`)
        setRedirectUrl(redirect)
        
        console.log('Setting up redirect to:', redirect)
        // Redirect after 2 seconds
        setTimeout(() => {
          console.log('Executing redirect to:', redirect)
          try {
            // Try using Next.js router first
            router.push(redirect)
          } catch (routerError) {
            console.log('Router push failed, using window.location:', routerError)
            // Fallback to window.location
            window.location.href = redirect
          }
        }, 2000)
      } else {
        console.log('Token verification failed:', result.message)
        setStatus('error')
        setMessage(result.message || 'Failed to verify token')
      }
    } catch (error) {
      console.error('Error during token verification:', error)
      setStatus('error')
      setMessage('An error occurred while verifying the token')
    }
  }

  const handleRedirect = () => {
    if (redirectUrl) {
      console.log('Manual redirect to:', redirectUrl)
      try {
        // Try using Next.js router first
        router.push(redirectUrl)
      } catch (routerError) {
        console.log('Router push failed, using window.location:', routerError)
        // Fallback to window.location
        window.location.href = redirectUrl
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">User Impersonation</CardTitle>
            <CardDescription className="text-center">
              Processing login request...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'loading' && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Verifying token...</span>
              </div>
            )}

            {status === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'success' && (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Redirecting to {redirectUrl} in 2 seconds...
                </p>
                <Button onClick={handleRedirect} className="w-full">
                  Go Now
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <Button 
                  onClick={() => router.push('/admin/users')} 
                  variant="outline"
                  className="w-full"
                >
                  Back to Users
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ImpersonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">User Impersonation</CardTitle>
              <CardDescription className="text-center">
                Loading...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ImpersonateContent />
    </Suspense>
  )
}
