import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// Log important configuration details for debugging
console.log("NextAuth Route - Environment Variables:");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("NEXTAUTH_SECRET set:", !!process.env.NEXTAUTH_SECRET);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
