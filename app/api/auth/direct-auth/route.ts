import { NextResponse } from "next/server";
import { createToken, createSessionCookie } from "@/lib/auth-helpers";
import { signInUser } from "@/lib/auth-utils";

/**
 * Direct authentication API route
 * This route provides a fallback when NextAuth configuration has issues
 * It authenticates directly with the backend API and creates a session cookie
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, action } = body;
    
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }
    
    // Sign in directly with backend API, bypassing NextAuth for initial check
    const result = await signInUser(email, password);
    
    if (result.success) {
      // Create a token for the user
      const user = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        image: result.user.image || null
      };
      
      const token = await createToken(user);
      
      if (token) {
        // Create a response with the session cookie
        const response = NextResponse.json({ success: true, user });
        response.headers.set('Set-Cookie', createSessionCookie(token));
        return response;
      }
      
      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }
  } catch (error) {
    console.error("Direct auth API error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }, { status: 500 });
  }
}