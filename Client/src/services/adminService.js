import { apiService } from './api';

class AdminService {
  // ========== DASHBOARD ==========
  
  // Get admin dashboard overview
  async getDashboard() {
    try {
      const response = await apiService.get('/admin/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== USER MANAGEMENT ==========
  
  // Get all users with pagination and filters
  async getUsers(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.get(`/admin/users?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get user details
  async getUserDetails(userId) {
    try {
      const response = await apiService.get(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update user role and status
  async updateUser(userId, userData) {
    try {
      const response = await apiService.patch(`/admin/users/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await apiService.delete(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== DESTINATION MANAGEMENT ==========
  
  // Admin create new destination
  async createDestination(destinationData) {
    try {
      const response = await apiService.post('/admin/destinations', destinationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all destinations with filters
  async getDestinations(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.get(`/admin/destinations?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Bulk approve destinations
  async bulkApproveDestinations(destinationIds) {
    try {
      const response = await apiService.post('/admin/destinations/bulk-approve', {
        destinationIds
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Bulk reject destinations
  async bulkRejectDestinations(destinationIds, reason = '') {
    try {
      const response = await apiService.post('/admin/destinations/bulk-reject', {
        destinationIds,
        reason
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== ANALYTICS ==========
  
  // Get user analytics
  async getUserAnalytics(period = '30') {
    try {
      const response = await apiService.get(`/admin/analytics/users?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get destination analytics
  async getDestinationAnalytics(period = '30') {
    try {
      const response = await apiService.get(`/admin/analytics/destinations?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();
