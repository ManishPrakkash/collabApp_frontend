// Example for lib/api-client.js or similar file
const getApiUrl = () => {
  // Priority order:
  // 1. Environment variable
  // 2. Window location based fallback (for development)
  // 3. Hardcoded fallback (last resort)
  
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For local development, assume API is on same host but different port
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:3001`; // Adjust port as needed
  }
  
  // Fallback for production - if API is deployed to Render with a predictable URL pattern
  // This helps when frontend is deployed before backend
  const frontendUrl = typeof window !== 'undefined' ? window.location.hostname : '';
  if (frontendUrl.includes('vercel.app')) {
    // Extract project name from vercel URL and construct render URL
    const projectName = frontendUrl.split('.')[0];
    return `https://${projectName}-api.onrender.com`;
  }
  
  // Last resort fallback
  return 'https://api.your-default-domain.com';
};

export const apiClient = {
  fetch: async (endpoint, options = {}) => {
    const baseUrl = getApiUrl();
    const url = `${baseUrl}${endpoint}`;
    return fetch(url, options);
  }
};