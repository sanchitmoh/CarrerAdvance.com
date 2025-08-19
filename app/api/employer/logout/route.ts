import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    // Forward the request to the PHP backend
    const response = await fetch(`${API_BASE_URL}/employer/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    // Clear the employer_id cookie
    const response = NextResponse.json(data);
    response.cookies.delete('employer_id');
    
    return response;
  } catch (error) {
    console.error('Error during employer logout:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process logout'
    }, { status: 500 });
  }
}
