// API Client for connecting to backend
const getApiUrl = () => {
  // Priority order:
  // 1. Environment variable
  // 2. Window location based fallback (for development)
  // 3. Hardcoded production endpoint
  
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For local development, assume API is on same host but different port
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:3001`; // Adjust port as needed
  }
  
  // Hardcoded production endpoint - your Render API URL
  return 'https://project-management-api-e6xs.onrender.com';
};

export const apiClient = {
  fetch: async (endpoint, options = {}) => {
    const baseUrl = getApiUrl();
    const url = `${baseUrl}${endpoint}`;
    return fetch(url, options);
  }
};