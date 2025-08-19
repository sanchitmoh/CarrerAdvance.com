import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  try {
    // Get employer ID from session
    const employerId = request.cookies.get('employer_id')?.value;
    
    if (!employerId) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated'
      }, { status: 401 });
    }

    // Forward the request to the PHP backend
    const response = await fetch(`${API_BASE_URL}/employer/profile/get_profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch profile data'
    }, { status: 500 });
  }
}