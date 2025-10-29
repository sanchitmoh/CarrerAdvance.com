import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  try {
    // Get admin ID from URL parameters first, then fallback to cookies
    const { searchParams } = new URL(request.url);
    const adminIdFromUrl = searchParams.get('admin_id');
    const adminIdFromCookie = request.cookies.get('admin_id')?.value;
    const adminJwt = request.cookies.get('admin_jwt')?.value;
    
    // Debug logging
    console.log('Profile API Debug:');
    console.log('- adminIdFromUrl:', adminIdFromUrl);
    console.log('- adminIdFromCookie:', adminIdFromCookie);
    console.log('- adminJwt:', adminJwt);
    console.log('- All cookies:', request.cookies.getAll());
    
    // Use admin ID from URL if provided, otherwise from cookie, otherwise require authentication
    const adminIdToUse = adminIdFromUrl || adminIdFromCookie;
    
    if (!adminIdToUse && !adminJwt) {
      return NextResponse.json({
        success: false,
        message: 'Admin ID required. Please provide admin_id as URL parameter or ensure you are authenticated.'
      }, { status: 401 });
    }

    console.log('Fetching admin profile for ID:', adminIdToUse);
    console.log('Backend URL:', getBaseUrl('admin/profile/get_profile'));

    // Try to forward the request to the PHP backend using configured base URL
    try {
      const base = getBaseUrl('admin/profile/get_profile');
      const url = new URL(base);
      if (adminIdToUse) {
        url.searchParams.set('admin_id', String(adminIdToUse));
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (adminJwt) {
        headers['Authorization'] = `Bearer ${adminJwt}`;
      }

      const requestUrl = url.toString();
      console.log('Calling backend URL:', requestUrl);

      let response = await fetch(requestUrl, {
        method: 'GET',
        headers
      });

      console.log('Backend response status:', response.status);

      // If 404 on hosts requiring explicit index.php, retry once with /index.php
      if (response.status === 404) {
        try {
          const withIndex = requestUrl.replace(/:\/\//, '://').replace(/\/api\//, '/index.php/api/');
          if (withIndex !== requestUrl) {
            console.log('Retrying with index.php URL:', withIndex);
            response = await fetch(withIndex, { method: 'GET', headers });
            console.log('Retry response status:', response.status);
          }
        } catch (retryErr) {
          console.error('Retry failed:', retryErr);
        }
      }

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error('Backend error body:', text);
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      // Safely handle non-JSON responses from the backend
      const contentType = response.headers.get('content-type') || '';
      const rawText = await response.text();
      console.log('Backend raw response (first 300 chars):', rawText.slice(0, 300));

      if (/application\/json/i.test(contentType)) {
        try {
          const data = JSON.parse(rawText);
          return NextResponse.json(data);
        } catch (e) {
          console.error('JSON parse failed despite JSON content-type:', e);
          return NextResponse.json({
            success: false,
            message: 'Invalid JSON response from backend',
            raw: rawText.slice(0, 1000)
          }, { status: 502 });
        }
      }

      // Try JSON parse even without JSON header; otherwise, return raw for debugging
      try {
        const data = JSON.parse(rawText);
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({
          success: false,
          message: 'Backend returned non-JSON content',
          raw: rawText.slice(0, 2000),
          contentType
        }, { status: 502 });
      }
    } catch (backendError) {
      console.error('Backend connection failed:', backendError);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch profile from backend'
      }, { status: 502 });
    }
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({
      success: false,
      message: `Failed to fetch profile data: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
