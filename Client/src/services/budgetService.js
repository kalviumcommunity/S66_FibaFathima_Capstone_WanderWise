import { apiService } from './api';

/**
 * Budget Service - Manages trip budget tracking
 * Provides methods for CRUD operations on budget items
 */
class BudgetService {
  /**
   * Get budget for a specific trip
   * @param {string} tripId - Trip ID
   * @returns {Promise<Object>} Budget data with items and totals
   */
  async getTripBudget(tripId) {
    try {
      const response = await apiService.get(`/budget/trip/${tripId}`);
      return response;
    } catch (error) {
      console.error('Error fetching budget:', error);
      throw error;
    }
  }

  /**
   * Add a budget item to a trip
   * @param {Object} budgetData - Budget item data
   * @param {string} budgetData.tripId - Trip ID
   * @param {string} budgetData.category - Category (Transportation, Accommodation, Food, Activities, Miscellaneous)
   * @param {number} budgetData.amount - Amount
   * @param {string} [budgetData.currency='INR'] - Currency
   * @param {string} [budgetData.notes] - Notes
   * @returns {Promise<Object>} Created budget item
   */
  async addBudgetItem(budgetData) {
    try {
      const response = await apiService.post('/budget', budgetData);
      return response;
    } catch (error) {
      console.error('Error adding budget item:', error);
      throw error;
    }
  }

  /**
   * Update a budget item
   * @param {string} itemId - Budget item ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated budget item
   */
  async updateBudgetItem(itemId, updateData) {
    try {
      const response = await apiService.put(`/budget/${itemId}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating budget item:', error);
      throw error;
    }
  }

  /**
   * Delete a budget item
   * @param {string} itemId - Budget item ID
   * @returns {Promise<void>}
   */
  async deleteBudgetItem(itemId) {
    try {
      await apiService.delete(`/budget/${itemId}`);
    } catch (error) {
      console.error('Error deleting budget item:', error);
      throw error;
    }
  }

  /**
   * Delete all budget items for a trip
   * @param {string} tripId - Trip ID
   * @returns {Promise<void>}
   */
  async clearTripBudget(tripId) {
    try {
      await apiService.delete(`/budget/trip/${tripId}/all`);
    } catch (error) {
      console.error('Error clearing budget:', error);
      throw error;
    }
  }

  /**
   * Calculate budget summary
   * @param {Array} budgetItems - Array of budget items
   * @returns {Object} Budget summary with totals by category
   */
  calculateBudgetSummary(budgetItems) {
    const summary = {
      total: 0,
      byCategory: {},
      currency: budgetItems[0]?.currency || 'INR'
    };

    budgetItems.forEach(item => {
      summary.total += item.amount;
      if (!summary.byCategory[item.category]) {
        summary.byCategory[item.category] = 0;
      }
      summary.byCategory[item.category] += item.amount;
    });

    return summary;
  }
}

export const budgetService = new BudgetService();
