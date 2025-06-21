// Trip storage service for managing user trips and favorites

// Save a trip to localStorage
export const saveTrip = (tripData) => {
  try {
    const existingTrips = getUpcomingTrips();
    const newTrip = {
      id: Date.now().toString(),
      ...tripData,
      savedAt: new Date().toISOString(),
      status: 'upcoming'
    };
    
    const updatedTrips = [...existingTrips, newTrip];
    localStorage.setItem('wanderwise_upcoming_trips', JSON.stringify(updatedTrips));
    
    return newTrip;
  } catch (error) {
    console.error('Error saving trip:', error);
    throw new Error('Failed to save trip');
  }
};

// Get all upcoming trips
export const getUpcomingTrips = () => {
  try {
    const trips = localStorage.getItem('wanderwise_upcoming_trips');
    return trips ? JSON.parse(trips) : [];
  } catch (error) {
    console.error('Error getting upcoming trips:', error);
    return [];
  }
};

// Get all past trips
export const getPastTrips = () => {
  try {
    const trips = localStorage.getItem('wanderwise_past_trips');
    return trips ? JSON.parse(trips) : [];
  } catch (error) {
    console.error('Error getting past trips:', error);
    return [];
  }
};

// Mark a trip as completed (move from upcoming to past)
export const completeTrip = (tripId) => {
  try {
    const upcomingTrips = getUpcomingTrips();
    const pastTrips = getPastTrips();
    
    const tripIndex = upcomingTrips.findIndex(trip => trip.id === tripId);
    if (tripIndex === -1) {
      throw new Error('Trip not found');
    }
    
    const completedTrip = {
      ...upcomingTrips[tripIndex],
      status: 'completed',
      completedAt: new Date().toISOString()
    };
    
    // Remove from upcoming trips
    upcomingTrips.splice(tripIndex, 1);
    localStorage.setItem('wanderwise_upcoming_trips', JSON.stringify(upcomingTrips));
    
    // Add to past trips
    const updatedPastTrips = [...pastTrips, completedTrip];
    localStorage.setItem('wanderwise_past_trips', JSON.stringify(updatedPastTrips));
    
    return completedTrip;
  } catch (error) {
    console.error('Error completing trip:', error);
    throw new Error('Failed to complete trip');
  }
};

// Delete a trip
export const deleteTrip = (tripId, type = 'upcoming') => {
  try {
    if (type === 'upcoming') {
      const trips = getUpcomingTrips();
      const updatedTrips = trips.filter(trip => trip.id !== tripId);
      localStorage.setItem('wanderwise_upcoming_trips', JSON.stringify(updatedTrips));
    } else {
      const trips = getPastTrips();
      const updatedTrips = trips.filter(trip => trip.id !== tripId);
      localStorage.setItem('wanderwise_past_trips', JSON.stringify(updatedTrips));
    }
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw new Error('Failed to delete trip');
  }
};

// Favorite destinations management
export const getFavoriteDestinations = () => {
  try {
    const favorites = localStorage.getItem('wanderwise_favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const toggleFavorite = (destination) => {
  try {
    const favorites = getFavoriteDestinations();
    const existingIndex = favorites.findIndex(fav => fav.id === destination.id);
    
    if (existingIndex >= 0) {
      // Remove from favorites
      favorites.splice(existingIndex, 1);
    } else {
      // Add to favorites
      favorites.push({
        ...destination,
        favoritedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('wanderwise_favorites', JSON.stringify(favorites));
    return favorites;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Failed to update favorites');
  }
};

export const isDestinationFavorited = (destinationId) => {
  try {
    const favorites = getFavoriteDestinations();
    return favorites.some(fav => fav.id === destinationId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Get trip statistics
export const getTripStats = () => {
  try {
    const upcomingTrips = getUpcomingTrips();
    const pastTrips = getPastTrips();
    const favorites = getFavoriteDestinations();
    
    return {
      upcomingCount: upcomingTrips.length,
      pastCount: pastTrips.length,
      favoritesCount: favorites.length,
      totalTrips: upcomingTrips.length + pastTrips.length
    };
  } catch (error) {
    console.error('Error getting trip stats:', error);
    return {
      upcomingCount: 0,
      pastCount: 0,
      favoritesCount: 0,
      totalTrips: 0
    };
  }
}; 