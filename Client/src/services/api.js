const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  getAuthToken() {
    return sessionStorage.getItem('token');
  }

  // Helper method to set auth token
  setAuthToken(token) {
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
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
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
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