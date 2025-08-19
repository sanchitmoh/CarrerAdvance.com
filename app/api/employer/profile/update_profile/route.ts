import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    // Get employer ID from session
    const employerId = request.cookies.get('employer_id')?.value;
    
    if (!employerId) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated'
      }, { status: 401 });
    }

    // Get request body
    const requestData = await request.json();

    // Forward the request to the PHP backend
    const response = await fetch(`${API_BASE_URL}/employer/profile/update_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify({
        ...requestData,
        employer_id: employerId
      }),
      credentials: 'include'
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating employer profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update profile data'
    }, { status: 500 });
  }
}