import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Return a mock portal URL that redirects to the dashboard
    return NextResponse.json({
      url: '/dashboard?subscription=manage',
      message: 'Subscription management unavailable in development mode'
    });
  } catch (error) {
    console.error('Error in subscription portal API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
