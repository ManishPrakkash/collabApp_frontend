import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Return a mock PRO subscription with unlimited resources
    return NextResponse.json({
      plan: 'PRO',
      status: 'ACTIVE',
      limits: {
        projects: 100,
        teamMembers: 50,
        storageGB: 100,
        price: 0, // Free for development
        stripePriceId: null
      },
      usage: {
        projects: 0,
        teamMembers: 0,
        storageGB: 0
      },
      subscription: {
        currentPeriodStart: new Date(Date.now() - 86400000).toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancelAtPeriodEnd: false
      }
    });
  } catch (error) {
    console.error('Error in subscription status API:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
