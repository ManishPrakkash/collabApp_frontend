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

    // Attach X-User-Id header automatically in the browser when available
    if (typeof window !== 'undefined') {
      try {
        const { buildAuthHeaders } = await import('./session-helper');
        const authHeaders = buildAuthHeaders(options.headers || {});
        options.headers = { ...(options.headers || {}), ...authHeaders };
      } catch (err) {
        // ignore - session helper may not be available in some runtimes
        // eslint-disable-next-line no-console
        console.warn('apiClient: failed to load session helper', err);
      }
    }

    const res = await fetch(url, options);

    // convenience: attempt to parse JSON, but don't throw if not JSON
    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch (e) {
        // ignore JSON parse errors
      }
    } else {
      try {
        data = await res.text();
      } catch (e) {
        data = null;
      }
    }

    return { ok: res.ok, status: res.status, data, res };
  },

  // AUTH ENDPOINTS
  auth: {
    /**
     * Register a new user
     * @param {object} data - { email, password, name }
     * @returns {Promise<{ok: boolean, status: number, data: any}>}
     */
    register: (data) => {
      return apiClient.fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    /**
     * Login a user with email and password
     * @param {object} data - { email, password }
     * @returns {Promise<{ok: boolean, status: number, data: any}>}
     */
    login: (data) => {
      return apiClient.fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    /**
     * Send a password reset request
     * @param {string} email - User email
     */
    forgotPassword: (email) => {
      return apiClient.fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    },

    /**
     * Reset password with token
     * @param {object} data - { token, password }
     */
    resetPassword: (data) => {
      return apiClient.fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    /**
     * Validate a reset token
     * @param {string} token - Reset token
     */
    validateResetToken: (token) => {
      return apiClient.fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    },
  },

  // USER ENDPOINTS
  user: {
    /**
     * Get user profile (uses X-User-Id header from session)
     */
    getProfile: () => {
      return apiClient.fetch('/api/user/profile');
    },

    /**
     * Update user profile
     * @param {string} userId - User ID
     * @param {object} data - { name, bio, jobTitle, department, skills }
     */
    updateProfile: (userId, data) => {
      return apiClient.fetch(`/api/user/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    /**
     * Update user password
     * @param {object} data - { userId, currentPassword, newPassword }
     */
    updatePassword: (data) => {
      return apiClient.fetch('/api/user/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    /**
     * Update user profile image
     * @param {string} imageUrl - URL to the image
     */
    updateProfileImage: (imageUrl) => {
      return apiClient.fetch('/api/user/profile-image', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
    },

    /**
     * Get user by email
     * @param {string} email - User email
     */
    getUserByEmail: (email) => {
      return apiClient.fetch(`/api/user/byEmail?email=${encodeURIComponent(email)}`);
    },
  },

  // PROJECT ENDPOINTS
  projects: {
    /**
     * Create new project
     * @param {object} data - { name, description, dueDate, creatorId, files? }
     */
    create: (data) => {
      return apiClient.fetch('/api/projects/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    /**
     * Get a project by ID
     * @param {string} projectId - Project ID
     */
    getById: (projectId) => {
      return apiClient.fetch(`/api/projects/${projectId}`);
    },

    /**
     * Update a project
     * @param {string} projectId - Project ID
     * @param {object} data - { name?, description?, status?, dueDate? }
     */
    update: (projectId, data) => {
      return apiClient.fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    /**
     * Delete a project
     * @param {string} projectId - Project ID
     */
    delete: (projectId) => {
      return apiClient.fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
    },

    /**
     * Invite user to project
     * @param {string} projectId - Project ID
     * @param {object} data - { email, role, userId }
     */
    invite: (projectId, data) => {
      return apiClient.fetch(`/api/projects/${projectId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
  },

  // DASHBOARD ENDPOINTS
  dashboard: {
    /**
     * Get dashboard projects
     * @param {number} limit - Optional limit
     */
    getProjects: (limit) => {
      const query = limit ? `?limit=${limit}` : '';
      return apiClient.fetch(`/api/dashboard/projects${query}`);
    },

    /**
     * Get activity feed
     */
    getActivity: () => {
      return apiClient.fetch('/api/dashboard/activity');
    },
  },

  // TASKS ENDPOINTS
  tasks: {
    /**
     * Get all tasks
     * @param {number} limit - Optional limit
     */
    getAll: (limit) => {
      const query = limit ? `?limit=${limit}` : '';
      return apiClient.fetch(`/api/tasks/all${query}`);
    },

    /**
     * Create a task
     * @param {string} projectId - Project ID
     * @param {object} data - { title, description, assigneeId?, dueDate?, priority?, creatorId, files? }
     */
    create: (projectId, data) => {
      return apiClient.fetch(`/api/tasks/create/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
  },
};