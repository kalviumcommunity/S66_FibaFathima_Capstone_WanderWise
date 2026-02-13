// Get API base URL from environment variables
// Supports both VITE_API_BASE_URL and VITE_API_BASE for compatibility
const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // Check for VITE_API_BASE_URL first (preferred)
    if (import.meta.env.VITE_API_BASE_URL) {
      // Ensure it ends with /api if not already included
      const url = import.meta.env.VITE_API_BASE_URL;
      return url.endsWith('/api') ? url : `${url}/api`;
    }
    // Fallback to VITE_API_BASE (alternative naming)
    if (import.meta.env.VITE_API_BASE) {
      const url = import.meta.env.VITE_API_BASE;
      return url.endsWith('/api') ? url : `${url}/api`;
    }
  }

  // Development fallback - match server default port (5002)
  // Check if we're in production by looking at the hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If deployed on Netlify, try to construct the Render URL
    // This is a fallback - ideally VITE_API_BASE_URL should be set in Netlify
    if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
      console.warn('VITE_API_BASE_URL not set. Please configure it in Netlify environment variables.');
    }
  }

  // Local development fallback
  return 'http://localhost:5002/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;

    // Log API configuration in development
    if (import.meta.env.DEV) {
      console.log('🌐 API Configuration:', {
        baseURL: this.baseURL,
        envVar: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || 'Not set',
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A'
      });
    }
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Helper method to set auth token
  setAuthToken(token, remember = false) {
    if (token) {
      if (remember) {
        localStorage.setItem('token', token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('token');
      }
    } else {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  // Helper method to get headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle network errors
      if (!response) {
        throw new Error('Network error: No response from server');
      }

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Try to get text response for better error messages
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      const data = await response.json();

      if (!response.ok) {
        // Provide more detailed error information
        const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Enhanced error logging
      console.error('API request failed:', {
        url,
        endpoint,
        method: options.method || 'GET',
        error: error.message,
        status: error.status,
        baseURL: this.baseURL
      });

      // Provide user-friendly error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Unable to connect to server. Please check your internet connection and ensure the server is running.');
      }

      if (this.baseURL.includes('your-render-app.onrender.com')) {
        throw new Error('API URL not configured. Please set VITE_API_BASE_URL in your Netlify environment variables.');
      }

      throw error;
    }
  }

  // GET request
  async get(endpoint, includeAuth = true) {
    return this.request(endpoint, {
      method: 'GET',
      includeAuth,
    });
  }

  // POST request
  async post(endpoint, data, includeAuth = true) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      includeAuth,
    });
  }

  // PUT request
  async put(endpoint, data, includeAuth = true) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      includeAuth,
    });
  }

  // PATCH request
  async patch(endpoint, data, includeAuth = true) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      includeAuth,
    });
  }

  // DELETE request
  async delete(endpoint, includeAuth = true) {
    return this.request(endpoint, {
      method: 'DELETE',
      includeAuth,
    });
  }
}

export const apiService = new ApiService(); 