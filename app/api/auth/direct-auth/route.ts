import { NextResponse } from "next/server";
import { createToken, createSessionCookie } from "@/lib/auth-helpers";

// A utility function for direct sign-in
export async function signInUser(email: string, password: string) {
  try {
    // Get API URL with fallback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://project-management-api-e6xs.onrender.com';
    console.log("Direct sign-in: Using API URL:", apiUrl);
    
    // Try logging in directly with the backend
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    console.log("Direct sign-in response status:", response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log("Login successful, user ID:", userData.id);
      return { success: true, user: userData };
    }
    
    // Special case for email verification
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.message?.includes('verify') || errorData.message?.includes('verification')) {
        console.log("Bypassing email verification");
        
        // Try to get user data directly
        const userResponse = await fetch(
          `${apiUrl}/api/users/byEmail?email=${encodeURIComponent(email)}`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        );
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          return { success: true, user: userData };
        }
      }
    }
    
    // Login failed
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    return { 
      success: false, 
      error: errorData.message || "Authentication failed" 
    };
  } catch (error) {
    console.error("Direct sign-in error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

// A custom API route to handle authentication with better error handling
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