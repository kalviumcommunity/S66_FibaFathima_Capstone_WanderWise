import { apiService } from './api';

class DestinationService {
  // Get all approved destinations
  async getDestinations(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.sort) queryParams.append('sort', filters.sort);
      
      const endpoint = `/destinations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(endpoint, false); // No auth required for public destinations
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get destination by ID
  async getDestinationById(id) {
    try {
      const response = await apiService.get(`/destinations/${id}`, false); // No auth required
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Submit new destination (requires authentication)
  async submitDestination(destinationData) {
    try {
      const response = await apiService.post('/destinations', destinationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update destination (admin or creator only)
  async updateDestination(id, destinationData) {
    try {
      const response = await apiService.put(`/destinations/${id}`, destinationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete destination (admin or creator only)
  async deleteDestination(id) {
    try {
      const response = await apiService.delete(`/destinations/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add review to destination
  async addReview(destinationId, reviewData) {
    try {
      const response = await apiService.post(`/destinations/${destinationId}/reviews`, reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get popular destinations
  async getPopularDestinations() {
    try {
      const response = await apiService.get('/destinations?sort=popular', false);
      return response.filter(dest => dest.isPopular);
    } catch (error) {
      throw error;
    }
  }

  // Get destinations by country
  async getDestinationsByCountry(country) {
    try {
      const response = await apiService.get(`/destinations?country=${country}`, false);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Search destinations
  async searchDestinations(searchTerm) {
    try {
      const response = await apiService.get(`/destinations?search=${encodeURIComponent(searchTerm)}`, false);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all destinations (admin only)
  async getAllDestinations(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      const endpoint = `/admin/destinations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Approve destination (admin only)
  async approveDestination(id) {
    try {
      const response = await apiService.patch(`/admin/destinations/${id}/approve`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reject destination (admin only)
  async rejectDestination(id, reason) {
    try {
      const response = await apiService.patch(`/admin/destinations/${id}/reject`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Toggle popular status (admin only)
  async togglePopularStatus(id) {
    try {
      const response = await apiService.patch(`/admin/destinations/${id}/toggle-popular`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Bulk approve destinations (admin only)
  async bulkApproveDestinations(destinationIds) {
    try {
      const response = await apiService.post('/admin/destinations/bulk-approve', { destinationIds });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Bulk reject destinations (admin only)
  async bulkRejectDestinations(destinationIds, reason) {
    try {
      const response = await apiService.post('/admin/destinations/bulk-reject', { destinationIds, reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get destination statistics (admin only)
  async getDestinationStats() {
    try {
      const response = await apiService.get('/admin/destinations/stats');
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const destinationService = new DestinationService(); 