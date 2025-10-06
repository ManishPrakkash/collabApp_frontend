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

| Variable | Value | Description |
|---------|-------|-------------|
| NEXT_PUBLIC_APP_URL | (Your Vercel deployment URL) | URL of your deployed app |
| NEXT_PUBLIC_API_URL | (Your API URL) | URL of your backend API |
| NEXTAUTH_URL | (Your Vercel deployment URL) | URL for NextAuth |
| NEXTAUTH_SECRET | (Generate a secure random string) | Secret for NextAuth JWT encryption |
| NEXT_PUBLIC_DISABLE_EMAIL_VERIFICATION | true | Flag to disable email verification |
| NEXT_PUBLIC_DISABLE_SUBSCRIPTION | true | Flag to disable subscription checks |

For OAuth providers (optional):
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

### 4. Deploy

1. Click "Deploy" in the Vercel dashboard
2. Wait for the build and deployment to complete
3. Once finished, Vercel will provide a deployment URL

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