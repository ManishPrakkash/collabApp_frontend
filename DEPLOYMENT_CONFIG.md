# Deployment Configuration

## API Endpoint
Your backend API is deployed at:
```
https://project-management-api-e6xs.onrender.com
```

## Required Environment Variables for Vercel

Copy and paste these exact variables when setting up your Vercel project:

| Variable | Value |
|---------|-------|
| NEXT_PUBLIC_API_URL | https://project-management-api-e6xs.onrender.com |
| BACKEND_URL | https://project-management-api-e6xs.onrender.com |
| NEXT_PUBLIC_SOCKET_URL | https://project-management-api-e6xs.onrender.com |
| NEXT_PUBLIC_UPLOAD_API_URL | https://project-management-api-e6xs.onrender.com/api/uploads |
| NEXT_PUBLIC_DISABLE_EMAIL_VERIFICATION | true |
| NEXT_PUBLIC_DISABLE_SUBSCRIPTION | true |
| NEXTAUTH_URL | (Your Vercel URL once deployed) |
| NEXT_PUBLIC_APP_URL | (Your Vercel URL once deployed) |
| NEXTAUTH_SECRET | (Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |

## After Deployment
1. Get your Vercel URL (e.g., https://project-management-frontend.vercel.app)
2. Update the CORS settings in your backend to allow requests from this URL
3. Test the connection between frontend and backend