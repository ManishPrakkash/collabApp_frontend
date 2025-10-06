// This helper creates a session c    // This part will only work in server components or API routes
    // Session cookie will be handled by the direct-auth API route
    if (typeof document === 'undefined') {
      // Server-side
      const cookieStore = cookies();
      
      // Note: The cookies API changed in newer Next.js versions
      // This part might need adjustment based on your Next.js version
      // For server actions, use proper cookies API
      // For API routes, use response.setHeader('Set-Cookie', ...)
    }ly when the NextAuth flow fails
import { cookies } from 'next/headers';
import { encode, decode } from 'next-auth/jwt';

// Define user interface
interface User {
  id: string;
  name?: string;
  email: string;
  image?: string | null;
}

// Secret for JWT operations
const getSecret = () => process.env.NEXTAUTH_SECRET || "7a3d323032111ba012b1e242ff24c77e7b955a24077394676c1f22e765f5a3bb";

// Create a session manually (used when NextAuth fails but direct auth works)
export async function createSession(user: User) {
  try {
    if (!user || !user.id) {
      throw new Error("Invalid user data");
    }
    
    // Create a token
    const token = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.image,
        sub: user.id,
      },
      secret: getSecret()
    });
    
    // Set cookies
    const cookieStore = cookies();
    
    // Set the session token cookie
    cookieStore.set({
      name: 'next-auth.session-token',
      value: token,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error creating manual session:", error);
    return { success: false, error };
  }
}

// Decode a session token
export async function decodeToken(token) {
  try {
    return await decode({ token, secret: getSecret() });
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}