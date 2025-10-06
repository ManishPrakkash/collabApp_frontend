import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Instead of Stripe checkout, return a mock success response
    return NextResponse.json({
      success: true,
      redirectUrl: '/dashboard',
      message: 'Subscription activated successfully',
      sessionId: 'mock-session-' + Date.now(),
      plan: body.plan || 'PRO'
    });
  } catch (error) {
    console.error('Error in subscription checkout API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
