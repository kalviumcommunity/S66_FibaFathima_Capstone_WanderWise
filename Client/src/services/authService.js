import { apiService } from './api';

class AuthService {
  // User registration
  async signup(userData) {
    try {
      const response = await apiService.post('/auth/signup', userData, false);
      
      // Store token if provided
      if (response.token) {
        apiService.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // User login
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials, false);
      
      // Store token
      if (response.token) {
        apiService.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiService.get('/auth/profile');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/auth/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiService.put('/auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Save destination to user's list
  async saveDestination(destinationId) {
    try {
      const response = await apiService.post(`/auth/save-destination/${destinationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Remove destination from user's list
  async removeDestination(destinationId) {
    try {
      const response = await apiService.delete(`/auth/remove-destination/${destinationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user's saved destinations
  async getSavedDestinations() {
    try {
      const response = await apiService.get('/auth/saved-destinations');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  logout() {
    apiService.setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.getAuthToken();
  }

  // Get stored user data
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Store user data
  storeUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  }
}

export const authService = new AuthService(); 