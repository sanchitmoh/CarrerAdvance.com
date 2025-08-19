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

    // Get form data from request
    const formData = await request.formData();
    
    // Add employer_id to form data
    formData.append('employer_id', employerId);

    // Forward the request to the PHP backend
    const response = await fetch(`${API_BASE_URL}/employer/profile/upload_picture`, {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      },
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to upload profile picture'
    }, { status: 500 });
  }
}