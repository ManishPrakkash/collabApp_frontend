// This is a utility for handling direct authentication when NextAuth fails
import { encode, decode } from 'next-auth/jwt';

// Define user interface
interface User {
  id: string;
  name?: string;
  email: string;
  image?: string | null;
}

// Secret for JWT operations
const getSecret = (): string => process.env.NEXTAUTH_SECRET || "7a3d323032111ba012b1e242ff24c77e7b955a24077394676c1f22e765f5a3bb";

// Create a token for a user (to be used in API routes)
export async function createToken(user: User): Promise<string | null> {
  try {
    if (!user || !user.id) {
      throw new Error("Invalid user data");
    }
    
    // Create a token
    const token = await encode({
      token: {
        id: user.id,
        name: user.name || '',
        email: user.email,
        picture: user.image || null,
        sub: user.id,
      },
      secret: getSecret()
    });
    
    return token;
  } catch (error) {
    console.error("Error creating token:", error);
    return null;
  }
}

// Decode a session token
export async function decodeToken(token: string): Promise<any> {
  try {
    return await decode({ token, secret: getSecret() });
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Create cookie value for setting in API response
export function createSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production';
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  
  return `next-auth.session-token=${token}; Path=/; HttpOnly; ${secure ? 'Secure; ' : ''}Max-Age=${maxAge}; SameSite=Lax`;
}