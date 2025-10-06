import NextAuth from "next-auth";
// Use the fixed auth options file
import { authOptions } from "./auth-options-fixed";

// For production/Vercel deployments - ensure NEXTAUTH_URL is set
if (!process.env.NEXTAUTH_URL && typeof process.env.VERCEL_URL !== 'undefined') {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  console.log("Setting NEXTAUTH_URL from VERCEL_URL:", process.env.NEXTAUTH_URL);
}

// If still no NEXTAUTH_URL and in production, use hardcoded Vercel URL
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
  process.env.NEXTAUTH_URL = 'https://collabit-nu.vercel.app';
  console.log("Setting fallback NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
}

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
