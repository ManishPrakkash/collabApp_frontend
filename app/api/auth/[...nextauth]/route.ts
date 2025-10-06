import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// Log important configuration details for debugging
console.log("NextAuth Route - Environment Variables:");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("BACKEND_URL:", process.env.BACKEND_URL);
console.log("NEXTAUTH_SECRET set:", !!process.env.NEXTAUTH_SECRET);

// Check for critical missing environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("CRITICAL: NEXTAUTH_SECRET is not set. Authentication will not work properly.");
}

if (!process.env.NEXT_PUBLIC_API_URL && !process.env.BACKEND_URL) {
  console.error("CRITICAL: Neither NEXT_PUBLIC_API_URL nor BACKEND_URL is set. API connections will fail.");
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
