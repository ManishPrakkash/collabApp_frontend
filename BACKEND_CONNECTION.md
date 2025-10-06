# Connecting Frontend to Backend

This guide explains how to properly connect your Vercel-hosted frontend application to your Render-hosted backend API.

## Environment Variables Setup

### Frontend (Vercel) Environment Variables

Set these variables in your Vercel project settings:

| Variable | Value | Description |
|---------|-------|-------------|
| NEXT_PUBLIC_API_URL | https://project-management-api-e6xs.onrender.com | Your Render backend URL |
| BACKEND_URL | https://project-management-api-e6xs.onrender.com | Same as above, used by API routes |
| NEXT_PUBLIC_SOCKET_URL | https://project-management-api-e6xs.onrender.com | For WebSocket connections |

### Backend (Render) Environment Variables

Set these variables in your Render service settings:

| Variable | Value | Description |
|---------|-------|-------------|
| FRONTEND_URL | https://your-app.vercel.app | Your Vercel frontend URL |
| CORS_ORIGIN | https://your-app.vercel.app | For CORS configuration |

## CORS Configuration

Ensure your backend has proper CORS configuration to accept requests from your frontend:

```javascript
// Example Express.js CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://your-app.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## API Routes

All your frontend API routes should use the environment variables to construct URLs:

```typescript
// Example API route
export async function GET(request: Request) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/resource`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('authorization') || ''
    }
  });
  
  return Response.json(await response.json());
}
```

## Troubleshooting Connection Issues

If you encounter connection issues between your frontend and backend:

1. **Check CORS errors** in browser console
2. **Verify environment variables** are set correctly
3. **Ensure backend is running** and accessible
4. **Test API endpoints** directly using tools like Postman
5. **Check for firewall or networking issues** if deploying in restricted environments

## Handling WebSockets

If your application uses WebSockets:

1. Configure the WebSocket connection to use `NEXT_PUBLIC_SOCKET_URL`
2. Ensure your WebSocket server accepts connections from your frontend domain
3. Handle reconnection logic for network interruptions

## Updating URLs After Deployment

Once both services are deployed:

1. Update the Vercel environment variables with the actual Render URL
2. Update the Render environment variables with the actual Vercel URL 
3. Redeploy both services if necessary to ensure they recognize the new variables