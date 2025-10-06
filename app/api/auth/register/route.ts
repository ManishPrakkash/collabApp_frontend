import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Registration attempt with data:", {
      email: body.email,
      name: body.name,
      hasPassword: !!body.password
    });
    
    // Use hardcoded URL as fallback if environment variable is not set
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://project-management-api-e6xs.onrender.com';
    console.log("NEXT_PUBLIC_API_URL value:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Using API URL:", apiUrl);
    
    console.log("Sending registration request to:", `${apiUrl}/api/auth/register`);

    // Add timeout for fetch to handle unresponsive API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // request to the backend API
    try {
      const response = await fetch(
        `${apiUrl}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal
        }
      );
      
      // Clear timeout after request completes
      clearTimeout(timeoutId);
      
      console.log("Registration response status:", response.status);
      
      const data = await response.json();
      console.log("Registration response data:", data);

      if (!response.ok) {
        console.error("Registration failed:", data);
        return NextResponse.json(
          { message: data.message || "Registration failed" },
          { status: response.status }
        );
      }

      console.log("Registration successful:", data);
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error("Error connecting to backend API for registration:", fetchError);
      return NextResponse.json(
        { message: "Unable to reach the authentication server. Please try again later." },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during registration process" },
      { status: 500 }
    );
  }
}
