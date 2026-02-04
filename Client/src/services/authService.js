import { apiService } from './api';

class AuthService {
  // User registration
  async signup(userData) {
    const response = await apiService.post('/auth/signup', userData, false);
    
    // Store token if provided
    if (response.token) {
      apiService.setAuthToken(response.token);
    }
    
    return response;
  }

  // User login
  async login(credentials, remember = false) {
    const response = await apiService.post('/auth/login', credentials, false);

    // Store token
    if (response.token) {
      apiService.setAuthToken(response.token, remember);
    }

    return response;
  }

  // Google OAuth login
  async googleLogin(credential) {
    const response = await apiService.post('/auth/google', { credential }, false);

    // Store token
    if (response.token) {
      apiService.setAuthToken(response.token);
    }

    return response;
  }

  // Get current user profile
  async getProfile() {
    const response = await apiService.get('/auth/profile');
    return response;
  }

  // Update user profile
  async updateProfile(profileData) {
    const response = await apiService.put('/auth/profile', profileData);
    return response;
  }

  // Change password
  async changePassword(passwordData) {
    const response = await apiService.put('/auth/change-password', passwordData);
    return response;
  }

  // Save destination to user's list
  async saveDestination(destinationId) {
    const response = await apiService.post(`/auth/save-destination/${destinationId}`);
    return response;
  }

  // Remove destination from user's list
  async removeDestination(destinationId) {
    const response = await apiService.delete(`/auth/remove-destination/${destinationId}`);
    return response;
  }

  // Get user's saved destinations
  async getSavedDestinations() {
    const response = await apiService.get('/auth/saved-destinations');
    return response;
  }

  // Logout user
  logout() {
    apiService.setAuthToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    // Also clear localStorage for any existing data
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.getAuthToken();
  }

  // Get stored user data
  getStoredUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Store user data
  storeUser(userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('isLoggedIn', 'true');
  }
}

export const authService = new AuthService(); 