# Project Management Frontend Deployment Guide

This guide provides step-by-step instructions for deploying the Project Management Frontend application to Vercel, with email verification and Stripe integrations disabled for development purposes.

## Prerequisites

- A [Vercel](https://vercel.com) account
- Git installed on your machine
- Node.js (v16.x or later)
- The project repository cloned locally

## Pre-Deployment Preparation

The following modifications have been made to prepare the app for deployment:

1. **Email verification disabled**:
   - Authentication flows modified to skip email verification
   - API routes updated to return successful responses without verification

2. **Stripe integration bypassed**:
   - Mock data used for subscription plans
   - All users granted PRO features without payment

3. **Performance optimizations added**:
   - Next.js config optimized for production
   - Caching headers implemented via Vercel.json
   - Font loading optimized

## Deployment Steps

### 1. Push your code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Log in to your [Vercel account](https://vercel.com)
2. Click "Add New" → "Project"
3. Select the repository containing your project
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

#### Core Environment Variables

| Variable | Value | Description |
|---------|-------|-------------|
| NEXT_PUBLIC_APP_URL | (Your Vercel deployment URL) | URL of your deployed app (e.g., https://your-app.vercel.app) |
| NEXT_PUBLIC_API_URL | https://project-management-api-e6xs.onrender.com | URL of your backend API on Render |
| NEXTAUTH_URL | (Your Vercel deployment URL) | URL for NextAuth (same as NEXT_PUBLIC_APP_URL) |
| NEXTAUTH_SECRET | (Generate a secure random string) | Secret for NextAuth JWT encryption (use a strong random string) |

#### Feature Flags (for disabling email verification and subscription)

| Variable | Value | Description |
|---------|-------|-------------|
| NEXT_PUBLIC_DISABLE_EMAIL_VERIFICATION | true | Flag to disable email verification |
| NEXT_PUBLIC_DISABLE_SUBSCRIPTION | true | Flag to disable subscription checks |

#### Backend Integration Variables

| Variable | Value | Description |
|---------|-------|-------------|
| BACKEND_URL | https://project-management-api-e6xs.onrender.com | Backend URL used by API routes |
| NEXT_PUBLIC_SOCKET_URL | https://project-management-api-e6xs.onrender.com | WebSocket connection URL (same as backend URL) |
| NEXT_PUBLIC_UPLOAD_API_URL | https://project-management-api-e6xs.onrender.com/api/uploads | URL for file upload endpoints |

#### Optional OAuth Provider Variables (if using social login)

| Variable | Value | Description |
|---------|-------|-------------|
| GITHUB_CLIENT_ID | (Your GitHub OAuth App client ID) | GitHub OAuth credentials |
| GITHUB_CLIENT_SECRET | (Your GitHub OAuth App client secret) | GitHub OAuth credentials |
| GOOGLE_CLIENT_ID | (Your Google OAuth App client ID) | Google OAuth credentials |
| GOOGLE_CLIENT_SECRET | (Your Google OAuth App client secret) | Google OAuth credentials |

### Setting Up Environment Variables in Vercel

1. **Access Environment Variables**:
   - Go to the Vercel Dashboard
   - Select your project
   - Click on "Settings" tab
   - Select "Environment Variables" from the left sidebar

2. **Add Each Variable**:
   - Click "Add New" button
   - Enter the variable name (e.g., `NEXT_PUBLIC_API_URL`)
   - Enter the value (e.g., your backend URL on Render)
   - Select environments (Production, Preview, Development)
   - Click "Add"
   - Repeat for all variables

3. **Generate Secure NEXTAUTH_SECRET**:
   - You can generate a secure random string using this command in your terminal:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Copy the output and use it as your `NEXTAUTH_SECRET` value

4. **Handling Circular Dependency with Backend URL**:
   - If you haven't deployed the backend yet, use a temporary placeholder for `NEXT_PUBLIC_API_URL` and related variables
   - After your frontend is deployed, deploy your backend with the frontend URL
   - Then update these environment variables with the actual backend URL
   - Go to Vercel dashboard and redeploy the project with the updated environment variables

5. **Verifying Environment Variables**:
   - After deployment, you can verify environment variables are working by checking browser console
   - Use a test API call to confirm proper connection to backend

### 4. Deploy

1. Click "Deploy" in the Vercel dashboard
2. Wait for the build and deployment to complete
3. Once finished, Vercel will provide a deployment URL

> **Note on API_URL circular dependency**: If you haven't deployed your backend yet, use a temporary placeholder for `NEXT_PUBLIC_API_URL` (like `https://your-app-name.onrender.com`). After deploying the backend to Render, come back to Vercel and update this environment variable with the actual backend URL.
> 
> For detailed guidance on connecting to your backend, refer to `BACKEND_CONNECTION.md`.
> 
> A template file with all environment variables is available at `.env.vercel.template`.

### 5. Verify Deployment

1. Visit your deployment URL
2. Test the sign-up process (email verification should be skipped)
3. Test the subscription features (all users should have PRO features)

### Troubleshooting

If you encounter issues:

1. **Build Errors**:
   - Check the Vercel build logs
   - Ensure all dependencies are properly installed
   - Verify environment variables are set correctly
   - For TypeScript errors related to refs in components (like `Type 'RefObject<HTMLInputElement | null>' is not assignable to type...`), make sure to properly type your refs as `React.RefObject<HTMLInputElement> | React.ForwardedRef<HTMLInputElement>`
   - If you see `Invalid next.config.ts options detected` warnings, check for deprecated options like `swcMinify` which may need to be removed

2. **Runtime Errors**:
   - Check browser console for JavaScript errors
   - Verify API endpoints are responding correctly
   - Check if environment variables are accessible by the application

3. **Authentication Issues**:
   - Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set correctly
   - Check that the API URL is accessible from Vercel

## Post-Deployment

For production use, you'll want to:

1. Re-enable email verification
2. Integrate real Stripe payments
3. Set up proper domain and SSL

## Support

For any deployment issues, consult the [Vercel documentation](https://vercel.com/docs) or open an issue in the project repository.