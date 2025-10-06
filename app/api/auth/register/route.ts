import { NextRequest, NextResponse } from "next/server";

import { apiClient } from "../../../../lib/api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Registration request:", JSON.stringify({
      name: body.name,
      email: body.email,
      passwordLength: body.password ? body.password.length : 0
    }));
    
    // request to the backend API using our apiClient
    try {
      const response = await apiClient.fetch(
        `/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      // For debugging
      console.log("Backend response status:", response.status);
      
      const data = await response.json();
      console.log("Backend response data:", JSON.stringify(data));

      if (!response.ok) {
        return NextResponse.json(
          { message: data.message || "Registration failed", details: data },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
    } catch (error) {
      const fetchError = error as Error;
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { message: `Connection error: ${fetchError.message || 'Failed to connect to backend'}`, errorType: "FETCH_ERROR" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`, errorType: "UNEXPECTED_ERROR" },
      { status: 500 }
    );
  }
}
