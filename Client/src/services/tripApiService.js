import { apiService } from './api';

class TripApiService {
  // Get all trips for the authenticated user
  async getTrips() {
    try {
      const response = await apiService.get('/trips');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get a specific trip by ID
  async getTrip(id) {
    try {
      const response = await apiService.get(`/trips/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create a new trip
  async createTrip(tripData) {
    try {
      const response = await apiService.post('/trips', tripData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update an existing trip
  async updateTrip(id, tripData) {
    try {
      const response = await apiService.put(`/trips/${id}`, tripData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete a trip
  async deleteTrip(id) {
    try {
      const response = await apiService.delete(`/trips/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add a day to trip itinerary
  async addDay(tripId, dayData) {
    try {
      const trip = await this.getTrip(tripId);
      const updatedItinerary = [...trip.itinerary, dayData];
      return await this.updateTrip(tripId, { itinerary: updatedItinerary });
    } catch (error) {
      throw error;
    }
  }

  // Update a specific day in the itinerary
  async updateDay(tripId, dayIndex, dayData) {
    try {
      const trip = await this.getTrip(tripId);
      const updatedItinerary = [...trip.itinerary];
      updatedItinerary[dayIndex] = { ...updatedItinerary[dayIndex], ...dayData };
      return await this.updateTrip(tripId, { itinerary: updatedItinerary });
    } catch (error) {
      throw error;
    }
  }

  // Add activity to a specific day
  async addActivity(tripId, dayIndex, activity) {
    try {
      const trip = await this.getTrip(tripId);
      const updatedItinerary = [...trip.itinerary];
      updatedItinerary[dayIndex].activities.push(activity);
      return await this.updateTrip(tripId, { itinerary: updatedItinerary });
    } catch (error) {
      throw error;
    }
  }

  // Remove activity from a specific day
  async removeActivity(tripId, dayIndex, activityIndex) {
    try {
      const trip = await this.getTrip(tripId);
      const updatedItinerary = [...trip.itinerary];
      updatedItinerary[dayIndex].activities.splice(activityIndex, 1);
      return await this.updateTrip(tripId, { itinerary: updatedItinerary });
    } catch (error) {
      throw error;
    }
  }
}

export const tripApiService = new TripApiService();
export default tripApiService;
