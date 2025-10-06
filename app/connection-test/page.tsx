'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { 
  setStoredUserId, 
  getStoredUserId, 
  clearStoredUserId,
  buildAuthHeaders 
} from '../../lib/session-helper';

type ConnectionStatus = {
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
};

// Base URL for API
const BASE_URL = "https://project-management-api-e6xs.onrender.com";

export default function ConnectionTest() {
  const [results, setResults] = useState<ConnectionStatus[]>([]);
  const [testRunning, setTestRunning] = useState(false);
  const [user, setUser] = useState<{id: string, email: string} | null>(null);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('TestPassword1!');
  const [name, setName] = useState('Test User');

  // For demonstration, clear stored user ID on initial load
  useEffect(() => {
    const currentUserId = getStoredUserId();
    if (currentUserId) {
      setUser({ id: currentUserId, email: 'Previously logged in user' });
    }
  }, []);

  const addResult = (result: ConnectionStatus) => {
    setResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const logOut = () => {
    clearStoredUserId();
    setUser(null);
    addResult({
      endpoint: 'logout',
      status: 'success',
      message: 'Logged out successfully, user ID cleared from localStorage'
    });
  };

  // Test the backend connection
  const runConnectionTest = async () => {
    clearResults();
    setTestRunning(true);

    try {
      // Step 1: Test register endpoint
      addResult({
        endpoint: '/api/auth/register',
        status: 'pending',
        message: 'Testing registration API...'
      });
      
      const registerRes = await apiClient.fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (registerRes.ok) {
        addResult({
          endpoint: '/api/auth/register',
          status: 'success',
          message: 'Registration successful!',
          details: registerRes.data
        });
      } else {
        addResult({
          endpoint: '/api/auth/register',
          status: 'error',
          message: `Registration failed: ${registerRes.status}`,
          details: registerRes.data
        });
        // Continue with login test anyway as the user might already exist
      }

      // Step 2: Test login endpoint
      addResult({
        endpoint: '/api/auth/login',
        status: 'pending',
        message: 'Testing login API...'
      });
      
      const loginRes = await apiClient.fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (loginRes.ok && loginRes.data && loginRes.data.id) {
        const userId = loginRes.data.id;
        // Store the user ID for subsequent requests
        setStoredUserId(userId);
        setUser({ id: userId, email: loginRes.data.email });
        
        addResult({
          endpoint: '/api/auth/login',
          status: 'success',
          message: `Login successful! User ID ${userId} stored.`,
          details: loginRes.data
        });
        
        // Step 3: Test a protected endpoint with userId header
        addResult({
          endpoint: '/api/user/profile',
          status: 'pending',
          message: 'Testing profile API with X-User-Id header...'
        });
        
        // This should use the stored userId automatically via the apiClient
        const profileRes = await apiClient.fetch('/api/user/profile');
        
        if (profileRes.ok) {
          addResult({
            endpoint: '/api/user/profile',
            status: 'success',
            message: 'Profile fetch successful! X-User-Id header is working.',
            details: profileRes.data
          });
        } else {
          addResult({
            endpoint: '/api/user/profile',
            status: 'error',
            message: `Profile fetch failed: ${profileRes.status}. X-User-Id header may not be working.`,
            details: profileRes.data
          });
        }
        
        // Step 4: Test the header building function directly
        const headers = buildAuthHeaders();
        addResult({
          endpoint: 'buildAuthHeaders',
          status: 'success',
          message: `Headers built: ${JSON.stringify(headers)}`,
          details: headers
        });
      } else {
        addResult({
          endpoint: '/api/auth/login',
          status: 'error',
          message: `Login failed: ${loginRes.status}`,
          details: loginRes.data
        });
      }
    } catch (error) {
      addResult({
        endpoint: 'connection',
        status: 'error',
        message: `Connection test failed with an exception`,
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setTestRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">API Base URL:</label>
          <div className="p-2 bg-gray-100 rounded">{BASE_URL}</div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Test Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Test Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Test Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={runConnectionTest} 
            disabled={testRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {testRunning ? 'Testing...' : 'Run Connection Test'}
          </button>
          
          <button 
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Results
          </button>
          
          {user && (
            <button 
              onClick={logOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Session Status</h2>
        {user ? (
          <div className="p-3 bg-green-100 text-green-800 rounded">
            <p><strong>User logged in</strong></p>
            <p>User ID: {user.id}</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
            <p>No user logged in</p>
            <p>X-User-Id header will not be sent with requests</p>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        {results.length === 0 ? (
          <div className="p-4 border rounded text-center text-gray-500">
            No tests have been run yet
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded ${
                  result.status === 'success' ? 'bg-green-50 border-green-200' : 
                  result.status === 'error' ? 'bg-red-50 border-red-200' : 
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="font-semibold">{result.endpoint}</div>
                <div className="mt-1">{result.message}</div>
                {result.details && (
                  <div className="mt-2">
                    <details>
                      <summary className="cursor-pointer text-sm">View Details</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}