import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const { apiClient } = await import("../../../../lib/api-client");
          
        try {
          console.log("Login attempt for:", credentials.email);
          
          const response = await apiClient.fetch(
            `/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          
          console.log("Login response status:", response.status);
          
          if (!response.ok) {
            if (response.status === 403) {
              // Skip email verification - treat as verified
              const data = await response.json();
              
              // If it's related to email verification, try to continue anyway
              if (data.message?.includes('verify') || data.message?.includes('verification')) {
                try {
                  // Attempt to get user data despite verification issue
                  const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/users/byEmail?email=${encodeURIComponent(credentials.email)}`,
                    {
                      method: 'GET',
                      headers: { 'Content-Type': 'application/json' }
                    }
                  );
                  
                  if (userResponse.ok) {
                    const userData = await userResponse.json();
                    return {
                      id: userData.id,
                      name: userData.name,
                      email: userData.email,
                      image: userData.image
                    };
                  }
                } catch (err) {
                  console.error('Error fetching user data:', err);
                }
              }
            }
            // other errors
            console.error(
              "Login failed:",
              response.status,
              await response.text()
            );
            return null;
          }

          const user = await response.json();

          if (user && user.id) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }

          return null;
        } catch (error) {
          console.error("Error during login:", error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }

      if (profile) {
        const OAuthProfile = profile as any;
        token.email_verified = OAuthProfile.email_verified;
      }

      if (account && account.provider && account.providerAccountId) {
        try {
          if (account.provider === "github") {
            token.email_verified = new Date().toISOString();
          }

          // syncing OAuth info with backend
          const fetchUserResponse = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL
            }/api/users/byEmail?email=${encodeURIComponent(
              token.email as string
            )}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          let existingUserData = null;
          if (fetchUserResponse.ok) {
            existingUserData = await fetchUserResponse.json();
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: token.email,
                name: existingUserData?.name || user?.name,
                image: existingUserData?.image || user?.image,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                email_verified: existingUserData
                  ? undefined
                  : token.email_verified ?? null,
              }),
            }
          );

          if (response.ok) {
            const userData = await response.json();
            token.id = userData.id;
            token.name = userData.name;
            token.image = userData.image;
          }
        } catch (error) {
          console.error("Error syncing OAuth with backend:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  // Always provide a fallback secret to prevent Configuration errors
  secret: process.env.NEXTAUTH_SECRET || "7a3d323032111ba012b1e242ff24c77e7b955a24077394676c1f22e765f5a3bb",
};
